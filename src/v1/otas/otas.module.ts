import { Module } from '@nestjs/common';
import { OtasService } from './otas.service';
import { OtasController } from './otas.controller';
import { Ota } from './entities/ota.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeviceTypesModule } from '../device-types/device-types.module';
import { OtasRepository } from './repositories/otas.repository';

@Module({
  controllers: [OtasController],
  providers: [OtasService, OtasRepository],
  imports: [TypeOrmModule.forFeature([Ota]), DeviceTypesModule],
  exports: [OtasService],
})
export class OtasModule {}
