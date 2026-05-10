import { Module } from '@nestjs/common';
import { EvaluacionesController } from './evaluaciones.controller';
import { EvaluacionesService } from './evaluaciones.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [EvaluacionesController],
  providers: [EvaluacionesService],
})
export class EvaluacionesModule {}
