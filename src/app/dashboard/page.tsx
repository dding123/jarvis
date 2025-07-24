import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
    const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name) => cookieStore.get(name)?.value,
        set: (name, value, options) => {
          // Not needed for this case (used mostly for SSR response headers)
        },
        remove: (name, options) => {
          // Not needed for this case
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    console.log('[Dashboard] No user. Redirecting.')
    redirect('/login')
  }

  const { data: habits } = await supabase
    .from('habits')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: true })

  return (
    <main className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Your Habits</h1>
      {habits && habits.length > 0 ? (
        <ul className="space-y-2">
          {habits.map((habit) => (
            <li
              key={habit.id}
              className="bg-white rounded shadow p-3 border border-gray-200"
            >
              {habit.name}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No habits yet. Time to add some!</p>
      )}
    </main>
  )
}
