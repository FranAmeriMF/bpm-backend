/*
  Warnings:

  - You are about to drop the column `seccion_numero` on the `archivos` table. All the data in the column will be lost.
  - You are about to drop the column `seccion_numero` on the `evaluaciones_secciones` table. All the data in the column will be lost.
  - You are about to drop the column `estructura_formulario` on the `tipos_tramite` table. All the data in the column will be lost.
  - You are about to drop the column `monto_tasa` on the `tipos_tramite` table. All the data in the column will be lost.
  - You are about to drop the column `oficinas_preseleccionadas` on the `tipos_tramite` table. All the data in the column will be lost.
  - You are about to drop the column `plazo_dias` on the `tipos_tramite` table. All the data in the column will be lost.
  - You are about to drop the column `requiere_pago` on the `tipos_tramite` table. All the data in the column will be lost.
  - You are about to drop the column `datos_formulario` on the `tramites` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[asignacion_oficina_id,seccion_id]` on the table `evaluaciones_secciones` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[codigo,version]` on the table `tipos_tramite` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `seccion_id` to the `evaluaciones_secciones` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TipoCampo" AS ENUM ('text', 'textarea', 'number', 'date', 'select', 'checkbox_group', 'radio', 'file', 'checkbox');

-- DropIndex
DROP INDEX "evaluaciones_secciones_asignacion_oficina_id_seccion_numero_key";

-- DropIndex
DROP INDEX "tipos_tramite_codigo_key";

-- AlterTable
ALTER TABLE "archivos" DROP COLUMN "seccion_numero",
ADD COLUMN     "seccion_id" UUID;

-- AlterTable
ALTER TABLE "evaluaciones_secciones" DROP COLUMN "seccion_numero",
ADD COLUMN     "seccion_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "tipos_tramite" DROP COLUMN "estructura_formulario",
DROP COLUMN "monto_tasa",
DROP COLUMN "oficinas_preseleccionadas",
DROP COLUMN "plazo_dias",
DROP COLUMN "requiere_pago",
ADD COLUMN     "version" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "tramites" DROP COLUMN "datos_formulario";

-- CreateTable
CREATE TABLE "tipos_tramite_oficinas" (
    "tipo_tramite_id" UUID NOT NULL,
    "oficina_id" UUID NOT NULL,

    CONSTRAINT "tipos_tramite_oficinas_pkey" PRIMARY KEY ("tipo_tramite_id","oficina_id")
);

-- CreateTable
CREATE TABLE "secciones_tipo_tramite" (
    "id" UUID NOT NULL,
    "tipo_tramite_id" UUID NOT NULL,
    "titulo" VARCHAR(100) NOT NULL,
    "descripcion" TEXT,
    "orden" INTEGER NOT NULL,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "secciones_tipo_tramite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campos_tipo_tramite" (
    "id" UUID NOT NULL,
    "seccion_id" UUID NOT NULL,
    "nombre" VARCHAR(80) NOT NULL,
    "etiqueta" VARCHAR(100) NOT NULL,
    "tipo" "TipoCampo" NOT NULL,
    "obligatorio" BOOLEAN NOT NULL DEFAULT false,
    "placeholder" VARCHAR(200),
    "descripcion" TEXT,
    "valor_defecto" JSONB,
    "opciones" JSONB,
    "validaciones" JSONB,
    "orden" INTEGER NOT NULL,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "campos_tipo_tramite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tramite_secciones" (
    "id" UUID NOT NULL,
    "tramite_id" UUID NOT NULL,
    "seccion_id" UUID NOT NULL,

    CONSTRAINT "tramite_secciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tramite_campos" (
    "id" UUID NOT NULL,
    "tramite_seccion_id" UUID NOT NULL,
    "campo_id" UUID NOT NULL,
    "valor" JSONB,

    CONSTRAINT "tramite_campos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "historial_datos_tramite" (
    "id" UUID NOT NULL,
    "tramite_id" UUID NOT NULL,
    "usuario_id" UUID,
    "accion" VARCHAR(50) NOT NULL,
    "datos" JSONB NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "historial_datos_tramite_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tramite_secciones_tramite_id_seccion_id_key" ON "tramite_secciones"("tramite_id", "seccion_id");

-- CreateIndex
CREATE UNIQUE INDEX "tramite_campos_tramite_seccion_id_campo_id_key" ON "tramite_campos"("tramite_seccion_id", "campo_id");

-- CreateIndex
CREATE UNIQUE INDEX "evaluaciones_secciones_asignacion_oficina_id_seccion_id_key" ON "evaluaciones_secciones"("asignacion_oficina_id", "seccion_id");

-- CreateIndex
CREATE UNIQUE INDEX "tipos_tramite_codigo_version_key" ON "tipos_tramite"("codigo", "version");

-- AddForeignKey
ALTER TABLE "tipos_tramite_oficinas" ADD CONSTRAINT "tipos_tramite_oficinas_tipo_tramite_id_fkey" FOREIGN KEY ("tipo_tramite_id") REFERENCES "tipos_tramite"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tipos_tramite_oficinas" ADD CONSTRAINT "tipos_tramite_oficinas_oficina_id_fkey" FOREIGN KEY ("oficina_id") REFERENCES "oficinas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "secciones_tipo_tramite" ADD CONSTRAINT "secciones_tipo_tramite_tipo_tramite_id_fkey" FOREIGN KEY ("tipo_tramite_id") REFERENCES "tipos_tramite"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campos_tipo_tramite" ADD CONSTRAINT "campos_tipo_tramite_seccion_id_fkey" FOREIGN KEY ("seccion_id") REFERENCES "secciones_tipo_tramite"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tramite_secciones" ADD CONSTRAINT "tramite_secciones_tramite_id_fkey" FOREIGN KEY ("tramite_id") REFERENCES "tramites"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tramite_secciones" ADD CONSTRAINT "tramite_secciones_seccion_id_fkey" FOREIGN KEY ("seccion_id") REFERENCES "secciones_tipo_tramite"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tramite_campos" ADD CONSTRAINT "tramite_campos_tramite_seccion_id_fkey" FOREIGN KEY ("tramite_seccion_id") REFERENCES "tramite_secciones"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tramite_campos" ADD CONSTRAINT "tramite_campos_campo_id_fkey" FOREIGN KEY ("campo_id") REFERENCES "campos_tipo_tramite"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "historial_datos_tramite" ADD CONSTRAINT "historial_datos_tramite_tramite_id_fkey" FOREIGN KEY ("tramite_id") REFERENCES "tramites"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "historial_datos_tramite" ADD CONSTRAINT "historial_datos_tramite_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "archivos" ADD CONSTRAINT "archivos_seccion_id_fkey" FOREIGN KEY ("seccion_id") REFERENCES "secciones_tipo_tramite"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evaluaciones_secciones" ADD CONSTRAINT "evaluaciones_secciones_seccion_id_fkey" FOREIGN KEY ("seccion_id") REFERENCES "secciones_tipo_tramite"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
