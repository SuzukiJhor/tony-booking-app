'use client'
import { useFormStatus } from 'react-dom'
import { Loader2 } from 'lucide-react'

export default function SubmitButton({ children, variant = 'primary' }: { children: React.ReactNode, variant?: 'primary' | 'secondary' }) {
  const { pending } = useFormStatus()

  const styles = {
    primary: "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200",
    secondary: "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 shadow-sm"
  }

  return (
    <button
      type="submit"
      disabled={pending}
      className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-semibold transition-all duration-200 active:scale-[0.97] disabled:opacity-70 disabled:cursor-not-allowed shadow-lg ${styles[variant]}`}
    >
      {pending ? <Loader2 className="w-5 h-5 animate-spin" /> : children}
    </button>
  )
}