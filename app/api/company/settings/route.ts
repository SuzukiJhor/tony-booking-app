import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user)
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const companyId = (session.user as any).empresaID;
        if (!companyId)
            return NextResponse.json({ message: "Company not found in session" }, { status: 400 });

        const settingsData = await prisma.configuracao.findMany({
            where: {
                empresaId: companyId,
            },
        });

        const settings = settingsData.reduce((acc: any, curr) => {
            acc[curr.chave] = curr.valor || curr.telefone;
            return acc;
        }, {});

        const mainConfig = settingsData[0];

        return NextResponse.json({
            ...settings,
            mainPhone: mainConfig?.telefone || null
        }, { status: 200 });

    } catch (error) {
        console.error("Error fetching company settings:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const companyId = (session.user as any).empresaID;
        const { telefone } = await request.json();

        if (!telefone) {
            return NextResponse.json({ message: "Phone number is required" }, { status: 400 });
        }

        const cleanPhone = telefone.replace(/\D/g, "");

        const updatedSetting = await prisma.configuracao.upsert({
            where: {
                chave_empresaId: {
                    chave: "wuzapiInstance",
                    empresaId: companyId,
                },
            },
            update: {
                telefone: cleanPhone,
            },
            create: {
                chave: "wuzapiInstance",
                telefone: cleanPhone,
                empresaId: companyId,
            },
        });

        return NextResponse.json(updatedSetting, { status: 200 });

    } catch (error) {
        console.error("Error updating company settings:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}