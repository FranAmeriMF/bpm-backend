import { Module } from '@nestjs/common';
import { PlantillasMensajeController } from './plantillas-mensaje.controller';
import { PlantillasMensajeService } from './plantillas-mensaje.service';

@Module({
  controllers: [PlantillasMensajeController],
  providers: [PlantillasMensajeService]
})
export class PlantillasMensajeModule {}
