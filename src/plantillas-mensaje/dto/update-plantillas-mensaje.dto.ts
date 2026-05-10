import { PartialType } from '@nestjs/swagger';
import { CreatePlantillasMensajeDto } from './create-plantillas-mensaje.dto';

export class UpdatePlantillasMensajeDto extends PartialType(CreatePlantillasMensajeDto) {}
