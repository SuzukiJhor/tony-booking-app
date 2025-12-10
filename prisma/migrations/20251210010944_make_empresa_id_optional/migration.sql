/*
  Warnings:

  - You are about to drop the column `nomeEmpresa` on the `AcessoSistema` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "AcessoSistema" DROP COLUMN "nomeEmpresa",
ADD COLUMN     "empresaId" INTEGER;

-- AddForeignKey
ALTER TABLE "AcessoSistema" ADD CONSTRAINT "AcessoSistema_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE SET NULL ON UPDATE CASCADE;
