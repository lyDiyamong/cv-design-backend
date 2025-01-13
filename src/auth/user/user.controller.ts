import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { GetUser } from '../decorators/get-user.decorator';
import { ZodTransformPipe } from 'src/common/pipes/zod-transform.pipe';
import { updateUserSchema, UpdateUserDto } from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { S3Service } from 'src/s3/s3.service';
import { ZodFileValidationPipe } from 'src/common/pipes/zod-file.pipe';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly s3Service: S3Service,
  ) {}

  @Get('profile')
  @HttpCode(HttpStatus.OK)
  async getUser(@GetUser('userId') userId: string) {
    const result = await this.userService.getUser(userId);
    return { message: 'User found', data: result };
  }
  @Patch('profile')
  @HttpCode(HttpStatus.OK)
  async updateUser(
    @GetUser('userId') userId: string,
    @Body(new ZodTransformPipe(updateUserSchema)) input: UpdateUserDto,
  ) {
    const result = await this.userService.updateUser(userId, input);

    return { message: 'Update successfully', data: result };
  }

  @Patch('profile-image')
  // "file" is the field name from the form
  @UseInterceptors(FileInterceptor('file'))
  @HttpCode(HttpStatus.OK)
  async updateUserProfile(
    @GetUser('userId') userId: string,
    @UploadedFile(ZodFileValidationPipe) file: Express.Multer.File,
  ) {
    // Find user image field if it's empty
    const user = await this.userService.getUser(userId);
    if (user.imageUrl) {
      await this.s3Service.deleteFile(user.imageUrl);
    }

    // Upload new image
    const imageUrl = await this.s3Service.uploadFile(file, 'user-profile');
    // Update imageUrl field
    const result = await this.userService.updateUserProfile(userId, imageUrl);
    return {
      message: 'Profile upload successfully',
      data: result,
    };
  }
}
