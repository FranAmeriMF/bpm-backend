import { Module } from '@nestjs/common';
import { TramitesController } from './tramites.controller';
import { TramitesService } from './tramites.service';
import { MailModule } from '../mail/mail.module';
import { ArchivosModule } from '../archivos/archivos.module';

@Module({
  imports: [MailModule, ArchivosModule],
  controllers: [TramitesController],
  providers: [TramitesService],
})
export class TramitesModule {}
