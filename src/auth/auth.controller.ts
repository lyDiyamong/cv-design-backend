import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ZodTransformPipe } from 'src/common/pipes/zod-transform.pipe';
import {
  LoginDto,
  loginSchema,
  SignUpDto,
  signUpSchema,
} from 'src/utils/schemas';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  @HttpCode(HttpStatus.CREATED)
  async signUp(@Body(new ZodTransformPipe(signUpSchema)) dto: SignUpDto) {
    const result = await this.authService.signUp(dto);
    return result;
  }
  @Post('login')
  @HttpCode(HttpStatus.ACCEPTED)
  async login(@Body(new ZodTransformPipe(loginSchema)) dto: LoginDto) {
    const result = await this.authService.login(dto);
    return result;
  }
}
