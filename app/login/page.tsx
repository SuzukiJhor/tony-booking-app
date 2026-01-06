"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { GoogleSVG } from "@/assets/googleSVG";
import { LogoTonySVG } from "@/assets/logoTonySVG";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { useLoading } from "../components/LoadingProvider";

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.3,
        },
    },
};

const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            type: "spring" as const,
            stiffness: 150,
            damping: 20,
        }
    },
    hover: {
        scale: 1.01,
        transition: {
            duration: 0.2
        }
    }
};

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { setIsLoading } = useLoading();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        const res = await signIn("credentials", {
            email,
            password,
            redirect: true,
            callbackUrl: "/panel",
        });

        setIsLoading(false);
        if (res?.error) {
            setError("Email ou senha inválidos");
            return;
        }
    };

    return (
        <div className="h-screen w-full flex items-center justify-center from-primary/20 via-background to-primary/30 dark:bg-background-secondary">
            <motion.div
                className="backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl p-8 w-90"
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.7 }}
            >

                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    whileHover={{ rotate: 2, scale: 1.05 }}
                    className="w-full px-3 py-2 rounded-lg  text-background focus:ring-2 focus:ring-primary focus:outline-none"

                >
                    <LogoTonySVG className="text-sky-500 dark:text-sky-500 animate-pulse duration-2000" />
                </motion.div>

                <motion.form
                    onSubmit={handleSubmit}
                    className="space-y-4"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <motion.input
                        type="email"
                        placeholder="Seu e-mail"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border text-black dark:text-blue-100 bg-secondary dark:bg-background-tertiary focus:ring-2 focus:ring-primary focus:outline-none placeholder-black/50 dark:placeholder-white/50"
                        required
                        variants={itemVariants}
                        whileHover="hover"
                    />

                    <motion.input
                        type="password"
                        placeholder="Sua senha"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border text-black dark:text-blue-100 bg-secondary dark:bg-background-tertiary focus:ring-2 focus:ring-primary focus:outline-none placeholder-black/50 dark:placeholder-white/50"
                        required
                        variants={itemVariants}
                        whileHover="hover"
                    />

                    {error && <motion.p variants={itemVariants} className="text-red-500 text-center">{error}</motion.p>}

                    <motion.button
                        type="submit"
                        className="w-full dark:bg-primary bg-foreground text-white font-semibold py-2 rounded-lg hover:opacity-90 transition-all cursor-pointer hover:bg-sky-500"
                        variants={itemVariants}
                        whileHover="hover"
                    >
                        Entrar
                    </motion.button>

                    {/* <motion.div variants={itemVariants} className="relative py-2 text-center text-sm text-gray-500">
                        <span className="text-primary px-2">ou</span>
                    </motion.div>

                    <motion.button
                        type="button"
                        className="w-full flex items-center justify-center gap-3 py-2 rounded-lg border transition-all cursor-pointer dark:text-background dark:hover:text-background-secondary"
                        onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                        variants={itemVariants}
                        whileHover="hover"
                    >
                        <GoogleSVG />
                        Entrar com Google
                    </motion.button> */}
                </motion.form>
            </motion.div>
        </div>
    );
}