import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient, StatusAgendamento } from '@prisma/client';
import 'dotenv/config'
import bcrypt from 'bcryptjs';
import { faker } from '@faker-js/faker';

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
})

const prisma = new PrismaClient({
    adapter,
});

const NUM_PACIENTES = 5;
const NUM_AGENDAMENTOS_TOTAIS = 10;

// --- 1. CONFIGURAÇÕES FIXAS ---
const EMPRESA_SLUG = 'clinica-demo';
const ADMIN_EMAIL = 'admin@tony.com';
const ADMIN_PASSWORD = 'password123';


async function main() {
    console.log('--- Iniciando o Seeding de Dados (Tony App) ---');

    // --- 2. HASH DA SENHA ---
    const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);

    // --- 3. CRIAR/ATUALIZAR EMPRESA (Tenant) ---
    const empresa = await prisma.empresa.upsert({
        where: { slug: EMPRESA_SLUG },
        update: {},
        create: {
            nome: 'Clínica de Testes Tony',
            slug: EMPRESA_SLUG,
        },
    });
    console.log(`✅ Empresa criada/atualizada: ${empresa.nome}`);

    // --- 4. CRIAR/ATUALIZAR USUÁRIO ADMIN ---
    await prisma.acessoSistema.upsert({
        where: { email: ADMIN_EMAIL },
        update: { password: passwordHash, nomeEmpresa: empresa.nome },
        create: {
            email: ADMIN_EMAIL,
            password: passwordHash,
            nomeEmpresa: empresa.nome,
        },
    });
    console.log(`✅ Usuário Admin criado/atualizado: ${ADMIN_EMAIL}`);

    // --- 5. CRIAR PACIENTES FAKES ---
    const pacientesCriados = [];
    for (let i = 0; i < NUM_PACIENTES; i++) {
        const paciente = await prisma.paciente.create({
            data: {
                nome: faker.person.fullName(),
                telefone: faker.phone.number(),
                email: faker.internet.email(),
                empresaId: empresa.id,
            },
        });
        pacientesCriados.push(paciente);
    }
    console.log(`✅ ${pacientesCriados.length} Pacientes fakes criados.`);

    // --- 6. CRIAR AGENDAMENTOS FAKES ---
    const statuses = Object.values(StatusAgendamento);

    for (let i = 0; i < NUM_AGENDAMENTOS_TOTAIS; i++) {
        const pacienteAleatorio = pacientesCriados[Math.floor(Math.random() * pacientesCriados.length)];
        const futureDate = faker.date.soon({ days: 10 });
        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

        await prisma.agendamento.create({
            data: {
                dataHora: futureDate,
                statusConfirmacao: randomStatus,
                pacienteId: pacienteAleatorio.id,
                empresaId: empresa.id,
            },
        });
    }
    console.log(`✅ ${NUM_AGENDAMENTOS_TOTAIS} Agendamentos fakes criados.`);

    console.log('\n--- Seeding concluído com sucesso! 🎉 ---');
}

main()
    .catch((e) => {
        console.error('Erro durante o seeding:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });