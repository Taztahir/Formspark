import { useState, useRef, useCallback } from 'react'

const FORMSPARK_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/submit`

// Allowed HTML tags stripped from input — pure text only
const sanitizeInput = (str) => {
  if (typeof str !== 'string') return ''
  return str
    .replace(/<[^>]*>/g, '')           // strip HTML tags
    .replace(/javascript:/gi, '')       // strip javascript: protocol
    .replace(/on\w+\s*=/gi, '')         // strip event handlers
    .trim()
    .slice(0, 5000)                     // hard cap at 5000 chars per field
}

const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

const validateForm = (data) => {
  const errors = {}
  if (!data.name || data.name.length < 2)
    errors.name = 'Name must be at least 2 characters'
  if (data.name && data.name.length > 100)
    errors.name = 'Name must be under 100 characters'
  if (!data.email || !validateEmail(data.email))
    errors.email = 'Please enter a valid email address'
  if (!data.message || data.message.length < 10)
    errors.message = 'Message must be at least 10 characters'
  if (data.message && data.message.length > 5000)
    errors.message = 'Message must be under 5000 characters'
  return errors
}

export const ContactForm = ({ token, successMessage, className = '' }) => {
  const [status, setStatus] = useState('idle') // idle|loading|success|error
  const [errors, setErrors] = useState({})
  const [errorMsg, setErrorMsg] = useState('')
  const [charCount, setCharCount] = useState(0)
  const submitTimeRef = useRef(Date.now())
  const formRef = useRef(null)

  // Timing check — bots submit instantly, humans take at least 3 seconds
  const getTimeSinceMount = () => Date.now() - submitTimeRef.current

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault()
    setErrors({})
    setErrorMsg('')

    const formData = new FormData(e.target)
    const raw = Object.fromEntries(formData)

    // --- SECURITY CHECK 1: Honeypot ---
    // If the hidden _honey field has any value, it's a bot — silently fake success
    if (raw._honey) {
      setStatus('success')
      return
    }

    // --- SECURITY CHECK 2: Timing check ---
    // Real humans take more than 1.5 seconds to fill a form
    if (getTimeSinceMount() < 1500) {
      setStatus('success') // silently fake success for bots
      return
    }

    // --- SECURITY CHECK 3: Sanitize all inputs ---
    const sanitized = {
      name: sanitizeInput(raw.name),
      email: sanitizeInput(raw.email),
      message: sanitizeInput(raw.message),
    }

    // --- SECURITY CHECK 4: Validate sanitized inputs ---
    const validationErrors = validateForm(sanitized)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    // --- SECURITY CHECK 5: Token must come from env, never hardcoded ---
    const formToken = token || import.meta.env.VITE_FORMSPARK_TOKEN
    if (!formToken) {
      setErrorMsg('Form configuration error. Please contact the site owner.')
      setStatus('error')
      return
    }

    setStatus('loading')

    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10s timeout

      const res = await fetch(`${FORMSPARK_URL}/${formToken}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest', // CSRF signal
        },
        body: JSON.stringify(sanitized),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (res.status === 429) {
        setStatus('error')
        setErrorMsg('Too many submissions. Please wait a few minutes and try again.')
        return
      }

      if (res.status === 403) {
        setStatus('error')
        setErrorMsg('This form is not authorized to submit from this domain.')
        return
      }

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || `Server error: ${res.status}`)
      }

      setStatus('success')
      formRef.current?.reset()
      setCharCount(0)

    } catch (err) {
      if (err.name === 'AbortError') {
        setErrorMsg('Request timed out. Please check your connection and try again.')
      } else {
        setErrorMsg(err.message || 'Something went wrong. Please try again.')
      }
      setStatus('error')
    }
  }, [token])

  if (status === 'success') {
    return (
      <div className={`p-8 border-2 border-black text-center space-y-4 ${className}`}>
        <div className="text-5xl">✅</div>
        <h3 className="text-xl font-bold uppercase">Message Sent!</h3>
        <p className="text-gray-600">
          {successMessage || "Thanks for reaching out. We'll get back to you shortly."}
        </p>
        <button
          onClick={() => { setStatus('idle'); submitTimeRef.current = Date.now() }}
          className="underline text-sm uppercase font-bold hover:text-gray-600 transition-colors"
        >
          Send another message
        </button>
      </div>
    )
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className={`p-8 border-2 border-black space-y-4 ${className}`}
      noValidate
    >
      {/* SECURITY: Honeypot field — invisible to humans, bots fill it */}
      <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', opacity: 0, pointerEvents: 'none' }}>
        <input
          type="text"
          name="_honey"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {/* Name */}
      <div className="space-y-1">
        <input
          type="text"
          name="name"
          className={`w-full border-b-2 p-2 focus:outline-none bg-transparent transition-colors ${
            errors.name ? 'border-red-500' : 'border-black'
          }`}
          placeholder="Name"
          maxLength={100}
          required
          disabled={status === 'loading'}
          aria-label="Your name"
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? 'name-error' : undefined}
        />
        {errors.name && (
          <p id="name-error" className="text-red-600 text-xs font-medium" role="alert">
            {errors.name}
          </p>
        )}
      </div>

      {/* Email */}
      <div className="space-y-1">
        <input
          type="email"
          name="email"
          className={`w-full border-b-2 p-2 focus:outline-none bg-transparent transition-colors ${
            errors.email ? 'border-red-500' : 'border-black'
          }`}
          placeholder="Email"
          maxLength={254}
          required
          disabled={status === 'loading'}
          aria-label="Your email address"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'email-error' : undefined}
        />
        {errors.email && (
          <p id="email-error" className="text-red-600 text-xs font-medium" role="alert">
            {errors.email}
          </p>
        )}
      </div>

      {/* Message */}
      <div className="space-y-1">
        <textarea
          name="message"
          className={`w-full border-b-2 p-2 h-32 focus:outline-none bg-transparent resize-none transition-colors ${
            errors.message ? 'border-red-500' : 'border-black'
          }`}
          placeholder="Message"
          maxLength={5000}
          required
          disabled={status === 'loading'}
          aria-label="Your message"
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? 'message-error' : undefined}
          onChange={(e) => setCharCount(e.target.value.length)}
        />
        <div className="flex justify-between items-center">
          {errors.message ? (
            <p id="message-error" className="text-red-600 text-xs font-medium" role="alert">
              {errors.message}
            </p>
          ) : <span />}
          <span className={`text-xs ${charCount > 4500 ? 'text-red-500' : 'text-gray-400'}`}>
            {charCount}/5000
          </span>
        </div>
      </div>

      {/* Global error */}
      {status === 'error' && errorMsg && (
        <div className="bg-red-50 border border-red-200 rounded p-3" role="alert">
          <p className="text-red-700 text-sm font-medium">{errorMsg}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full bg-black text-white p-4 font-bold uppercase
                   disabled:opacity-50 disabled:cursor-not-allowed
                   hover:bg-gray-800 active:bg-gray-900
                   transition-all duration-150 flex items-center justify-center gap-2"
      >
        {status === 'loading' ? (
          <>
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
            </svg>
            Sending...
          </>
        ) : 'Send Message'}
      </button>

      {/* GDPR notice */}
      <p className="text-xs text-gray-400 text-center">
        Your data is handled securely and never shared with third parties.
      </p>
    </form>
  )
}

export default ContactForm
