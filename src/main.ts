import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { i18nValidationErrorFactory } from 'nestjs-i18n';
import { AppModule } from './app.module';
import { JwtAuthGuard } from './v1/authentication/guard/jwt-authentication.guard';
import { RolesGuard } from './v1/roles/guard/roles.guard';
import { RulesGuard } from './v1/rules/guard/rules.guard';
// import { TransformInterceptor } from './utils/interceptors/transform.interceptor';
// import { JwtAuthenticationGuard } from './v1/authentication/guard/jwt-authentication.guard';
// import { RolesGuard } from './v1/authentication/guard/role.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // Empty
  });

  const configService = app.get(ConfigService);
  const port = configService.get('PORT');

  app.enableCors();

  // take token and handle token
  app.useGlobalGuards(
    new JwtAuthGuard(),
    new RolesGuard(new Reflector()),
    new RulesGuard(new Reflector()),
  );

  // using validation of DTO
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: i18nValidationErrorFactory,
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  app.enableCors({
    // wrong!  in my case, anyway
    origin: `${process.env.URL_WEB_ADMIN}`,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept',
    credentials: true,
  });
  // app.useGlobalFilters(new I18nValidationExceptionFilter());
  app.setGlobalPrefix('api');
  // app.useGlobalInterceptors(new TransformInterceptor());
  await app.listen(port);
}

bootstrap();
