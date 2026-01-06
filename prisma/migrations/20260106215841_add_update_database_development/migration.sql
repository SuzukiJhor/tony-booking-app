-- CreateTable
CREATE TABLE "Endereco" (
    "id" SERIAL NOT NULL,
    "logradouro" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "complemento" TEXT,
    "bairro" TEXT,
    "cidade" TEXT NOT NULL,
    "estado" TEXT,
    "cep" TEXT,
    "empresaId" INTEGER NOT NULL,

    CONSTRAINT "Endereco_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Endereco_empresaId_key" ON "Endereco"("empresaId");

-- AddForeignKey
ALTER TABLE "Endereco" ADD CONSTRAINT "Endereco_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE CASCADE ON UPDATE CASCADE;
