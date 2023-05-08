import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { IToken } from '../interfaces/generate-token.interface';
import { UserRole } from '../v1/users/user.const';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    // empty
  }

  async generateAccessToken(
    userId: number,
    sessionId: number,
    roleId: UserRole,
    rules: any[],
  ): Promise<IToken> {
    const options = {
      expiresIn: this.configService.get<string>('jwt.accessTokenExpiresIn'),
      secret: this.configService.get<string>('jwt.accessTokenSecret'),
    };

    let accessToken: string = await this.jwtService.sign(
      { userId, sessionId, roleId, rules },
      options,
    );
    return { token: accessToken };
  }

  async generateRefreshToken(
    userId: number,
    sessionId: number,
    roleId: UserRole,
    rules: any[],
  ): Promise<IToken> {
    const options = {
      expiresIn: this.configService.get<string>('jwt.refreshTokenExpiresIn'),
      secret: this.configService.get<string>('jwt.refreshTokenSecret'),
    };

    let refreshToken: string = await this.jwtService.signAsync(
      { userId, sessionId, roleId, rules },
      options,
    );
    return { token: refreshToken };
  }

  async generateProvisionKey(
    buildingId: number,
    floorId: number,
  ): Promise<IToken> {
    let provisionKey = await this.randomString(16);
    return { token: provisionKey };
  }

  // generateResetPasswordToken(userId: number, resetPasswordId: number) {
  //   const options = {
  //     secret: this.configService.get<string>('jwt.resetPasswordTokenSecret'),
  //   };
  //   return this.jwtService.sign({ userId, resetPasswordId }, options);
  // }

  /**
   * This function random
   * @param len
   * @returns
   */
  async randomString(len: number): Promise<string> {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < len; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
  }
}
