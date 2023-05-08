import { FloorsModule } from '../floors/floors.module';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BuildingsModule } from '../buildings/buildings.module';
import { RulesModule } from '../rules/rules.module';
import { User } from './entities/user.entity';
import { UsersRepository } from './repositories/users.repository';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
@Module({
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(() => RulesModule),
    forwardRef(() => FloorsModule),
    forwardRef(() => BuildingsModule),
  ],
  exports: [UsersService],
})
export class UsersModule {}
