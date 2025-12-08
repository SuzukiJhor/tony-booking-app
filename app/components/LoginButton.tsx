import { useSession, signIn, signOut } from "next-auth/react"

export default function LoginButton() {
  return (
    <button onClick={() => signIn("google")}>
      Login com Google
    </button>
  );
}