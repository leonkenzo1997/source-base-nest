import { PaginationService } from '../../utils/pagination.service';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rule } from './entities/rule.entity';
import { RuleRepository } from './repositories/rule.repository';
import { RulesController } from './rules.controller';
import { RulesService } from './rules.service';
import { UsersModule } from '../users/users.module';
import { UsersRulesModule } from '../users-rules/users-rules.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Rule]),
    forwardRef(() => UsersModule),
    UsersRulesModule,
  ],
  providers: [RulesService, RuleRepository],
  controllers: [RulesController],
  exports: [RulesService],
})
export class RulesModule {}
