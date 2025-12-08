-- CreateEnum
CREATE TYPE "StatusAgendamento" AS ENUM ('PENDENTE', 'MENSAGEM_ENVIADA', 'CONFIRMADO', 'NAO_CONFIRMADO', 'CANCELADO');

-- CreateTable
CREATE TABLE "Empresa" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "planoAtivo" TEXT NOT NULL DEFAULT 'FREE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Empresa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Paciente" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "email" TEXT,
    "empresaId" INTEGER NOT NULL,

    CONSTRAINT "Paciente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Agendamento" (
    "id" SERIAL NOT NULL,
    "dataHora" TIMESTAMP(3) NOT NULL,
    "statusConfirmacao" "StatusAgendamento" NOT NULL DEFAULT 'PENDENTE',
    "mensagemEnviadaEm" TIMESTAMP(3),
    "mensagemId" TEXT,
    "pacienteId" INTEGER NOT NULL,
    "empresaId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Agendamento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Configuracao" (
    "id" SERIAL NOT NULL,
    "chave" TEXT NOT NULL,
    "valor" TEXT,
    "empresaId" INTEGER NOT NULL,

    CONSTRAINT "Configuracao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AcessoSistema" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "nomeEmpresa" TEXT DEFAULT 'Tony Agenda',

    CONSTRAINT "AcessoSistema_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Empresa_slug_key" ON "Empresa"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Paciente_telefone_empresaId_key" ON "Paciente"("telefone", "empresaId");

-- CreateIndex
CREATE UNIQUE INDEX "Paciente_email_empresaId_key" ON "Paciente"("email", "empresaId");

-- CreateIndex
CREATE UNIQUE INDEX "Configuracao_chave_empresaId_key" ON "Configuracao"("chave", "empresaId");

-- CreateIndex
CREATE UNIQUE INDEX "AcessoSistema_email_key" ON "AcessoSistema"("email");

-- AddForeignKey
ALTER TABLE "Paciente" ADD CONSTRAINT "Paciente_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agendamento" ADD CONSTRAINT "Agendamento_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "Paciente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agendamento" ADD CONSTRAINT "Agendamento_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Configuracao" ADD CONSTRAINT "Configuracao_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
