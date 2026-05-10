import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { EmpresasModule } from './empresas/empresas.module';
import { OficinasModule } from './oficinas/oficinas.module';
import { TiposTramiteModule } from './tipos-tramite/tipos-tramite.module';
import { PlantillasMensajeModule } from './plantillas-mensaje/plantillas-mensaje.module';
import { TramitesModule } from './tramites/tramites.module';
import { ArchivosModule } from './archivos/archivos.module';
import { EvaluacionesModule } from './evaluaciones/evaluaciones.module';
import { NotificacionesModule } from './notificaciones/notificaciones.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { RolesGuard } from './auth/guards/roles.guard';
import { DecisionesModule } from './decisiones/decisiones.module';
import { ReportesModule } from './reportes/reportes.module';
import { MailModule } from './mail/mail.module';
import { OficinasEmpresaModule } from './oficinas-empresa/oficinas-empresa.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UsersModule,
    EmpresasModule,
    OficinasModule,
    TiposTramiteModule,
    PlantillasMensajeModule,
    TramitesModule,
    ArchivosModule,
    EvaluacionesModule,
    NotificacionesModule,
    DecisionesModule,
    ReportesModule,
    MailModule,
    OficinasEmpresaModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule {}
