import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import { GetUser } from '../decorators/get-user.decorator';
import { ZodTransformPipe } from 'src/common/pipes/zod-transform.pipe';
import { updateUser, UpdateUserDto } from 'src/utils/schemas';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  @HttpCode(HttpStatus.OK)
  async getUser(@GetUser('userId') userId: string) {
    const result = await this.userService.getUser(userId);
    return { message: 'User found', data: result };
  }
  @Patch('profile')
  async updateUser(
    @GetUser('userId') userId: string,
    @Body(new ZodTransformPipe(updateUser)) input: UpdateUserDto,
  ) {
    const result = await this.userService.updateUser(userId, input);

    return { message: 'Update successfully', data: result };
  }
}
