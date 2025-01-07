import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Session } from 'src/schemas/session';
import { User } from 'src/schemas/user';
import { JsonResponse } from 'src/types/jsonResponseType';
import { comparePassword } from 'src/utils/bcrypt';
import { LoginDto, SignUpDto } from 'src/utils/schemas';
import { TokenService } from './token/token.service';
import { CookieStrategy } from './strategies';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Session.name) private readonly sessionModel: Model<Session>,
    private tokenService: TokenService,
    private cookieStrategy: CookieStrategy,
  ) {}

  async signUp(dto: SignUpDto, res: Response) {
    const userExist = await this.userModel.exists({ email: dto.email });

    if (userExist) throw new ForbiddenException('User already existed');

    const userCreated = await this.userModel.create({
      email: dto.email,
      firstName: dto.firstName,
      lastName: dto.lastName,
      password: dto.password,
      gender: dto.gender,
    });

    const sessionCreated = await this.sessionModel.create({
      userAgent: dto.userAgent,
      userId: userCreated._id,
    });

    const sessionId = sessionCreated._id.toString();
    const userId = userCreated._id.toString();

    // generate token
    const { accessToken, refreshToken } =
      await this.tokenService.generateTokens(userId, sessionId);
    this.cookieStrategy.setCookies({ res, accessToken, refreshToken });
    return {
      message: 'Sign up successfully',
      data: userCreated.omitPassword(),
    };
  }

  async login(dto: LoginDto, res: Response) {
    const user = await this.userModel.findOne({ email: dto.email });
    if (!user) throw new ForbiddenException('Access denied');

    const passwordMatch = await comparePassword(dto.password, user.password);
    if (!passwordMatch) throw new ForbiddenException('Wrong Password');

    const userId = user._id.toString();

    const session = await this.sessionModel.findOne({ userId });
    const sessionId = session?._id?.toString();

    // generate token
    const { accessToken, refreshToken } =
      await this.tokenService.generateTokens(userId, sessionId);
    this.cookieStrategy.setCookies({ res, accessToken, refreshToken });
    return {
      message: 'Login successfully',
      data: user.omitPassword(),
    };
  }
}
