import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsString
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
  @ApiProperty({
    required: true,
  })
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
  @ApiProperty()
  userId: number;
}

export class AttachBuildingIdDto {
  @IsNumber(
    {},
    {
      message: i18nValidationMessage('validations.INVALID_NUMBER'),
    },
  )
  @ApiProperty()
  buildingId: number;
}

export class AttachFloorIdDto {
  @IsNumber(
    {},
    {
      message: i18nValidationMessage('validations.INVALID_NUMBER'),
    },
  )
  @ApiProperty()
  floorId: number;
}

export class AttachZoneIdDto {
  @IsNumber(
    {},
    {
      message: i18nValidationMessage('validations.INVALID_NUMBER'),
    },
  )
  @ApiProperty()
  zoneId: number;
}

export class AttachGroupIdDto {
  @IsNumber(
    {},
    {
      message: i18nValidationMessage('validations.INVALID_NUMBER'),
    },
  )
  @ApiProperty()
  groupId: number;
}

export class AttachSceneIdDto {
  @IsNumber(
    {},
    {
      message: i18nValidationMessage('validations.INVALID_NUMBER'),
    },
  )
  @ApiProperty()
  sceneId: number;
}

export class AttachDeviceTypeIdDto {
  @IsNumber(
    {},
    {
      message: i18nValidationMessage('validations.INVALID_NUMBER'),
    },
  )
  @ApiProperty()
  deviceType: number;
}

export class AttachDeviceIdDto {
  @IsNumber(
    {},
    {
      message: i18nValidationMessage('validations.INVALID_NUMBER'),
    },
  )
  @ApiProperty()
  deviceId: number;
}

export class AttachAddressDto {
  @ApiProperty()
  @IsString({ message: i18nValidationMessage('validations.INVALID_STRING') })
  address: string;
}
