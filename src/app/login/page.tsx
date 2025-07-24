'use client'
import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const handleMagicLink = async () => {
      const code = searchParams.get('code')
      console.log('[Login] Loaded with code:', code)

      if (code) {
        console.log('[Login] Attempting to exchange code for session...')
        const { error } = await supabase.auth.exchangeCodeForSession(code)

        if (error) {
          console.error('[Login] Session exchange failed:', error.message)
        } else {
          console.log('[Login] Session exchange successful. Redirecting to /dashboard...')
          setTimeout(() => {
            router.replace('/dashboard')
          }, 50) // slight delay to ensure cookie is set
        }
      } else {
        // Check for existing session (if user comes to /login manually)
        console.log('[Login] No code in URL. Checking if already logged in...')
        const { data: { session } } = await supabase.auth.getSession()

        if (session) {
          console.log('[Login] Session exists. Redirecting to /dashboard...')
          router.replace('/dashboard')
        } else {
          console.log('[Login] No session found. Staying on login page.')
        }
      }
    }

    handleMagicLink()
  }, [searchParams, router])

  const handleLogin = async () => {
    console.log('[Login] Sending magic link to:', email)

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/login`,
      },
    })

    if (error) {
      console.error('[Login] Failed to send magic link:', error.message)
    } else {
      console.log('[Login] Magic link sent!')
      setSent(true)
    }
  }

  return (
    <main className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Log in to Jarvis</h1>
      {sent ? (
        <p className="text-green-600">Check your email for the magic link!</p>
      ) : (
        <>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border px-3 py-2 w-full rounded mb-4"
          />
          <button
            onClick={handleLogin}
            className="bg-blue-600 text-white px-4 py-2 rounded w-full"
          >
            Send Magic Link
          </button>
        </>
      )}
    </main>
  )
}
