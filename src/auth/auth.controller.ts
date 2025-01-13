import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ZodTransformPipe } from 'src/common/pipes/zod-transform.pipe';

import { Request, Response } from 'express';
import { JwtRefreshGuard } from 'src/common/guards/jwt-refresh.guard';
import { JwtRefreshUser } from 'src/types';
import { Public } from './decorators/public.decorator';
import { SignUpDto, signUpSchema } from './dto/signup.dto';
import { LoginDto, loginSchema } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('sign-up')
  @HttpCode(HttpStatus.CREATED)
  async signUp(
    @Body(new ZodTransformPipe(signUpSchema)) dto: SignUpDto,
    @Res() res: Response,
  ) {
    const { accessToken, refreshToken } = await this.authService.signUp(dto);

    res.cookie('accessToken', accessToken).cookie('refreshToken', refreshToken);

    return res.status(HttpStatus.CREATED).json({
      message: 'Sign up successfully',
    });
  }
  @Public()
  @Post('login')
  async login(
    @Body(new ZodTransformPipe(loginSchema)) dto: LoginDto,
    @Res() res: Response,
  ) {
    const { accessToken, refreshToken } = await this.authService.login(dto);
    res.cookie('accessToken', accessToken).cookie('refreshToken', refreshToken);
    return res
      .status(HttpStatus.ACCEPTED)
      .json({ message: 'Log in successfully' });
  }

  @Get('logout')
  async logoutHandler(@Req() req: Request, @Res() res: Response) {
    const accessToken = req.cookies.accessToken as string | undefined;
    await this.authService.logout(accessToken);

    res.clearCookie('accessToken');
    return res
      .status(HttpStatus.ACCEPTED)
      .json({ message: 'Log out successfully' });
  }
  @Public()
  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  async refreshUserToken(@Req() req: Request, @Res() res: Response) {
    const user = req.user as JwtRefreshUser;
    const { payload, refreshToken } = user;

    const { newAccessToken, newRefreshToken } =
      await this.authService.refreshTokens(refreshToken);

    res
      .cookie('accessToken', newAccessToken)
      .cookie('refreshToken', newRefreshToken);

    return res
      .status(HttpStatus.ACCEPTED)
      .json({ message: 'Token refresh successfully' });
  }
}
