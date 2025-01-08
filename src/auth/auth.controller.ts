import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ZodTransformPipe } from 'src/common/pipes/zod-transform.pipe';
import {
  LoginDto,
  loginSchema,
  SignUpDto,
  signUpSchema,
} from 'src/utils/schemas';
import { UserService } from './user/user.service';
import { Request, Response } from 'express';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtRefreshGuard } from 'src/common/guards/jwt-refresh.guard';
import { JwtRefreshUser } from 'src/types';
import { UserRestrictGuard } from 'src/common/guards/user-restrict.guard';
import { Public } from './decorators/public.decorator';
import { GetUser } from './decorators/get-user.decorator';

@Controller('api/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('sign-up')
  @HttpCode(HttpStatus.CREATED)
  async signUp(
    @Body(new ZodTransformPipe(signUpSchema)) dto: SignUpDto,
    @Res() res: Response,
  ) {
    const result = await this.authService.signUp(dto, res);
    return result;
  }
  @Public()
  @Post('login')
  //   @HttpCode(HttpStatus.ACCEPTED)
  async login(
    @Body(new ZodTransformPipe(loginSchema)) dto: LoginDto,
    @Res() res: Response,
  ) {
    const result = await this.authService.login(dto, res);
    return res.status(HttpStatus.ACCEPTED).json(result);
  }

  @Get('logout')
  async logoutHandler(@Req() req: Request, @Res() res: Response) {
    const result = await this.authService.logout(req, res);
    return res.status(HttpStatus.ACCEPTED).json(result);
  }
  @Get('user/:userId')

  // @UseGuards(UserRestrictGuard)
  @HttpCode(HttpStatus.OK)
  async getUser(
    @GetUser('userId') user: string,
    @Param('userId') userId: string,
  ) {
    const result = this.userService.getUser(userId);
    return result;
  }
  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  async refreshUserToken(@Req() req: Request, @Res() res: Response) {
    const user = req.user as JwtRefreshUser;
    console.log(user);
    const { payload, refreshToken } = user;

    const result = await this.authService.refreshTokens(
      payload.sessionId,
      refreshToken,
      res,
    );

    return res.status(HttpStatus.ACCEPTED).json(result);
  }
}
