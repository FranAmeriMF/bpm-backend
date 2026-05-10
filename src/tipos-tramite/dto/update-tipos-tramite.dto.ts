import { PartialType } from '@nestjs/swagger';
import { CreateTiposTramiteDto } from './create-tipos-tramite.dto';

export class UpdateTiposTramiteDto extends PartialType(CreateTiposTramiteDto) {}
