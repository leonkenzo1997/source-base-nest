import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { ErrorSuccess } from '../../interfaces/error-succes.interface';
import { IToken } from '../../interfaces/generate-token.interface';
import { PasswordService } from '../../utils/password.service';
import { ResponseService } from '../../utils/response.service';
import { TokenService } from '../../utils/token.service';
import { SessionsService } from '../sessions/sessions.service';
import { UserRole, UserStatus } from '../users/user.const';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { IJwt } from './interfaces/jwt.interface';
import { Login } from './interfaces/login.interface';

@Injectable()
export class AuthenticationService {
  constructor(
    private passwordService: PasswordService,
    private usersService: UsersService,
    private sessionsService: SessionsService,
    private tokenService: TokenService,
    private res: ResponseService,
    @Inject('CACHE_MANAGER')
    private cacheManager: Cache,
  ) {
    // empty
  }

  /**
   * This function generate new access token
   *
   * @param user  IJwt
   * @returns IToken
   */
  async accessToken(user: IJwt): Promise<IToken> {
    const accessToken = await this.tokenService.generateAccessToken(
      user.userId,
      user.sessionId,
      user.roleId,
      user.rules,
    );
    return accessToken;
  }

  /**
   * This function is account user login
   *
   * @param loginDto LoginDto
   * @returns Login | ErrorSuccess
   */
  async userLogin(loginDto: LoginDto): Promise<Login | ErrorSuccess> {
    let msgError: string;

    // hanlde isSaved for password and email
    const isSaved: boolean = loginDto?.isSaved ? loginDto.isSaved : false;

    //Find User
    let user: any = await this.usersService.findByEmail(loginDto.email);

    if (!user) {
      throw new HttpException('ACCOUNT_NOT_REGISTERED', HttpStatus.NOT_FOUND);
    }

    if (user.role.id === UserRole.SuperAdmin) {
      throw new HttpException('PERMISSION_DENIED', HttpStatus.FORBIDDEN);
    }

    // check status of user
    switch (user.status) {
      case UserStatus.Deleted:
        msgError = 'ACCOUNT_DELETED';
        break;
      case UserStatus.Blocked:
        msgError = 'ACCOUNT_BLOCKED';
        break;
      case UserStatus.Deactivated:
        msgError = 'ACCOUNT_DEACTIVATED';
        break;
      case UserStatus.Rejected:
        msgError = 'ACCOUNT_DEACTIVATED';
        break;
    }

    if (msgError) {
      throw new HttpException(msgError, HttpStatus.FORBIDDEN);
    }

    //Compare password
    const checkPassword = this.passwordService.comparePassword(
      loginDto.password,
      user.password,
    );

    if (!checkPassword) {
      throw new HttpException('WRONG_PASSWORD', HttpStatus.BAD_REQUEST);
    }

    // assign data session in array
    let session = await this.sessionsService.createSession(user);

    // update login access of user
    user = await this.usersService.updateLoginAccessTimeByUserId(
      user.id,
      isSaved,
    );

    //Generate access token
    const accessToken: IToken = await this.tokenService.generateAccessToken(
      user.id,
      session.id,
      user.role.id,
      user.rules,
    );

    //Generate refresh token
    const refreshToken: IToken = await this.tokenService.generateRefreshToken(
      user.id,
      session.id,
      user.role.id,
      user.rules,
    );

    //return user info and token
    const results = {
      userData: user,
      accessToken: accessToken.token,
      refreshToken: refreshToken.token,
    };

    return results;
  }

  /**
   * Tis function is account admin login
   *
   * @param loginDto LoginDto
   * @returns login | ErrorSuccess
   */
  async adminLogin(loginDto: LoginDto): Promise<Login | ErrorSuccess> {
    let msgError: string;
    // hanlde isSaved for password and email
    const isSaved: boolean = loginDto?.isSaved ? loginDto.isSaved : false;

    //Find User
    let user: any = await this.usersService.findByEmail(loginDto.email);

    // check user
    if (!user) {
      throw new HttpException('ACCOUNT_NOT_REGISTERED', HttpStatus.NOT_FOUND);
    }

    // check status of user
    switch (user.status) {
      case UserStatus.Deleted:
        msgError = 'ACCOUNT_DELETED';
        break;
      case UserStatus.Blocked:
        msgError = 'ACCOUNT_BLOCKED';
        break;
      case UserStatus.Deactivated:
        msgError = 'ACCOUNT_DEACTIVATED';
        break;
      case UserStatus.Rejected:
        msgError = 'ACCOUNT_DEACTIVATED';
        break;
    }

    // check status of account
    if (msgError) {
      throw new HttpException(msgError, HttpStatus.FORBIDDEN);
    }

    //Compare password
    const checkPassword = this.passwordService.comparePassword(
      loginDto.password,
      user.password,
    );

    // check password
    if (!checkPassword) {
      throw new HttpException('WRONG_PASSWORD', HttpStatus.BAD_REQUEST);
    }

    // get data role of user
    const role: number = user?.role?.id;

    // check Role
    const checkRole: boolean = Object.values([
      UserRole.Admin,
      UserRole.SuperAdmin,
    ]).includes(role);

    if (!checkRole) {
      throw new HttpException('PERMISSION_DENIED', HttpStatus.FORBIDDEN);
    }

    // assign data session in array
    let session = await this.sessionsService.createSession(user);

    // update login access of user
    user = await this.usersService.updateLoginAccessTimeByUserId(
      user.id,
      isSaved,
    );

    //Generate access and refresh token
    const [accessToken, refreshToken] = [
      await this.tokenService.generateAccessToken(
        user.id,
        session.id,
        user.role.id,
        user.rules,
      ),
      await this.tokenService.generateRefreshToken(
        user.id,
        session.id,
        user.role.id,
        user.rules,
      ),
    ];

    //return user info and token
    const results = {
      userData: user,
      accessToken: accessToken.token,
      refreshToken: refreshToken.token,
    };

    return results;
  }

  /**
   * This function is logout
   *
   * @param reqUser any
   * @return void
   */
  async logout(reqUser: any): Promise<void> {
    let sessionId = reqUser?.sessionId;

    const userSession = await this.sessionsService.findActiveSessionById(
      sessionId,
    );

    if (!userSession) {
      throw new HttpException('UNAUTHORIZED', HttpStatus.UNAUTHORIZED);
    }

    let promises = [
      this.sessionsService.disableActiveSessionById(userSession.id),
    ];
    promises.push(this.cacheManager.del(String(userSession.id)));

    await Promise.all(promises);
  }
}
