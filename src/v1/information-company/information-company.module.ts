import { Module } from '@nestjs/common';
import { InformationCompanyService } from './information-company.service';
import { InformationCompanyController } from './information-company.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InformationCompany } from './entities/information-company.entity';
import { InformationCompanyRepository } from './repositories/information-company.repository';

@Module({
  controllers: [InformationCompanyController],
  providers: [InformationCompanyService, InformationCompanyRepository],
  imports: [TypeOrmModule.forFeature([InformationCompany])],
  exports: [InformationCompanyService],
})
export class InformationCompanyModule {}
