import { useState, useEffect, useRef } from 'react'
import {
  Send, Paperclip, Video, ArrowLeft, MoreVertical, CheckCheck, Sparkles
} from 'lucide-react'
import { useRouter } from '../context/RouterContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { Badge } from '../components/ui.jsx'
import { CHAT_SEEDS, DEFAULT_CHAT_SEED } from '../data/chatSeeds.js'
import { getPropertyById, formatINR } from '../data/properties.js'
import { getPromoterById } from '../data/promoters.js'

const SMART_REPLIES = [
  'Is this still available?',
  'What is the booking amount?',
  'Can I schedule a site visit?',
]

export default function ChatPage() {
  const { params, navigate } = useRouter()
  const { user, requireAuth } = useAuth()
  const propertyId = params.get('property')
  const property = propertyId ? getPropertyById(propertyId) : null
  const promoter = property ? getPromoterById(property.promoterId) : null

  const [messages, setMessages] = useState(
    property ? CHAT_SEEDS[property.id] || DEFAULT_CHAT_SEED : DEFAULT_CHAT_SEED
  )
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const scrollRef = useRef(null)

  useEffect(() => {
    if (!requireAuth('chat')) return
  }, [])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, isTyping])

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-5 py-24 text-center">
        <Sparkles size={32} className="text-gold mx-auto mb-4" />
        <h2 className="font-display font-bold text-navy text-xl mb-2">Sign in to access chat</h2>
        <p className="text-sm text-ink/55">Registration is required to message promoters directly.</p>
      </div>
    )
  }

  const sendMessage = (text) => {
    const content = text ?? input
    if (!content.trim()) return
    const newMsg = {
      id: 'm' + Date.now(),
      sender: 'user',
      text: content,
      time: new Date().toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' }),
    }
    setMessages((prev) => [...prev, newMsg])
    setInput('')
    setIsTyping(true)

    setTimeout(() => {
      setIsTyping(false)
      setMessages((prev) => [
        ...prev,
        {
          id: 'm' + (Date.now() + 1),
          sender: 'promoter',
          text: pickReply(content),
          time: new Date().toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' }),
        },
      ])
    }, 1600)
  }

  return (
    <div className="max-w-4xl mx-auto px-0 sm:px-5 py-0 sm:py-8">
      <div className="bg-white sm:rounded-2xl shadow-card overflow-hidden flex flex-col h-[calc(100vh-72px)] sm:h-[640px]">
        {/* Header */}
        <div className="flex items-center gap-3 px-4 sm:px-5 py-3.5 border-b border-navy-50 shrink-0">
          <button onClick={() => navigate('properties')} className="sm:hidden p-1">
            <ArrowLeft size={20} className="text-navy" />
          </button>
          {promoter ? (
            <img src={promoter.logo} alt={promoter.name} className="w-10 h-10 rounded-full" />
          ) : (
            <span className="w-10 h-10 rounded-full bg-navy-50 flex items-center justify-center text-navy font-bold">P</span>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-navy truncate">{promoter?.name || 'Promoter'}</p>
            <p className="text-xs text-success flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-success" /> Active now
            </p>
          </div>
          <button className="w-9 h-9 rounded-full hover:bg-navy-50 flex items-center justify-center text-ink/50" aria-label="Start video call">
            <Video size={18} />
          </button>
          <button className="w-9 h-9 rounded-full hover:bg-navy-50 flex items-center justify-center text-ink/50">
            <MoreVertical size={18} />
          </button>
        </div>

        {/* Property reference card */}
        {property && (
          <button
            onClick={() => navigate(`property/${property.id}`)}
            className="flex items-center gap-3 px-4 sm:px-5 py-3 bg-navy-50/50 border-b border-navy-50 text-left shrink-0"
          >
            <img src={property.coverImage} alt={property.name} className="w-12 h-12 rounded-lg object-cover" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-navy truncate">{property.name}</p>
              <p className="text-[11px] text-ink/50">{formatINR(property.priceMin)} – {formatINR(property.priceMax)}</p>
            </div>
            <Badge tone="navy">View</Badge>
          </button>
        )}

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 sm:px-5 py-5 space-y-3 scrollbar-thin">
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}
          {isTyping && <TypingIndicator />}
        </div>

        {/* Smart replies */}
        <div className="flex gap-2 px-4 sm:px-5 pb-2 overflow-x-auto no-scrollbar shrink-0">
          {SMART_REPLIES.map((reply) => (
            <button
              key={reply}
              onClick={() => sendMessage(reply)}
              className="shrink-0 px-3.5 py-1.5 rounded-full border border-navy-100 text-xs font-medium text-ink/60 hover:border-navy-400 hover:text-navy transition-colors"
            >
              {reply}
            </button>
          ))}
        </div>

        {/* Composer */}
        <div className="flex items-center gap-2 px-4 sm:px-5 py-3.5 border-t border-navy-50 shrink-0">
          <button
            className="w-9 h-9 rounded-full hover:bg-navy-50 flex items-center justify-center text-ink/50 shrink-0"
            aria-label="Attach file"
          >
            <Paperclip size={18} />
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Type a message…"
            className="flex-1 px-4 py-2.5 rounded-full bg-navy-50/60 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim()}
            className="w-10 h-10 rounded-full bg-navy text-white flex items-center justify-center disabled:opacity-40 shrink-0"
            aria-label="Send message"
          >
            <Send size={16} />
          </button>
        </div>
      </div>

      <p className="text-center text-xs text-ink/35 mt-4 px-5">
        Video calling and in-app document signing are coming in a future release.
      </p>
    </div>
  )
}

function MessageBubble({ message }) {
  const isUser = message.sender === 'user'
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[78%] sm:max-w-[65%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
          isUser ? 'bg-navy text-white rounded-br-md' : 'bg-navy-50 text-ink rounded-bl-md'
        }`}
      >
        {message.text}
        <div
          className={`flex items-center gap-1 mt-1 text-[10px] ${
            isUser ? 'text-white/45 justify-end' : 'text-ink/40'
          }`}
        >
          {message.time}
          {isUser && <CheckCheck size={12} />}
        </div>
      </div>
    </div>
  )
}

function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="bg-navy-50 px-4 py-3 rounded-2xl rounded-bl-md flex items-center gap-1">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-navy/40 animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  )
}

function pickReply(userText) {
  const text = userText.toLowerCase()
  if (text.includes('booking') || text.includes('amount')) {
    return '₹50,000 booking amount, fully adjustable against the total unit price.'
  }
  if (text.includes('available') || text.includes('still')) {
    return 'Yes, it\u2019s currently available — would you like me to hold it for you while you decide?'
  }
  if (text.includes('visit') || text.includes('schedule')) {
    return 'Sure — we have site visit slots Saturday and Sunday, morning or afternoon. Which works better?'
  }
  if (text.includes('floor')) {
    return 'We have units on multiple floors right now — let me know your preferred floor range and I\u2019ll confirm availability.'
  }
  return 'Thanks for the message — let me check with the site team and get back to you shortly with exact details.'
}
