import {
  IsIn,
  IsNotEmpty,
  IsNumber, IsString,
  Max,
  Min
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { DIMMING_MODE, INDICATOR_LIGHT_MODE } from '../device-setting.const';

export class UpdateIndicatorModeDto {
  @IsNotEmpty({ message: i18nValidationMessage('validations.NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validations.INVALID_STRING') })
  color: string;

  @IsNotEmpty({ message: i18nValidationMessage('validations.NOT_EMPTY') })
  @IsIn(Object.values(INDICATOR_LIGHT_MODE))
  @IsNumber(
    {},
    {
      message: i18nValidationMessage('validations.INVALID_NUMBER'),
    },
  )
  indicatorMode: INDICATOR_LIGHT_MODE;

  @IsNotEmpty({ message: i18nValidationMessage('validations.NOT_EMPTY') })
  @IsNumber(
    {},
    {
      message: i18nValidationMessage('validations.INVALID_NUMBER'),
    },
  )
  @Min(0, {
    message: i18nValidationMessage('validations.MIN_BRIGHTNESS'),
  })
  @Max(100, {
    message: i18nValidationMessage('validations.MAX_BRIGHTNESS'),
  })
  brightnessColor: number;
}

export class UpdateLightOptimizationModeDto {
  @IsNotEmpty({ message: i18nValidationMessage('validations.NOT_EMPTY') })
  @IsNumber(
    {},
    {
      message: i18nValidationMessage('validations.INVALID_NUMBER'),
    },
  )
  @Min(100, {
    message: i18nValidationMessage('validations.MIN_LUX_SETTING'),
  })
  @Max(2000, {
    message: i18nValidationMessage('validations.MAX_LUX_SETTING'),
  })
  luxSetting: number;

  @IsNotEmpty({ message: i18nValidationMessage('validations.NOT_EMPTY') })
  @IsNumber(
    {},
    {
      message: i18nValidationMessage('validations.INVALID_NUMBER'),
    },
  )
  @IsIn(Object.values(DIMMING_MODE))
  @Min(0, {
    message: i18nValidationMessage('validations.MIN_DIMMING_SETTING'),
  })
  @Max(2, {
    message: i18nValidationMessage('validations.MAX_DIMMING_SETTING'),
  })
  dimmingSetting: DIMMING_MODE;
}
