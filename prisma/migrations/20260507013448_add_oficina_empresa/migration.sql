-- CreateEnum
CREATE TYPE "OficinaEmpresaStatus" AS ENUM ('activa', 'inactiva');

-- AlterTable
ALTER TABLE "tramites" ADD COLUMN     "oficina_empresa_id" UUID;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "oficina_empresa_id" UUID;

-- CreateTable
CREATE TABLE "oficinas_empresa" (
    "id" UUID NOT NULL,
    "empresa_id" UUID NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "descripcion" TEXT,
    "direccion" VARCHAR(255),
    "telefono" VARCHAR(50),
    "estado" "OficinaEmpresaStatus" NOT NULL DEFAULT 'activa',
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "oficinas_empresa_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_oficina_empresa_id_fkey" FOREIGN KEY ("oficina_empresa_id") REFERENCES "oficinas_empresa"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "oficinas_empresa" ADD CONSTRAINT "oficinas_empresa_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tramites" ADD CONSTRAINT "tramites_oficina_empresa_id_fkey" FOREIGN KEY ("oficina_empresa_id") REFERENCES "oficinas_empresa"("id") ON DELETE SET NULL ON UPDATE CASCADE;
