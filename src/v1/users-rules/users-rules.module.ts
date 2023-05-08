import { forwardRef, Module } from '@nestjs/common';
import { UsersRulesService } from './users-rules.service';
import { UsersRulesController } from './users-rules.controller';
import { UserRule } from './entities/user-rule.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { UsersRulesRepository } from './repositories/rule.repository';
import { RulesModule } from '../rules/rules.module';

@Module({
  controllers: [UsersRulesController],
  providers: [UsersRulesService, UsersRulesRepository],
  imports: [TypeOrmModule.forFeature([UserRule]),forwardRef(() => UsersModule), ],
  exports: [UsersRulesService],
})
export class UsersRulesModule {}
