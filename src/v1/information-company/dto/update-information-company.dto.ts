import { PartialType } from '@nestjs/mapped-types';
import { CreateInformationCompanyDto } from './create-information-company.dto';

export class UpdateInformationCompanyDto extends PartialType(CreateInformationCompanyDto) {}
