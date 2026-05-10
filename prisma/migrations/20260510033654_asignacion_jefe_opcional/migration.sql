-- DropForeignKey
ALTER TABLE "asignaciones_oficinas" DROP CONSTRAINT "asignaciones_oficinas_jefe_asignado_id_fkey";

-- AlterTable
ALTER TABLE "asignaciones_oficinas" ALTER COLUMN "jefe_asignado_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "asignaciones_oficinas" ADD CONSTRAINT "asignaciones_oficinas_jefe_asignado_id_fkey" FOREIGN KEY ("jefe_asignado_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
