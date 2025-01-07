import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Res,
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
import { Response } from 'express';

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
  @Post('login')
  //   @HttpCode(HttpStatus.ACCEPTED)
  async login(
    @Body(new ZodTransformPipe(loginSchema)) dto: LoginDto,
    @Res() res: Response,
  ) {
    const result = await this.authService.login(dto, res);
    return res.status(200).json(result);
  }

  @Get('user/:id')
  @HttpCode(HttpStatus.OK)
  async getUser(@Param('id') userId: string) {
    const result = this.userService.getUser(userId);
  }
}
