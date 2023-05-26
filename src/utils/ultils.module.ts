import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { EncryptService } from './encryption.service';
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
    EncryptService,
  ],
  exports: [
    ResponseService,
    PaginationService,
    TokenService,
    PasswordService,
    EncryptService,
  ],
})
export class UtilsModule {}
