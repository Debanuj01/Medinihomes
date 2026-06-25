from pydantic import BaseModel, EmailStr, field_validator
from typing import Optional
from datetime import datetime
from app.models.user import AuthProvider, EmploymentType
import re

class RegisterRequest(BaseModel):
    name: str
    email: EmailStr
    password: str
    phone: Optional[str] = None
    city: Optional[str] = None
    employment_type: Optional[EmploymentType] = None
    income_band: Optional[str] = None

    @field_validator("password")
    @classmethod
    def password_strength(cls, v):
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters")
        return v

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class SendOTPRequest(BaseModel):
    phone: str

class VerifyOTPRequest(BaseModel):
    phone: str
    otp_code: str
    name: Optional[str] = None
    city: Optional[str] = None
    employment_type: Optional[EmploymentType] = None
    income_band: Optional[str] = None

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"

class RefreshRequest(BaseModel):
    refresh_token: str

class UserResponse(BaseModel):
    id: str
    name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    city: Optional[str] = None
    employment_type: Optional[EmploymentType] = None
    income_band: Optional[str] = None
    auth_provider: AuthProvider
    is_verified: bool
    created_at: datetime
    model_config = {"from_attributes": True}

class AuthResponse(BaseModel):
    user: UserResponse
    access_token: str
    refresh_token: str
    token_type: str = "bearer"

class UpdateProfileRequest(BaseModel):
    name: Optional[str] = None
    city: Optional[str] = None
    employment_type: Optional[EmploymentType] = None
    income_band: Optional[str] = None