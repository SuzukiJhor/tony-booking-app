import { useSession, signIn, signOut } from "next-auth/react"

export default function LoginBtn() {
    const { data: session } = useSession()
    if (session) {
        return (
            <>
                Entrou com {session.user.email} <br />
                <button onClick={() => signOut()}>Sair</button>
            </>
        )
    }
    return (
        <>
            Não esta conectado <br />
            <button onClick={() => signIn()}>Entrar</button>
        </>
    )
}