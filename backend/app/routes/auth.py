import random
import string
import httpx
from datetime import datetime, timedelta, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from passlib.context import CryptContext

from app.core.database import get_db
from app.core.config import settings
from app.core.security import create_access_token, create_refresh_token, decode_token, get_current_user
from app.models.user import User, AuthProvider
from app.models.otp import OTPRecord
from app.schemas.auth import (
    RegisterRequest, LoginRequest, SendOTPRequest, VerifyOTPRequest,
    RefreshRequest, AuthResponse, TokenResponse, UserResponse,
)

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)

def generate_otp(length: int = 6) -> str:
    return "".join(random.choices(string.digits, k=length))

async def send_otp_sms(phone: str, otp: str):
    if not settings.MSG91_AUTH_KEY:
        print(f"[DEV] OTP for {phone}: {otp}")
        return
    async with httpx.AsyncClient() as client:
        resp = await client.post(
            "https://api.msg91.com/api/v5/otp",
            params={
                "template_id": settings.MSG91_TEMPLATE_ID,
                "mobile": phone,
                "authkey": settings.MSG91_AUTH_KEY,
                "otp": otp,
            },
        )
        if resp.status_code != 200:
            raise HTTPException(status_code=502, detail="Failed to send OTP")


@router.post("/register", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
async def register(payload: RegisterRequest, db: AsyncSession = Depends(get_db)):
    existing = await db.execute(select(User).where(User.email == payload.email))
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=409, detail="Email already registered")

    user = User(
        name=payload.name,
        email=payload.email,
        hashed_password=hash_password(payload.password),
        phone=payload.phone,
        city=payload.city,
        employment_type=payload.employment_type,
        income_band=payload.income_band,
        auth_provider=AuthProvider.EMAIL,
        is_verified=False,
    )
    db.add(user)
    await db.flush()

    return AuthResponse(
        user=UserResponse.model_validate(user),
        access_token=create_access_token(user.id),
        refresh_token=create_refresh_token(user.id),
    )


@router.post("/login", response_model=AuthResponse)
async def login(payload: LoginRequest, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == payload.email))
    user = result.scalar_one_or_none()

    if not user or not user.hashed_password or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    if not user.is_active:
        raise HTTPException(status_code=403, detail="Account is disabled")

    return AuthResponse(
        user=UserResponse.model_validate(user),
        access_token=create_access_token(user.id),
        refresh_token=create_refresh_token(user.id),
    )


@router.post("/refresh", response_model=TokenResponse)
async def refresh_token(payload: RefreshRequest, db: AsyncSession = Depends(get_db)):
    data = decode_token(payload.refresh_token)
    if not data or data.get("type") != "refresh":
        raise HTTPException(status_code=401, detail="Invalid refresh token")

    result = await db.execute(select(User).where(User.id == data["sub"]))
    user = result.scalar_one_or_none()
    if not user or not user.is_active:
        raise HTTPException(status_code=401, detail="User not found")

    return TokenResponse(
        access_token=create_access_token(user.id),
        refresh_token=create_refresh_token(user.id),
    )


@router.post("/logout")
async def logout(current_user: User = Depends(get_current_user)):
    return {"message": "Logged out successfully"}


@router.post("/otp/send")
async def send_otp(payload: SendOTPRequest, db: AsyncSession = Depends(get_db)):
    cutoff = datetime.now(timezone.utc) - timedelta(minutes=10)
    result = await db.execute(
        select(OTPRecord).where(
            OTPRecord.phone == payload.phone,
            OTPRecord.created_at >= cutoff,
        )
    )
    if len(result.scalars().all()) >= 3:
        raise HTTPException(status_code=429, detail="Too many OTP requests. Try again in 10 minutes.")

    otp_code = generate_otp()
    record = OTPRecord(
        phone=payload.phone,
        otp_code=otp_code,
        expires_at=datetime.now(timezone.utc) + timedelta(minutes=10),
    )
    db.add(record)
    await db.flush()
    await send_otp_sms(payload.phone, otp_code)
    return {"message": f"OTP sent to {payload.phone}"}


@router.post("/otp/verify", response_model=AuthResponse)
async def verify_otp(payload: VerifyOTPRequest, db: AsyncSession = Depends(get_db)):
    now = datetime.now(timezone.utc)
    result = await db.execute(
        select(OTPRecord).where(
            OTPRecord.phone == payload.phone,
            OTPRecord.is_used == False,
            OTPRecord.expires_at > now,
        ).order_by(OTPRecord.created_at.desc())
    )
    record = result.scalars().first()

    if not record:
        raise HTTPException(status_code=400, detail="OTP expired or not found")

    record.attempts += 1
    if record.attempts > 5:
        raise HTTPException(status_code=429, detail="Too many attempts")

    if record.otp_code != payload.otp_code:
        raise HTTPException(status_code=400, detail="Invalid OTP")

    record.is_used = True

    result = await db.execute(select(User).where(User.phone == payload.phone))
    user = result.scalar_one_or_none()

    if not user:
        user = User(
            name=payload.name or f"User {payload.phone[-4:]}",
            phone=payload.phone,
            city=payload.city,
            employment_type=payload.employment_type,
            income_band=payload.income_band,
            auth_provider=AuthProvider.PHONE,
            is_verified=True,
        )
        db.add(user)
        await db.flush()
    else:
        user.is_verified = True

    return AuthResponse(
        user=UserResponse.model_validate(user),
        access_token=create_access_token(user.id),
        refresh_token=create_refresh_token(user.id),
    )


@router.get("/google")
async def google_login():
    params = {
        "client_id": settings.GOOGLE_CLIENT_ID,
        "redirect_uri": settings.GOOGLE_REDIRECT_URI,
        "response_type": "code",
        "scope": "openid email profile",
        "access_type": "offline",
    }
    query = "&".join(f"{k}={v}" for k, v in params.items())
    return {"url": f"https://accounts.google.com/o/oauth2/v2/auth?{query}"}


@router.get("/google/callback", response_model=AuthResponse)
async def google_callback(code: str, db: AsyncSession = Depends(get_db)):
    async with httpx.AsyncClient() as client:
        token_resp = await client.post(
            "https://oauth2.googleapis.com/token",
            data={
                "code": code,
                "client_id": settings.GOOGLE_CLIENT_ID,
                "client_secret": settings.GOOGLE_CLIENT_SECRET,
                "redirect_uri": settings.GOOGLE_REDIRECT_URI,
                "grant_type": "authorization_code",
            },
        )
        if token_resp.status_code != 200:
            raise HTTPException(status_code=400, detail="Google OAuth failed")
        google_tokens = token_resp.json()
        userinfo_resp = await client.get(
            "https://www.googleapis.com/oauth2/v3/userinfo",
            headers={"Authorization": f"Bearer {google_tokens['access_token']}"},
        )
        google_user = userinfo_resp.json()

    google_id = google_user.get("sub")
    email = google_user.get("email")
    name = google_user.get("name", "")

    result = await db.execute(
        select(User).where((User.google_id == google_id) | (User.email == email))
    )
    user = result.scalar_one_or_none()

    if user:
        user.google_id = google_id
        user.is_verified = True
    else:
        user = User(
            name=name,
            email=email,
            google_id=google_id,
            auth_provider=AuthProvider.GOOGLE,
            is_verified=True,
        )
        db.add(user)
        await db.flush()

    return AuthResponse(
        user=UserResponse.model_validate(user),
        access_token=create_access_token(user.id),
        refresh_token=create_refresh_token(user.id),
    )


@router.get("/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_user)):
    return UserResponse.model_validate(current_user)