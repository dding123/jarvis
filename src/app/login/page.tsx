'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOtp({ email })
    if (!error) setSent(true)
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
