/*
  Warnings:

  - Made the column `descripcion` on table `tipos_tramite` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "ModoAsignacion" AS ENUM ('automatico', 'manual');

-- AlterEnum
ALTER TYPE "TipoTramiteStatus" ADD VALUE 'borrador';

-- AlterTable
ALTER TABLE "tipos_tramite" ADD COLUMN     "modo_asignacion" "ModoAsignacion" NOT NULL DEFAULT 'manual',
ADD COLUMN     "oficinas_preseleccionadas" JSONB,
ALTER COLUMN "descripcion" SET NOT NULL,
ALTER COLUMN "estado" SET DEFAULT 'borrador',
ALTER COLUMN "estructura_formulario" SET DEFAULT '[]';
