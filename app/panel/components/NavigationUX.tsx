'use client'
import { useEffect, useTransition } from 'react'
import { usePathname, useRouter } from 'next/navigation'

export function NavigationUX({ children }: { children: React.ReactNode }) {
    const [isPending, startTransition] = useTransition()
    const pathname = usePathname()
    const router = useRouter()
    useEffect(() => {
        startTransition(() => router.prefetch(pathname))
    }, [pathname, router])
    return (
        <div className={isPending ? 'blur-sm pointer-events-none' : ''} >{children}</div>
    )
}
