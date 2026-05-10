import { Module } from '@nestjs/common';
import { DecisionesController } from './decisiones.controller';
import { DecisionesService } from './decisiones.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [DecisionesController],
  providers: [DecisionesService],
})
export class DecisionesModule {}
