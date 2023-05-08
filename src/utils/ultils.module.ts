import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConnectAzure } from './connect-azure.service';
import { PaginationService } from './pagination.service';
import { PasswordService } from './password.service';
import { ResponseService } from './response.service';
import { TokenService } from './token.service';

@Global()
@Module({
  imports: [JwtModule],
  providers: [
    ResponseService,
    PaginationService,
    TokenService,
    PasswordService,
    ConnectAzure,
  ],
  exports: [
    ResponseService,
    PaginationService,
    TokenService,
    PasswordService,
    ConnectAzure,
  ],
})
export class UtilsModule {}
