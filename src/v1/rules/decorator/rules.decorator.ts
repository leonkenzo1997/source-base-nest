import { SetMetadata } from '@nestjs/common';
import { UserRule } from '../rule.const';

export const AuthRules = (...rules: UserRule[]) => SetMetadata('rules', rules);
