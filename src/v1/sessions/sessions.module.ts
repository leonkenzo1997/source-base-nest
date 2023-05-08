import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Session } from './entities/session.entity';
import { SessionsRepository } from './repositories/session.repository';
import { SessionsController } from './sessions.controller';
import { SessionsService } from './sessions.service';

@Module({
  controllers: [SessionsController],
  providers: [SessionsService, SessionsRepository],
  imports: [TypeOrmModule.forFeature([Session])],
  exports: [SessionsService],
})
export class SessionsModule {}
