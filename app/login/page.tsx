"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { GoogleSVG } from "@/assets/googleSVG";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const res = await signIn("credentials", {
            email,
            password,
            redirect: true,
            callbackUrl: "/dashboard",
        });

        if (res?.error) {
            setError("Email ou senha inválidos");
            return;
        }
    };

    return (
        <div className="h-screen w-full flex items-center justify-center from-primary/20 via-background to-primary/30">
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl rounded-2xl p-8 w-[360px]">

                <h2 className="text-2xl font-extrabold text-center text-primary mb-6">
                    Tony
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">

                    <input
                        type="email"
                        placeholder="Seu e-mail"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border text-background bg-secondary focus:ring-2 focus:ring-primary focus:outline-none"
                        required
                    />

                    <input
                        type="password"
                        placeholder="Sua senha"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border bg-secondary text-background focus:ring-2 focus:ring-primary focus:outline-none"
                        required
                    />

                    {error && <p className="text-red-500 text-center">{error}</p>}

                    <button
                        type="submit"
                        className="w-full bg-primary text-white font-semibold py-2 rounded-lg hover:opacity-90 transition-all"
                    >
                        Entrar
                    </button>

                    <div className="relative py-2 text-center text-sm text-gray-500">
                        <span className="text-primary px-2">ou</span>
                    </div>

                    <button
                        type="button"
                        className="w-full flex items-center justify-center gap-3 py-2 rounded-lg border hover:bg-gray-100 transition-all"
                        onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                    >
                        <GoogleSVG />
                        Entrar com Google
                    </button>
                </form>
            </div>
        </div>
    );
}
