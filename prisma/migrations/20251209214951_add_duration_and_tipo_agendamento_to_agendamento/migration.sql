-- CreateEnum
CREATE TYPE "TipoAgendamento" AS ENUM ('CONSULTA', 'RETORNO', 'EXAME');

-- AlterTable
ALTER TABLE "Agendamento" ADD COLUMN     "tempoAtendimento" INTEGER NOT NULL DEFAULT 60,
ADD COLUMN     "tipoAgendamento" "TipoAgendamento" NOT NULL DEFAULT 'CONSULTA';
