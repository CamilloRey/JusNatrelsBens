'use client'

import { useState } from 'react'
import { submitFeedback } from '@/lib/feedback/feedback-system'

export function FeedbackWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [step, setStep] = useState<'initial' | 'form' | 'success'>('initial')
  const [feedback, setFeedback] = useState({
    type: 'general' as const,
    rating: 4,
    title: '',
    message: '',
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setLoading(true)
    const success = await submitFeedback({
      ...feedback,
      userId: 'anonymous',
      email: feedback.title || 'anonymous@example.com',
      page: typeof window !== 'undefined' ? window.location.pathname : '/',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      resolved: false,
    })

    setLoading(false)

    if (success) {
      setStep('success')
      setTimeout(() => {
        setIsOpen(false)
        setStep('initial')
        setFeedback({
          type: 'general',
          rating: 4,
          title: '',
          message: '',
        })
      }, 2000)
    }
  }

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => {
          setIsOpen(!isOpen)
          setStep('initial')
        }}
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          width: 56,
          height: 56,
          borderRadius: '50%',
          background: '#e91e63',
          color: '#fff',
          border: 'none',
          cursor: 'pointer',
          fontSize: 24,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          zIndex: 999,
          transition: 'transform 0.2s',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.transform = 'scale(1.1)')}
        onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.transform = 'scale(1)')}
        title="Send Feedback"
      >
        💬
      </button>

      {/* Modal */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: 100,
            right: 24,
            width: 360,
            maxWidth: 'calc(100vw - 48px)',
            background: '#fff',
            borderRadius: 12,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
            zIndex: 1000,
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <div
            style={{
              background: '#e91e63',
              color: '#fff',
              padding: 20,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>Share Your Feedback</h3>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#fff',
                fontSize: 20,
                cursor: 'pointer',
              }}
            >
              ✕
            </button>
          </div>

          {/* Content */}
          <div style={{ padding: 20 }}>
            {step === 'initial' && (
              <div style={{ display: 'grid', gap: 12 }}>
                <p style={{ margin: 0, fontSize: 14, color: '#666' }}>
                  Help us improve by sharing your feedback!
                </p>
                <button
                  onClick={() => setStep('form')}
                  style={{
                    padding: '12px 16px',
                    background: '#e91e63',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 8,
                    cursor: 'pointer',
                    fontWeight: 600,
                  }}
                >
                  Share Feedback
                </button>
              </div>
            )}

            {step === 'form' && (
              <div style={{ display: 'grid', gap: 16 }}>
                {/* Type */}
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 8 }}>
                    Type
                  </label>
                  <select
                    value={feedback.type}
                    onChange={(e) =>
                      setFeedback({ ...feedback, type: e.target.value as any })
                    }
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: 6,
                      border: '1px solid #ddd',
                      fontSize: 12,
                    }}
                  >
                    <option value="general">General</option>
                    <option value="bug">Bug Report</option>
                    <option value="feature">Feature Request</option>
                    <option value="improvement">Improvement</option>
                  </select>
                </div>

                {/* Rating */}
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 8 }}>
                    How satisfied are you?
                  </label>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {[1, 2, 3, 4, 5].map((r) => (
                      <button
                        key={r}
                        onClick={() => setFeedback({ ...feedback, rating: r as any })}
                        style={{
                          flex: 1,
                          padding: '8px',
                          background: feedback.rating >= r ? '#e91e63' : '#f0f0f0',
                          color: feedback.rating >= r ? '#fff' : '#666',
                          border: 'none',
                          borderRadius: 6,
                          cursor: 'pointer',
                          fontWeight: 600,
                        }}
                      >
                        {r} ⭐
                      </button>
                    ))}
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 8 }}>
                    Title
                  </label>
                  <input
                    type="text"
                    placeholder="Brief subject"
                    value={feedback.title}
                    onChange={(e) => setFeedback({ ...feedback, title: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: 6,
                      border: '1px solid #ddd',
                      fontSize: 12,
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                {/* Message */}
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 8 }}>
                    Message
                  </label>
                  <textarea
                    placeholder="Tell us more..."
                    value={feedback.message}
                    onChange={(e) => setFeedback({ ...feedback, message: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: 6,
                      border: '1px solid #ddd',
                      fontSize: 12,
                      minHeight: 80,
                      fontFamily: 'inherit',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                {/* Buttons */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <button
                    onClick={() => setStep('initial')}
                    style={{
                      padding: '10px',
                      background: '#f0f0f0',
                      color: '#666',
                      border: 'none',
                      borderRadius: 6,
                      cursor: 'pointer',
                      fontWeight: 600,
                    }}
                  >
                    Back
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={loading || !feedback.message}
                    style={{
                      padding: '10px',
                      background: '#e91e63',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 6,
                      cursor: loading || !feedback.message ? 'not-allowed' : 'pointer',
                      fontWeight: 600,
                      opacity: loading || !feedback.message ? 0.5 : 1,
                    }}
                  >
                    {loading ? 'Sending...' : 'Send'}
                  </button>
                </div>
              </div>
            )}

            {step === 'success' && (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
                <h4 style={{ margin: '0 0 8px', fontWeight: 600 }}>Thank you!</h4>
                <p style={{ margin: 0, fontSize: 12, color: '#666' }}>
                  Your feedback helps us improve.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
