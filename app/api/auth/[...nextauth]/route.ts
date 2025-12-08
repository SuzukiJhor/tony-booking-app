import NextAuth, { AuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from '@/lib/prisma'
import { compare } from "bcryptjs";

export const authOptions: AuthOptions = {
    debug: true,
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),

        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Senha", type: "password" },
            },
            async authorize(credentials: any) {
                const user = await prisma.acessoSistema.findUnique({
                    where: { email: credentials.email },
                });

                if (!user) return null;

                const passwordMatch = await compare(credentials.password, user.password);

                if (!passwordMatch) return null;

                return {
                    id: String(user.id),
                    email: user.email,
                    nomeEmpresa: user.nomeEmpresa,
                };
            },
        }),
    ],

    session: {
        strategy: "jwt",
    },

    pages: {
        signIn: "/login",
    },

    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.nomeEmpresa = user.nomeEmpresa;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id;
                session.user.nomeEmpresa = token.nomeEmpresa;
            }
            return session;
        },
    },

    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };