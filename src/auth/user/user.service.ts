import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schemas/user';
import { UpdateUserDto } from 'src/utils/schemas';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async getUser(userId: string) {
    const user = await this.userModel.findOne({ _id: userId });
    console.log('User id ', userId);

    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    return user.omitPassword();
  }

  async updateUser(userId: string, input: UpdateUserDto) {
    const updatedUser = await this.userModel.findByIdAndUpdate(
      userId,
      // Only update the fields in the `input` object
      { $set: input },
      { new: true, runValidators: true },
    );

    if (!updatedUser) {
      throw new HttpException('Updated profile failed', HttpStatus.NOT_FOUND);
    }

    return updatedUser.omitPassword();
  }

  async updateUserProfile(userId: string, imageUrl: string) {
    const user = await this.userModel.findById(userId);

    if (!user)
      throw new HttpException(
        'Update profile image failed',
        HttpStatus.BAD_REQUEST,
      );

    user.imageUrl = imageUrl;
    await user.save();

    return user.omitPassword();
  }
}
