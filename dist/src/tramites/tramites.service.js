"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TramitesService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
const mail_service_1 = require("../mail/mail.service");
const paginate_helper_1 = require("../common/helpers/paginate.helper");
let TramitesService = class TramitesService {
    prisma;
    mail;
    constructor(prisma, mail) {
        this.prisma = prisma;
        this.mail = mail;
    }
    async generarNumero() {
        const year = new Date().getFullYear();
        const ultimo = await this.prisma.tramite.findFirst({
            where: { numero: { startsWith: `${year}-` } },
            orderBy: { numero: 'desc' },
        });
        let seq = 1;
        if (ultimo) {
            const partes = ultimo.numero.split('-');
            seq = parseInt(partes[1], 10) + 1;
        }
        return `${year}-${seq.toString().padStart(5, '0')}`;
    }
    async registrarHistorial(tramite_id, estado_anterior, estado_nuevo, usuario_id, comentario, metadata) {
        await this.prisma.historialEstado.create({
            data: {
                tramite_id,
                estado_anterior,
                estado_nuevo,
                usuario_id,
                comentario,
                metadata: metadata,
            },
        });
    }
    async crearNotificacion(data) {
        await this.prisma.notificacion.create({ data: data });
    }
    async guardarSecciones(tramite_id, secciones, usuario_id, accion) {
        for (const sec of secciones) {
            const tramiteSeccion = await this.prisma.tramiteSeccion.upsert({
                where: { tramite_id_seccion_id: { tramite_id, seccion_id: sec.seccion_id } },
                create: { tramite_id, seccion_id: sec.seccion_id },
                update: {},
            });
            for (const campo of sec.campos) {
                await this.prisma.tramiteCampo.upsert({
                    where: { tramite_seccion_id_campo_id: { tramite_seccion_id: tramiteSeccion.id, campo_id: campo.campo_id } },
                    create: { tramite_seccion_id: tramiteSeccion.id, campo_id: campo.campo_id, valor: campo.valor },
                    update: { valor: campo.valor },
                });
            }
        }
        await this.crearSnapshotDatos(tramite_id, usuario_id, accion);
    }
    async crearSnapshotDatos(tramite_id, usuario_id, accion) {
        const secciones = await this.prisma.tramiteSeccion.findMany({
            where: { tramite_id },
            include: {
                seccion: { select: { id: true, titulo: true, orden: true } },
                campos: {
                    include: {
                        campo: { select: { id: true, etiqueta: true, tipo: true } },
                    },
                },
            },
        });
        await this.prisma.historialDatosTramite.create({
            data: {
                tramite_id,
                usuario_id,
                accion,
                datos: secciones,
            },
        });
    }
    async validarCamposObligatorios(tramite_id, tipo_tramite_id) {
        const campos_obligatorios = await this.prisma.campoSeccionTipoTramite.findMany({
            where: { seccion: { tipo_tramite_id }, obligatorio: true },
            include: { seccion: { select: { titulo: true } } },
        });
        if (campos_obligatorios.length === 0)
            return;
        const campos_guardados = await this.prisma.tramiteCampo.findMany({
            where: { tramite_seccion: { tramite_id } },
            select: { campo_id: true, valor: true },
        });
        const ids_con_valor = new Set(campos_guardados.filter((c) => c.valor !== null).map((c) => c.campo_id));
        const faltantes = campos_obligatorios.filter((c) => !ids_con_valor.has(c.id));
        if (faltantes.length > 0) {
            const nombres = faltantes.map((c) => `"${c.etiqueta}" (${c.seccion.titulo})`).join(', ');
            throw new common_1.BadRequestException(`Campos obligatorios sin completar: ${nombres}`);
        }
    }
    async getEstadisticas() {
        const grupos = await this.prisma.tramite.groupBy({
            by: ['estado'],
            _count: { _all: true },
        });
        const por_estado = {};
        let total = 0;
        for (const g of grupos) {
            por_estado[g.estado] = g._count._all;
            total += g._count._all;
        }
        return { por_estado, total };
    }
    async create(dto) {
        const numero = await this.generarNumero();
        const tramite = await this.prisma.tramite.create({
            data: {
                numero,
                empresa_id: dto.empresa_id,
                tipo_tramite_id: dto.tipo_tramite_id,
                solicitante_id: dto.solicitante_id,
                oficina_empresa_id: dto.oficina_empresa_id,
                estado: client_1.TramiteEstado.borrador,
            },
        });
        await this.registrarHistorial(tramite.id, null, client_1.TramiteEstado.borrador, dto.solicitante_id, 'Trámite creado');
        if (dto.secciones?.length) {
            await this.guardarSecciones(tramite.id, dto.secciones, dto.solicitante_id, 'creacion');
        }
        return tramite;
    }
    async findAll(query, currentUser) {
        const { page = 1, limit = 20, empresa_id, estado, tipo_tramite_id, solicitante_id, oficina_empresa_id, numero, fecha_desde, fecha_hasta, } = query;
        const { skip, take } = (0, paginate_helper_1.paginationParams)(page, limit);
        const where = {};
        if (empresa_id)
            where.empresa_id = empresa_id;
        if (estado)
            where.estado = estado;
        if (tipo_tramite_id)
            where.tipo_tramite_id = tipo_tramite_id;
        if (solicitante_id)
            where.solicitante_id = solicitante_id;
        if (oficina_empresa_id)
            where.oficina_empresa_id = oficina_empresa_id;
        if (numero)
            where.numero = { contains: numero };
        if (fecha_desde ?? fecha_hasta) {
            where.fecha_creacion = {};
            if (fecha_desde)
                where.fecha_creacion.gte = new Date(fecha_desde);
            if (fecha_hasta)
                where.fecha_creacion.lte = new Date(fecha_hasta);
        }
        if (currentUser?.rol === 'jefe_oficina' || currentUser?.rol === 'interno') {
            const oficina_id = currentUser.oficina_id ?? (await this.prisma.user.findUnique({ where: { id: currentUser.id }, select: { oficina_id: true } }))?.oficina_id;
            if (oficina_id) {
                if (currentUser.rol === 'jefe_oficina') {
                    where.OR = [
                        { asignaciones_oficinas: { some: { oficina_id } } },
                        { jefe_decisor_id: currentUser.id },
                    ];
                }
                else {
                    where.asignaciones_oficinas = { some: { oficina_id } };
                }
            }
        }
        const [data, total] = await Promise.all([
            this.prisma.tramite.findMany({
                where, skip, take,
                include: {
                    empresa: { select: { id: true, razon_social: true } },
                    tipo_tramite: { select: { id: true, nombre: true, codigo: true } },
                    solicitante: { select: { id: true, nombre: true, apellido: true } },
                },
                orderBy: { fecha_creacion: 'desc' },
            }),
            this.prisma.tramite.count({ where }),
        ]);
        return (0, paginate_helper_1.paginar)(data, total, page, limit);
    }
    async findOne(id) {
        const tramite = await this.prisma.tramite.findUnique({
            where: { id },
            include: {
                empresa: true,
                tipo_tramite: {
                    include: {
                        secciones: {
                            include: { campos: { orderBy: { orden: 'asc' } } },
                            orderBy: { orden: 'asc' },
                        },
                    },
                },
                solicitante: true,
                jefe_decisor: true,
                archivos: true,
                asignaciones_oficinas: {
                    include: {
                        oficina: { select: { id: true, nombre: true } },
                        jefe_asignado: { select: { id: true, nombre: true, apellido: true } },
                        evaluaciones_secciones: {
                            include: {
                                seccion: { select: { id: true, titulo: true, orden: true } },
                                evaluador: { select: { id: true, nombre: true, apellido: true } },
                            },
                            orderBy: { seccion: { orden: 'asc' } },
                        },
                    },
                },
                secciones_datos: {
                    include: {
                        seccion: true,
                        campos: { include: { campo: true } },
                    },
                    orderBy: { seccion: { orden: 'asc' } },
                },
                historial_datos: { orderBy: { fecha: 'desc' } },
                historial: {
                    include: {
                        usuario: { select: { id: true, nombre: true, apellido: true, rol: true, email: true } },
                    },
                    orderBy: { fecha_cambio: 'asc' },
                },
                decision_final: true,
            },
        });
        if (!tramite)
            throw new common_1.NotFoundException('Trámite no encontrado');
        return tramite;
    }
    async update(id, dto) {
        const tramite = await this.prisma.tramite.findUnique({ where: { id } });
        if (!tramite)
            throw new common_1.NotFoundException('Trámite no encontrado');
        if (tramite.estado !== client_1.TramiteEstado.borrador && tramite.estado !== client_1.TramiteEstado.corrigiendo) {
            throw new common_1.BadRequestException('Solo se puede editar un trámite en estado borrador o corrigiendo');
        }
        const data = {};
        if (dto.oficina_empresa_id !== undefined)
            data.oficina_empresa_id = dto.oficina_empresa_id;
        const updated = await this.prisma.tramite.update({ where: { id }, data });
        if (dto.secciones?.length) {
            await this.guardarSecciones(id, dto.secciones, undefined, 'actualizacion');
        }
        return updated;
    }
    async remove(id) {
        const tramite = await this.prisma.tramite.findUnique({ where: { id } });
        if (!tramite)
            throw new common_1.NotFoundException('Trámite no encontrado');
        if (tramite.estado !== client_1.TramiteEstado.borrador) {
            throw new common_1.BadRequestException('Solo se puede eliminar un trámite en estado borrador');
        }
        return this.prisma.tramite.delete({ where: { id } });
    }
    async enviarDirector(id, solicitante_id) {
        const tramite = await this.prisma.tramite.findUnique({
            where: { id },
            include: { empresa: { include: { director: true } }, tipo_tramite: true, solicitante: true },
        });
        if (!tramite)
            throw new common_1.NotFoundException('Trámite no encontrado');
        if (tramite.estado !== client_1.TramiteEstado.borrador) {
            throw new common_1.BadRequestException('El trámite debe estar en borrador para enviarlo al director');
        }
        await this.validarCamposObligatorios(id, tramite.tipo_tramite_id);
        const updated = await this.prisma.tramite.update({
            where: { id },
            data: { estado: client_1.TramiteEstado.en_revision_interna, fecha_envio_director: new Date() },
        });
        await this.registrarHistorial(id, client_1.TramiteEstado.borrador, client_1.TramiteEstado.en_revision_interna, solicitante_id, 'Trámite enviado a revisión del director');
        const director = tramite.empresa?.director;
        if (director) {
            await this.crearNotificacion({
                usuario_id: director.id,
                tramite_id: id,
                tipo: 'info',
                titulo: `Trámite ${tramite.numero} requiere tu revisión`,
                mensaje: `El solicitante envió el trámite ${tramite.numero} para tu aprobación interna.`,
                accion_url: `/tramites/${id}`,
            });
            void this.mail.enviarAlDirector(director.email, {
                nombre_solicitante: `${tramite.solicitante.nombre} ${tramite.solicitante.apellido}`,
                numero_tramite: tramite.numero,
                tipo_tramite: tramite.tipo_tramite.nombre,
                empresa: tramite.empresa.razon_social,
                url_tramite: `/tramites/${id}`,
            });
        }
        return updated;
    }
    async aprobarDirector(id, director_id) {
        const tramite = await this.prisma.tramite.findUnique({ where: { id } });
        if (!tramite)
            throw new common_1.NotFoundException('Trámite no encontrado');
        if (tramite.estado !== client_1.TramiteEstado.en_revision_interna) {
            throw new common_1.BadRequestException('El trámite debe estar en revisión interna para aprobarlo');
        }
        const updated = await this.prisma.tramite.update({
            where: { id },
            data: {
                estado: client_1.TramiteEstado.pendiente_asignacion,
                fecha_aprobacion_director: new Date(),
                aprobado_por_director: true,
            },
        });
        await this.registrarHistorial(id, client_1.TramiteEstado.en_revision_interna, client_1.TramiteEstado.pendiente_asignacion, director_id, 'Director aprobó el trámite internamente');
        await this.crearNotificacion({
            usuario_id: tramite.solicitante_id,
            tramite_id: id,
            tipo: 'success',
            titulo: `Trámite ${tramite.numero} aprobado internamente`,
            mensaje: `El director aprobó tu trámite. Ahora espera la asignación a las oficinas evaluadoras.`,
            accion_url: `/tramites/${id}`,
        });
        return updated;
    }
    async rechazarDirector(id, director_id, observaciones) {
        const tramite = await this.prisma.tramite.findUnique({
            where: { id },
            include: { solicitante: true, empresa: true, tipo_tramite: true },
        });
        if (!tramite)
            throw new common_1.NotFoundException('Trámite no encontrado');
        if (tramite.estado !== client_1.TramiteEstado.en_revision_interna) {
            throw new common_1.BadRequestException('El trámite debe estar en revisión interna para rechazarlo');
        }
        const updated = await this.prisma.tramite.update({
            where: { id },
            data: {
                estado: client_1.TramiteEstado.borrador,
                aprobado_por_director: false,
                observaciones_director: observaciones,
            },
        });
        await this.registrarHistorial(id, client_1.TramiteEstado.en_revision_interna, client_1.TramiteEstado.borrador, director_id, `Director rechazó: ${observaciones}`);
        await this.crearNotificacion({
            usuario_id: tramite.solicitante_id,
            tramite_id: id,
            tipo: 'warning',
            titulo: `Trámite ${tramite.numero} devuelto por el director`,
            mensaje: `El director devolvió tu trámite con observaciones: ${observaciones}`,
            accion_url: `/tramites/${id}`,
        });
        void this.mail.enviarRechazoDirector(tramite.solicitante.email, {
            nombre_solicitante: `${tramite.solicitante.nombre} ${tramite.solicitante.apellido}`,
            numero_tramite: tramite.numero,
            tipo_tramite: tramite.tipo_tramite.nombre,
            empresa: tramite.empresa.razon_social,
            observaciones,
            url_tramite: `/tramites/${id}`,
        });
        return updated;
    }
    async asignar(id, dto, moderador_id) {
        const tramite = await this.prisma.tramite.findUnique({
            where: { id },
            include: { empresa: true, tipo_tramite: true },
        });
        if (!tramite)
            throw new common_1.NotFoundException('Trámite no encontrado');
        if (tramite.estado !== client_1.TramiteEstado.pendiente_asignacion) {
            throw new common_1.BadRequestException('El trámite debe estar pendiente de asignación');
        }
        await this.prisma.$transaction(dto.oficinas.map((o) => this.prisma.asignacionOficina.create({
            data: {
                tramite_id: id,
                oficina_id: o.oficina_id,
            },
        })));
        const updated = await this.prisma.tramite.update({
            where: { id },
            data: {
                estado: client_1.TramiteEstado.asignado,
                fecha_asignacion: new Date(),
                jefe_decisor_id: dto.jefe_decisor_id,
            },
        });
        await this.registrarHistorial(id, client_1.TramiteEstado.pendiente_asignacion, client_1.TramiteEstado.asignado, moderador_id, 'Moderador asignó el trámite a oficinas');
        const oficina_ids = dto.oficinas.map((o) => o.oficina_id);
        const jefes = await this.prisma.user.findMany({
            where: { oficina_id: { in: oficina_ids }, rol: 'jefe_oficina' },
        });
        for (const jefe of jefes) {
            await this.crearNotificacion({
                usuario_id: jefe.id,
                tramite_id: id,
                tipo: 'info',
                titulo: `Nuevo trámite asignado: ${tramite.numero}`,
                mensaje: `Tu oficina tiene asignado el trámite ${tramite.numero} para revisión técnica.`,
                accion_url: `/tramites/${id}`,
            });
            void this.mail.enviarAsignacionJefe(jefe.email, {
                nombre_solicitante: '',
                numero_tramite: tramite.numero,
                tipo_tramite: tramite.tipo_tramite.nombre,
                empresa: tramite.empresa.razon_social,
                url_tramite: `/tramites/${id}`,
            });
        }
        return { tramite: updated };
    }
    async resolveOficinaId(user) {
        if (user.oficina_id)
            return user.oficina_id;
        const dbUser = await this.prisma.user.findUnique({ where: { id: user.id }, select: { oficina_id: true } });
        if (!dbUser?.oficina_id)
            throw new common_1.BadRequestException('No tenés una oficina asignada a tu cuenta');
        return dbUser.oficina_id;
    }
    async iniciarRevision(id, user) {
        const oficina_id = await this.resolveOficinaId(user);
        const asignacion = await this.prisma.asignacionOficina.findFirst({
            where: { tramite_id: id, oficina_id },
        });
        if (!asignacion)
            throw new common_1.NotFoundException('Tu oficina no tiene una asignación para este trámite');
        if (asignacion.estado !== client_1.AsignacionEstado.pendiente) {
            throw new common_1.BadRequestException('La asignación ya fue iniciada o completada');
        }
        const updatedAsignacion = await this.prisma.asignacionOficina.update({
            where: { id: asignacion.id },
            data: { estado: client_1.AsignacionEstado.en_revision, fecha_inicio_revision: new Date() },
        });
        const tramite = await this.prisma.tramite.findUnique({ where: { id } });
        if (tramite?.estado === client_1.TramiteEstado.asignado) {
            await this.prisma.tramite.update({ where: { id }, data: { estado: client_1.TramiteEstado.en_revision } });
            await this.registrarHistorial(id, client_1.TramiteEstado.asignado, client_1.TramiteEstado.en_revision, user.id, `Oficina ${oficina_id} inició la revisión`);
        }
        return updatedAsignacion;
    }
    async finalizarRevision(id, user) {
        const oficina_id = await this.resolveOficinaId(user);
        const asignacion = await this.prisma.asignacionOficina.findFirst({
            where: { tramite_id: id, oficina_id },
            include: {
                evaluaciones_secciones: true,
                tramite: {
                    include: {
                        tipo_tramite: { include: { _count: { select: { secciones: true } } } },
                    },
                },
            },
        });
        if (!asignacion)
            throw new common_1.NotFoundException('Tu oficina no tiene una asignación para este trámite');
        if (asignacion.estado !== client_1.AsignacionEstado.en_revision) {
            throw new common_1.BadRequestException('La revisión debe estar en curso para finalizarla');
        }
        const totalSecciones = asignacion.tramite.tipo_tramite._count.secciones;
        if (totalSecciones > 0 && asignacion.evaluaciones_secciones.length < totalSecciones) {
            throw new common_1.BadRequestException(`Debes evaluar todas las secciones (${asignacion.evaluaciones_secciones.length}/${totalSecciones} completadas)`);
        }
        await this.prisma.asignacionOficina.update({
            where: { id: asignacion.id },
            data: { estado: client_1.AsignacionEstado.completada, fecha_finalizacion: new Date(), jefe_asignado_id: user.id },
        });
        const todasCompletadas = await this.prisma.asignacionOficina.count({
            where: { tramite_id: id, estado: { not: client_1.AsignacionEstado.completada } },
        });
        if (todasCompletadas === 0) {
            await this.prisma.tramite.update({
                where: { id },
                data: { estado: client_1.TramiteEstado.en_revision_final, fecha_revision_final: new Date() },
            });
            await this.registrarHistorial(id, client_1.TramiteEstado.en_revision, client_1.TramiteEstado.en_revision_final, user.id, 'Todas las oficinas completaron su revisión');
            const tramite = await this.prisma.tramite.findUnique({
                where: { id },
                include: { tipo_tramite: true, empresa: true, jefe_decisor: true },
            });
            if (tramite?.jefe_decisor_id) {
                await this.crearNotificacion({
                    usuario_id: tramite.jefe_decisor_id,
                    tramite_id: id,
                    tipo: 'info',
                    titulo: `Trámite ${tramite.numero} listo para decisión final`,
                    mensaje: `Todas las oficinas completaron su revisión. El trámite ${tramite.numero} requiere tu decisión final.`,
                    accion_url: `/tramites/${id}`,
                });
                if (tramite.jefe_decisor) {
                    void this.mail.enviarListoParaDecision(tramite.jefe_decisor.email, {
                        nombre_solicitante: '',
                        numero_tramite: tramite.numero,
                        tipo_tramite: tramite.tipo_tramite.nombre,
                        empresa: tramite.empresa.razon_social,
                        url_tramite: `/tramites/${id}`,
                    });
                }
            }
        }
        return { mensaje: todasCompletadas === 0 ? 'Todas las oficinas completaron. Trámite en revisión final.' : 'Revisión completada. Esperando otras oficinas.' };
    }
    async decisionFinal(id, dto, jefeDecisorId) {
        const tramite = await this.prisma.tramite.findUnique({
            where: { id },
            include: { solicitante: true, empresa: true, tipo_tramite: true },
        });
        if (!tramite)
            throw new common_1.NotFoundException('Trámite no encontrado');
        if (tramite.estado !== client_1.TramiteEstado.en_revision_final) {
            throw new common_1.BadRequestException('El trámite debe estar en revisión final para tomar una decisión');
        }
        const nuevoEstado = dto.decision;
        const decision = await this.prisma.decisionFinal.create({
            data: {
                tramite_id: id,
                jefe_decisor_id: jefeDecisorId,
                decision: dto.decision,
                secciones_a_corregir: dto.secciones_a_corregir,
                mensaje_al_solicitante: dto.mensaje_al_solicitante,
                plantilla_usada_id: dto.plantilla_usada_id,
            },
        });
        const estadoFinal = dto.decision === 'observado' ? client_1.TramiteEstado.observado : nuevoEstado;
        await this.prisma.tramite.update({
            where: { id },
            data: { estado: estadoFinal, fecha_decision_final: new Date(), jefe_decisor_id: jefeDecisorId },
        });
        await this.registrarHistorial(id, client_1.TramiteEstado.en_revision_final, estadoFinal, jefeDecisorId, `Decisión final: ${dto.decision}`);
        const tipo = dto.decision === 'aprobado' ? 'success' : dto.decision === 'observado' ? 'warning' : 'error';
        await this.crearNotificacion({
            usuario_id: tramite.solicitante_id,
            tramite_id: id,
            tipo,
            titulo: `Decisión sobre tu trámite ${tramite.numero}`,
            mensaje: dto.mensaje_al_solicitante,
            accion_url: `/tramites/${id}`,
        });
        const empresa = tramite.empresa;
        if (empresa?.director_id) {
            await this.crearNotificacion({
                usuario_id: empresa.director_id,
                tramite_id: id,
                tipo: 'info',
                titulo: `Decisión sobre trámite ${tramite.numero}`,
                mensaje: `El trámite ${tramite.numero} fue ${dto.decision}.`,
                accion_url: `/tramites/${id}`,
            });
        }
        void this.mail.enviarDecisionFinal(tramite.solicitante.email, dto.decision, {
            nombre_solicitante: `${tramite.solicitante.nombre} ${tramite.solicitante.apellido}`,
            numero_tramite: tramite.numero,
            tipo_tramite: tramite.tipo_tramite.nombre,
            empresa: tramite.empresa.razon_social,
            mensaje: dto.mensaje_al_solicitante,
            url_tramite: `/tramites/${id}`,
        });
        return { decision, estado: estadoFinal };
    }
    async iniciarCorreccion(id, solicitante_id) {
        const tramite = await this.prisma.tramite.findUnique({ where: { id } });
        if (!tramite)
            throw new common_1.NotFoundException('Trámite no encontrado');
        if (tramite.estado !== client_1.TramiteEstado.observado) {
            throw new common_1.BadRequestException('Solo se puede iniciar corrección en un trámite observado');
        }
        const updated = await this.prisma.tramite.update({
            where: { id },
            data: { estado: client_1.TramiteEstado.corrigiendo },
        });
        await this.registrarHistorial(id, client_1.TramiteEstado.observado, client_1.TramiteEstado.corrigiendo, solicitante_id, 'Solicitante inició corrección');
        return updated;
    }
    async reenviar(id, solicitante_id, secciones) {
        const tramite = await this.prisma.tramite.findUnique({ where: { id } });
        if (!tramite)
            throw new common_1.NotFoundException('Trámite no encontrado');
        if (tramite.estado !== client_1.TramiteEstado.observado && tramite.estado !== client_1.TramiteEstado.corrigiendo) {
            throw new common_1.BadRequestException('Solo se puede reenviar un trámite en estado observado o corrigiendo');
        }
        await this.guardarSecciones(id, secciones, solicitante_id, 'reenvio_con_correcciones');
        await this.prisma.asignacionOficina.updateMany({
            where: { tramite_id: id },
            data: { estado: client_1.AsignacionEstado.pendiente, fecha_inicio_revision: null, fecha_finalizacion: null },
        });
        const updated = await this.prisma.tramite.update({
            where: { id },
            data: { estado: client_1.TramiteEstado.asignado, fecha_asignacion: new Date() },
        });
        await this.registrarHistorial(id, tramite.estado, client_1.TramiteEstado.asignado, solicitante_id, 'Solicitante reenvió el trámite con correcciones');
        return updated;
    }
};
exports.TramitesService = TramitesService;
exports.TramitesService = TramitesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        mail_service_1.MailService])
], TramitesService);
//# sourceMappingURL=tramites.service.js.map