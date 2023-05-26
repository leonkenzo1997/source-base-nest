import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class AttachIdDto {
  // @IsNumber(
  //   {},
  //   {
  //     message: i18nValidationMessage('validations.INVALID_NUMBER'),
  //   },
  // )
  @IsNotEmpty({ message: i18nValidationMessage('validations.NOT_EMPTY') })
  id: number;
}

export class AttachUserIdDto {
  @IsNumber(
    {},
    {
      message: i18nValidationMessage('validations.INVALID_NUMBER'),
    },
  )
  @IsNotEmpty({ message: i18nValidationMessage('validations.NOT_EMPTY') })
  userId: number;
}

export class AttachBuildingIdDto {
  @IsNumber(
    {},
    {
      message: i18nValidationMessage('validations.INVALID_NUMBER'),
    },
  )
  buildingId: number;
}

export class AttachFloorIdDto {
  @IsNumber(
    {},
    {
      message: i18nValidationMessage('validations.INVALID_NUMBER'),
    },
  )
  floorId: number;
}

export class AttachZoneIdDto {
  @IsNumber(
    {},
    {
      message: i18nValidationMessage('validations.INVALID_NUMBER'),
    },
  )
  zoneId: number;
}

export class AttachGroupIdDto {
  @IsNumber(
    {},
    {
      message: i18nValidationMessage('validations.INVALID_NUMBER'),
    },
  )
  groupId: number;
}

export class AttachSceneIdDto {
  @IsNumber(
    {},
    {
      message: i18nValidationMessage('validations.INVALID_NUMBER'),
    },
  )
  sceneId: number;
}

export class AttachDeviceTypeIdDto {
  @IsNumber(
    {},
    {
      message: i18nValidationMessage('validations.INVALID_NUMBER'),
    },
  )
  deviceType: number;
}

export class AttachDeviceIdDto {
  @IsNumber(
    {},
    {
      message: i18nValidationMessage('validations.INVALID_NUMBER'),
    },
  )
  deviceId: number;
}

export class AttachAddressDto {
  @IsString({ message: i18nValidationMessage('validations.INVALID_STRING') })
  address: string;
}


