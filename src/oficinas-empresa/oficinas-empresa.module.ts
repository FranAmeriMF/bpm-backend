import { Module } from '@nestjs/common';
import { OficinasEmpresaController } from './oficinas-empresa.controller';
import { OficinasEmpresaService } from './oficinas-empresa.service';

@Module({
  controllers: [OficinasEmpresaController],
  providers: [OficinasEmpresaService],
})
export class OficinasEmpresaModule {}
