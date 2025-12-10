/*
  Warnings:

  - You are about to drop the `AcessoSistema` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AcessoSistema" DROP CONSTRAINT "AcessoSistema_empresaId_fkey";

-- DropTable
DROP TABLE "AcessoSistema";

-- CreateTable
CREATE TABLE "acesso_sistema" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "empresaId" INTEGER,

    CONSTRAINT "acesso_sistema_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "acesso_sistema_email_key" ON "acesso_sistema"("email");

-- AddForeignKey
ALTER TABLE "acesso_sistema" ADD CONSTRAINT "acesso_sistema_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE SET NULL ON UPDATE CASCADE;
