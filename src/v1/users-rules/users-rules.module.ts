import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { UserRule } from './entities/user-rule.entity';
import { UsersRulesRepository } from './repositories/rule.repository';
import { UsersRulesController } from './users-rules.controller';
import { UsersRulesService } from './users-rules.service';

@Module({
  controllers: [UsersRulesController],
  providers: [UsersRulesService, UsersRulesRepository],
  imports: [
    TypeOrmModule.forFeature([UserRule]),
    forwardRef(() => UsersModule),
  ],
  exports: [UsersRulesService],
})
export class UsersRulesModule {}
