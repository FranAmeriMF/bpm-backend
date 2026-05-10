-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('admin', 'director', 'solicitante', 'moderador', 'jefe_oficina');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('activo', 'inactivo', 'suspendido');

-- CreateEnum
CREATE TYPE "EmpresaStatus" AS ENUM ('activa', 'inactiva', 'suspendida');

-- CreateEnum
CREATE TYPE "OficinaStatus" AS ENUM ('activa', 'inactiva');

-- CreateEnum
CREATE TYPE "TipoTramiteStatus" AS ENUM ('activo', 'inactivo');

-- CreateEnum
CREATE TYPE "TramiteEstado" AS ENUM ('borrador', 'en_revision_interna', 'pendiente_asignacion', 'asignado', 'en_revision', 'en_revision_final', 'aprobado', 'rechazado', 'observado', 'corrigiendo');

-- CreateEnum
CREATE TYPE "AsignacionEstado" AS ENUM ('pendiente', 'en_revision', 'completada');

-- CreateEnum
CREATE TYPE "DecisionTipo" AS ENUM ('aprobado', 'rechazado', 'observado');

-- CreateEnum
CREATE TYPE "PlantillaEstado" AS ENUM ('activa', 'inactiva');

-- CreateEnum
CREATE TYPE "NotificacionTipo" AS ENUM ('info', 'warning', 'success', 'error');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "apellido" VARCHAR(100) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "dni" VARCHAR(20) NOT NULL,
    "telefono" VARCHAR(50),
    "rol" "UserRole" NOT NULL DEFAULT 'solicitante',
    "estado" "UserStatus" NOT NULL DEFAULT 'activo',
    "empresa_id" UUID,
    "oficina_id" UUID,
    "cargo" VARCHAR(100),
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMP(3) NOT NULL,
    "ultimo_acceso" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "empresas" (
    "id" UUID NOT NULL,
    "razon_social" VARCHAR(255) NOT NULL,
    "nombre_fantasia" VARCHAR(255),
    "cuit" VARCHAR(20) NOT NULL,
    "direccion" VARCHAR(255) NOT NULL,
    "telefono" VARCHAR(50),
    "email" VARCHAR(255) NOT NULL,
    "estado" "EmpresaStatus" NOT NULL DEFAULT 'activa',
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMP(3) NOT NULL,
    "director_id" UUID,

    CONSTRAINT "empresas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "oficinas" (
    "id" UUID NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "descripcion" TEXT,
    "codigo" VARCHAR(20) NOT NULL,
    "estado" "OficinaStatus" NOT NULL DEFAULT 'activa',
    "email" VARCHAR(255),
    "permite_decision_final" BOOLEAN NOT NULL DEFAULT false,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "oficinas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tipos_tramite" (
    "id" UUID NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "descripcion" TEXT,
    "codigo" VARCHAR(20) NOT NULL,
    "estado" "TipoTramiteStatus" NOT NULL DEFAULT 'activo',
    "estructura_formulario" JSONB NOT NULL,
    "plazo_dias" INTEGER,
    "requiere_pago" BOOLEAN NOT NULL DEFAULT false,
    "monto_tasa" DECIMAL(10,2),
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tipos_tramite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tramites" (
    "id" UUID NOT NULL,
    "numero" VARCHAR(20) NOT NULL,
    "estado" "TramiteEstado" NOT NULL DEFAULT 'borrador',
    "datos_formulario" JSONB NOT NULL,
    "tipo_tramite_id" UUID NOT NULL,
    "empresa_id" UUID NOT NULL,
    "solicitante_id" UUID NOT NULL,
    "jefe_decisor_id" UUID,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_envio_director" TIMESTAMP(3),
    "fecha_aprobacion_director" TIMESTAMP(3),
    "fecha_asignacion" TIMESTAMP(3),
    "fecha_revision_final" TIMESTAMP(3),
    "fecha_decision_final" TIMESTAMP(3),
    "fecha_finalizacion" TIMESTAMP(3),
    "observaciones_director" TEXT,
    "aprobado_por_director" BOOLEAN,

    CONSTRAINT "tramites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "archivos" (
    "id" UUID NOT NULL,
    "tramite_id" UUID NOT NULL,
    "seccion_numero" INTEGER NOT NULL,
    "nombre_original" VARCHAR(255) NOT NULL,
    "nombre_archivo" VARCHAR(255) NOT NULL,
    "ruta" VARCHAR(500) NOT NULL,
    "tipo_mime" VARCHAR(100),
    "tamano_bytes" BIGINT,
    "fecha_subida" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "subido_por" UUID,

    CONSTRAINT "archivos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "asignaciones_oficinas" (
    "id" UUID NOT NULL,
    "tramite_id" UUID NOT NULL,
    "oficina_id" UUID NOT NULL,
    "jefe_asignado_id" UUID NOT NULL,
    "es_decisor" BOOLEAN NOT NULL DEFAULT false,
    "estado" "AsignacionEstado" NOT NULL DEFAULT 'pendiente',
    "fecha_asignacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_inicio_revision" TIMESTAMP(3),
    "fecha_finalizacion" TIMESTAMP(3),

    CONSTRAINT "asignaciones_oficinas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "evaluaciones_secciones" (
    "id" UUID NOT NULL,
    "asignacion_oficina_id" UUID NOT NULL,
    "seccion_numero" INTEGER NOT NULL,
    "aprobada" BOOLEAN NOT NULL,
    "motivo_rechazo" TEXT,
    "fecha_evaluacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "evaluado_por" UUID NOT NULL,

    CONSTRAINT "evaluaciones_secciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "decisiones_finales" (
    "id" UUID NOT NULL,
    "tramite_id" UUID NOT NULL,
    "jefe_decisor_id" UUID NOT NULL,
    "decision" "DecisionTipo" NOT NULL,
    "secciones_a_corregir" JSONB,
    "mensaje_al_solicitante" TEXT NOT NULL,
    "plantilla_usada_id" UUID,
    "fecha_decision" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ip_decisor" VARCHAR(50),

    CONSTRAINT "decisiones_finales_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "plantillas_mensaje" (
    "id" UUID NOT NULL,
    "oficina_id" UUID NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "tipo_decision" "DecisionTipo" NOT NULL,
    "contenido" TEXT NOT NULL,
    "estado" "PlantillaEstado" NOT NULL DEFAULT 'activa',
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "creada_por" UUID,

    CONSTRAINT "plantillas_mensaje_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "historial_estados" (
    "id" UUID NOT NULL,
    "tramite_id" UUID NOT NULL,
    "estado_anterior" VARCHAR(50),
    "estado_nuevo" VARCHAR(50) NOT NULL,
    "usuario_id" UUID,
    "comentario" TEXT,
    "fecha_cambio" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" JSONB,

    CONSTRAINT "historial_estados_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notificaciones" (
    "id" UUID NOT NULL,
    "usuario_id" UUID NOT NULL,
    "tramite_id" UUID,
    "tipo" "NotificacionTipo" NOT NULL DEFAULT 'info',
    "titulo" VARCHAR(255) NOT NULL,
    "mensaje" TEXT NOT NULL,
    "leida" BOOLEAN NOT NULL DEFAULT false,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_lectura" TIMESTAMP(3),
    "accion_url" VARCHAR(500),

    CONSTRAINT "notificaciones_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_dni_key" ON "users"("dni");

-- CreateIndex
CREATE UNIQUE INDEX "empresas_cuit_key" ON "empresas"("cuit");

-- CreateIndex
CREATE UNIQUE INDEX "oficinas_codigo_key" ON "oficinas"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "tipos_tramite_codigo_key" ON "tipos_tramite"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "tramites_numero_key" ON "tramites"("numero");

-- CreateIndex
CREATE UNIQUE INDEX "evaluaciones_secciones_asignacion_oficina_id_seccion_numero_key" ON "evaluaciones_secciones"("asignacion_oficina_id", "seccion_numero");

-- CreateIndex
CREATE UNIQUE INDEX "decisiones_finales_tramite_id_key" ON "decisiones_finales"("tramite_id");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_oficina_id_fkey" FOREIGN KEY ("oficina_id") REFERENCES "oficinas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "empresas" ADD CONSTRAINT "empresas_director_id_fkey" FOREIGN KEY ("director_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tramites" ADD CONSTRAINT "tramites_tipo_tramite_id_fkey" FOREIGN KEY ("tipo_tramite_id") REFERENCES "tipos_tramite"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tramites" ADD CONSTRAINT "tramites_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tramites" ADD CONSTRAINT "tramites_solicitante_id_fkey" FOREIGN KEY ("solicitante_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tramites" ADD CONSTRAINT "tramites_jefe_decisor_id_fkey" FOREIGN KEY ("jefe_decisor_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "archivos" ADD CONSTRAINT "archivos_tramite_id_fkey" FOREIGN KEY ("tramite_id") REFERENCES "tramites"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "archivos" ADD CONSTRAINT "archivos_subido_por_fkey" FOREIGN KEY ("subido_por") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asignaciones_oficinas" ADD CONSTRAINT "asignaciones_oficinas_tramite_id_fkey" FOREIGN KEY ("tramite_id") REFERENCES "tramites"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asignaciones_oficinas" ADD CONSTRAINT "asignaciones_oficinas_oficina_id_fkey" FOREIGN KEY ("oficina_id") REFERENCES "oficinas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asignaciones_oficinas" ADD CONSTRAINT "asignaciones_oficinas_jefe_asignado_id_fkey" FOREIGN KEY ("jefe_asignado_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evaluaciones_secciones" ADD CONSTRAINT "evaluaciones_secciones_asignacion_oficina_id_fkey" FOREIGN KEY ("asignacion_oficina_id") REFERENCES "asignaciones_oficinas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evaluaciones_secciones" ADD CONSTRAINT "evaluaciones_secciones_evaluado_por_fkey" FOREIGN KEY ("evaluado_por") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "decisiones_finales" ADD CONSTRAINT "decisiones_finales_tramite_id_fkey" FOREIGN KEY ("tramite_id") REFERENCES "tramites"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "decisiones_finales" ADD CONSTRAINT "decisiones_finales_jefe_decisor_id_fkey" FOREIGN KEY ("jefe_decisor_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "decisiones_finales" ADD CONSTRAINT "decisiones_finales_plantilla_usada_id_fkey" FOREIGN KEY ("plantilla_usada_id") REFERENCES "plantillas_mensaje"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "plantillas_mensaje" ADD CONSTRAINT "plantillas_mensaje_oficina_id_fkey" FOREIGN KEY ("oficina_id") REFERENCES "oficinas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "plantillas_mensaje" ADD CONSTRAINT "plantillas_mensaje_creada_por_fkey" FOREIGN KEY ("creada_por") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "historial_estados" ADD CONSTRAINT "historial_estados_tramite_id_fkey" FOREIGN KEY ("tramite_id") REFERENCES "tramites"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "historial_estados" ADD CONSTRAINT "historial_estados_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notificaciones" ADD CONSTRAINT "notificaciones_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notificaciones" ADD CONSTRAINT "notificaciones_tramite_id_fkey" FOREIGN KEY ("tramite_id") REFERENCES "tramites"("id") ON DELETE CASCADE ON UPDATE CASCADE;
