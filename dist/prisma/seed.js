"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const pg_1 = require("pg");
const adapter_pg_1 = require("@prisma/adapter-pg");
const bcrypt = __importStar(require("bcrypt"));
const pool = new pg_1.Pool({ connectionString: process.env.DATABASE_URL || 'postgresql://postgres:4dm1nDB@localhost:5433/db?schema=public' });
const adapter = new adapter_pg_1.PrismaPg(pool);
const prisma = new client_1.PrismaClient({ adapter });
async function hash(password) {
    return bcrypt.hash(password, 10);
}
async function main() {
    console.log('🌱 Iniciando seed...');
    await prisma.notificacion.deleteMany();
    await prisma.historialEstado.deleteMany();
    await prisma.decisionFinal.deleteMany();
    await prisma.evaluacionSeccion.deleteMany();
    await prisma.asignacionOficina.deleteMany();
    await prisma.archivo.deleteMany();
    await prisma.tramite.deleteMany();
    await prisma.plantillaMensaje.deleteMany();
    await prisma.tipoTramite.deleteMany();
    await prisma.user.deleteMany();
    await prisma.empresa.deleteMany();
    await prisma.oficina.deleteMany();
    console.log('🗑️  Datos previos eliminados');
    const oficinaTecnica = await prisma.oficina.create({
        data: {
            nombre: 'Oficina Técnica',
            descripcion: 'Evalúa aspectos técnicos y de seguridad estructural',
            codigo: 'TEC',
            email: 'tecnica@municipio.gov.ar',
            permite_decision_final: false,
        },
    });
    const oficinaHabilitaciones = await prisma.oficina.create({
        data: {
            nombre: 'Habilitaciones y Permisos',
            descripcion: 'Oficina decisora — evalúa y decide la habilitación final',
            codigo: 'HAB',
            email: 'habilitaciones@municipio.gov.ar',
            permite_decision_final: true,
        },
    });
    console.log('🏢 Oficinas creadas:', oficinaTecnica.nombre, '|', oficinaHabilitaciones.nombre);
    const admin = await prisma.user.create({
        data: {
            nombre: 'Administrador',
            apellido: 'Sistema',
            email: 'admin@municipio.gov.ar',
            password: await hash('Admin1234!'),
            dni: '00000001',
            telefono: '+54911000001',
            rol: 'admin',
            cargo: 'Administrador del Sistema',
        },
    });
    const director = await prisma.user.create({
        data: {
            nombre: 'Carlos',
            apellido: 'Rodríguez',
            email: 'director@empresa.com',
            password: await hash('Director1234!'),
            dni: '20111222',
            telefono: '+54911000002',
            rol: 'director',
            cargo: 'Director General',
        },
    });
    const solicitante = await prisma.user.create({
        data: {
            nombre: 'María',
            apellido: 'González',
            email: 'solicitante@empresa.com',
            password: await hash('Solicitante1234!'),
            dni: '30222333',
            telefono: '+54911000003',
            rol: 'solicitante',
            cargo: 'Responsable de Trámites',
        },
    });
    const moderador = await prisma.user.create({
        data: {
            nombre: 'Jorge',
            apellido: 'Fernández',
            email: 'moderador@municipio.gov.ar',
            password: await hash('Moderador1234!'),
            dni: '25333444',
            telefono: '+54911000004',
            rol: 'moderador',
            cargo: 'Moderador Municipal',
        },
    });
    const jefeTecnico = await prisma.user.create({
        data: {
            nombre: 'Ana',
            apellido: 'Martínez',
            email: 'jefe.tecnico@municipio.gov.ar',
            password: await hash('JefeTec1234!'),
            dni: '27444555',
            telefono: '+54911000005',
            rol: 'jefe_oficina',
            cargo: 'Jefa Oficina Técnica',
            oficina_id: oficinaTecnica.id,
        },
    });
    const jefeDecisor = await prisma.user.create({
        data: {
            nombre: 'Roberto',
            apellido: 'López',
            email: 'jefe.habilitaciones@municipio.gov.ar',
            password: await hash('JefeHab1234!'),
            dni: '28555666',
            telefono: '+54911000006',
            rol: 'jefe_oficina',
            cargo: 'Jefe de Habilitaciones (Decisor)',
            oficina_id: oficinaHabilitaciones.id,
        },
    });
    const interno = await prisma.user.create({
        data: {
            nombre: 'Lucas',
            apellido: 'Pereyra',
            email: 'interno@municipio.gov.ar',
            password: await hash('Interno1234!'),
            dni: '29666777',
            telefono: '+54911000007',
            rol: 'interno',
            cargo: 'Agente Municipal Interno',
        },
    });
    console.log('👥 Usuarios creados:', [admin, director, solicitante, moderador, jefeTecnico, jefeDecisor, interno].map(u => u.email).join(' | '));
    const empresa = await prisma.empresa.create({
        data: {
            razon_social: 'Comercios del Sur S.A.',
            nombre_fantasia: 'ComSur',
            cuit: '30-71234567-8',
            direccion: 'Av. Siempreviva 742, Córdoba',
            telefono: '+543512345678',
            email: 'info@comsur.com.ar',
            director_id: director.id,
        },
    });
    await prisma.user.update({ where: { id: director.id }, data: { empresa_id: empresa.id } });
    const oficinaCentro = await prisma.oficinaEmpresa.create({
        data: {
            empresa_id: empresa.id,
            nombre: 'Sucursal Centro',
            descripcion: 'Local principal de atención al público',
            direccion: 'Av. Colón 456, Córdoba',
            telefono: '+543515551234',
        },
    });
    await prisma.user.update({
        where: { id: solicitante.id },
        data: { empresa_id: empresa.id, oficina_empresa_id: oficinaCentro.id },
    });
    console.log('🏪 Empresa creada:', empresa.razon_social);
    console.log('🏬 Oficina de empresa creada:', oficinaCentro.nombre);
    const tipoHabilitacion = await prisma.tipoTramite.create({
        data: {
            nombre: 'Habilitación Comercial',
            descripcion: 'Trámite para obtener la habilitación municipal para operar un local comercial. Aplica a todo tipo de actividad comercial dentro del ejido municipal.',
            codigo: 'HAB_COM',
            version: 1,
            estado: 'activo',
            modo_asignacion: 'automatico',
            oficinas_asignacion: {
                create: [{ oficina_id: oficinaHabilitaciones.id }],
            },
        },
    });
    const secHab1 = await prisma.seccionTipoTramite.create({
        data: { tipo_tramite_id: tipoHabilitacion.id, titulo: 'Datos del Local', descripcion: 'Información básica del local comercial', orden: 1 },
    });
    await prisma.campoSeccionTipoTramite.createMany({
        data: [
            { seccion_id: secHab1.id, nombre: 'nombre_comercio', etiqueta: 'Nombre del Comercio', tipo: 'text', obligatorio: true, orden: 1 },
            { seccion_id: secHab1.id, nombre: 'rubro', etiqueta: 'Rubro Comercial', tipo: 'text', obligatorio: true, orden: 2 },
            { seccion_id: secHab1.id, nombre: 'superficie_m2', etiqueta: 'Superficie (m²)', tipo: 'number', obligatorio: true, orden: 3 },
            { seccion_id: secHab1.id, nombre: 'direccion_local', etiqueta: 'Dirección del Local', tipo: 'text', obligatorio: true, orden: 4 },
        ],
    });
    const secHab2 = await prisma.seccionTipoTramite.create({
        data: { tipo_tramite_id: tipoHabilitacion.id, titulo: 'Documentación Legal', descripcion: 'Documentos legales del solicitante y la actividad', orden: 2 },
    });
    await prisma.campoSeccionTipoTramite.createMany({
        data: [
            { seccion_id: secHab2.id, nombre: 'numero_cuit', etiqueta: 'CUIT del Titular', tipo: 'text', obligatorio: true, orden: 1 },
            { seccion_id: secHab2.id, nombre: 'contrato_alquiler', etiqueta: '¿Tiene contrato de alquiler?', tipo: 'checkbox', obligatorio: true, orden: 2 },
            { seccion_id: secHab2.id, nombre: 'habilitacion_previa', etiqueta: 'Número de habilitación previa (si tiene)', tipo: 'text', obligatorio: false, orden: 3 },
        ],
    });
    const secHab3 = await prisma.seccionTipoTramite.create({
        data: { tipo_tramite_id: tipoHabilitacion.id, titulo: 'Condiciones de Seguridad', descripcion: 'Verificación de normas de seguridad e higiene', orden: 3 },
    });
    await prisma.campoSeccionTipoTramite.createMany({
        data: [
            { seccion_id: secHab3.id, nombre: 'tiene_matafuego', etiqueta: '¿Posee matafuego vigente?', tipo: 'checkbox', obligatorio: true, orden: 1 },
            { seccion_id: secHab3.id, nombre: 'tiene_salida_emergencia', etiqueta: '¿Tiene salida de emergencia?', tipo: 'checkbox', obligatorio: true, orden: 2 },
            { seccion_id: secHab3.id, nombre: 'observaciones_seguridad', etiqueta: 'Observaciones de seguridad', tipo: 'textarea', obligatorio: false, orden: 3 },
        ],
    });
    const tipoPermisosObras = await prisma.tipoTramite.create({
        data: {
            nombre: 'Permiso de Obras Menores',
            descripcion: 'Permiso municipal para realizar refacciones, ampliaciones y obras menores en inmuebles ubicados dentro del ejido municipal.',
            codigo: 'OBRA_MEN',
            version: 1,
            estado: 'activo',
            modo_asignacion: 'manual',
        },
    });
    const secObra1 = await prisma.seccionTipoTramite.create({
        data: { tipo_tramite_id: tipoPermisosObras.id, titulo: 'Descripción de la Obra', orden: 1 },
    });
    await prisma.campoSeccionTipoTramite.createMany({
        data: [
            { seccion_id: secObra1.id, nombre: 'tipo_obra', etiqueta: 'Tipo de obra', tipo: 'text', obligatorio: true, orden: 1 },
            { seccion_id: secObra1.id, nombre: 'plazo_ejecucion', etiqueta: 'Plazo de ejecución (días)', tipo: 'number', obligatorio: true, orden: 2 },
            { seccion_id: secObra1.id, nombre: 'presupuesto', etiqueta: 'Presupuesto estimado ($)', tipo: 'number', obligatorio: true, orden: 3 },
        ],
    });
    const secObra2 = await prisma.seccionTipoTramite.create({
        data: { tipo_tramite_id: tipoPermisosObras.id, titulo: 'Ubicación', orden: 2 },
    });
    await prisma.campoSeccionTipoTramite.createMany({
        data: [
            { seccion_id: secObra2.id, nombre: 'direccion_obra', etiqueta: 'Dirección de la obra', tipo: 'text', obligatorio: true, orden: 1 },
            { seccion_id: secObra2.id, nombre: 'parcela', etiqueta: 'Número de parcela catastral', tipo: 'text', obligatorio: false, orden: 2 },
        ],
    });
    console.log('📋 Tipos de trámite creados:', tipoHabilitacion.nombre, '|', tipoPermisosObras.nombre);
    await prisma.plantillaMensaje.createMany({
        data: [
            {
                oficina_id: oficinaHabilitaciones.id,
                nombre: 'Aprobación estándar',
                tipo_decision: 'aprobado',
                creada_por: jefeDecisor.id,
                contenido: 'Estimado/a [NOMBRE_SOLICITANTE],\n\n' +
                    'Nos complace informarle que su trámite N° [NUMERO_TRAMITE] correspondiente a "[TIPO_TRAMITE]" ' +
                    'presentado por la empresa [EMPRESA] ha sido APROBADO.\n\n' +
                    'La resolución fue emitida el día [FECHA] por [NOMBRE_JEFE] de la [NOMBRE_OFICINA].\n\n' +
                    'Puede retirar la documentación en nuestras oficinas. Muchas gracias.',
            },
            {
                oficina_id: oficinaHabilitaciones.id,
                nombre: 'Rechazo por incumplimiento',
                tipo_decision: 'rechazado',
                creada_por: jefeDecisor.id,
                contenido: 'Estimado/a [NOMBRE_SOLICITANTE],\n\n' +
                    'Lamentamos informarle que su trámite N° [NUMERO_TRAMITE] correspondiente a "[TIPO_TRAMITE]" ' +
                    'ha sido RECHAZADO por no cumplir con los requisitos establecidos.\n\n' +
                    'Motivos del rechazo:\n[DETALLE_OBSERVACIONES]\n\n' +
                    'Resolución emitida el [FECHA] por [NOMBRE_JEFE]. Para más información contáctenos.',
            },
            {
                oficina_id: oficinaHabilitaciones.id,
                nombre: 'Observado — requiere correcciones',
                tipo_decision: 'observado',
                creada_por: jefeDecisor.id,
                contenido: 'Estimado/a [NOMBRE_SOLICITANTE],\n\n' +
                    'Su trámite N° [NUMERO_TRAMITE] ha sido OBSERVADO y requiere correcciones en las siguientes secciones:\n\n' +
                    '[DETALLE_OBSERVACIONES]\n\n' +
                    'Por favor, ingrese al sistema, realice las correcciones indicadas y reenvíe el trámite.\n' +
                    'Fecha límite para corrección: 10 días hábiles desde el [FECHA].\n\n' +
                    'Ante dudas comuníquese con [NOMBRE_OFICINA].',
            },
        ],
    });
    console.log('📝 Plantillas de mensaje creadas (3)');
    console.log('\n✅ Seed completado exitosamente!\n');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('  CREDENCIALES DE ACCESO — Swagger: http://localhost:3005/api/docs');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('  ROL            EMAIL                              CONTRASEÑA');
    console.log('───────────────────────────────────────────────────────────');
    console.log('  admin          admin@municipio.gov.ar             Admin1234!');
    console.log('  director       director@empresa.com               Director1234!');
    console.log('  solicitante    solicitante@empresa.com            Solicitante1234!');
    console.log('  moderador      moderador@municipio.gov.ar         Moderador1234!');
    console.log('  jefe_oficina   jefe.tecnico@municipio.gov.ar      JefeTec1234!');
    console.log('  jefe_decisor   jefe.habilitaciones@municipio.gov.ar  JefeHab1234!');
    console.log('  interno        interno@municipio.gov.ar            Interno1234!');
    console.log('═══════════════════════════════════════════════════════════\n');
    console.log('  Empresa:  Comercios del Sur S.A. (CUIT: 30-71234567-8)');
    console.log('  Tipos:    HAB_COM — Habilitación Comercial (3 secciones)');
    console.log('            OBRA_MEN — Permiso de Obras Menores (2 secciones)');
    console.log('═══════════════════════════════════════════════════════════\n');
}
main()
    .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map