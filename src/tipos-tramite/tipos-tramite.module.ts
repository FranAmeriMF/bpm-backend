import { Module } from '@nestjs/common';
import { TiposTramiteController } from './tipos-tramite.controller';
import { TiposTramiteService } from './tipos-tramite.service';

@Module({
  controllers: [TiposTramiteController],
  providers: [TiposTramiteService]
})
export class TiposTramiteModule {}
