import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

// Schema
import { sessionSchema, Session } from 'src/schemas/session';
import { User, userSchema } from 'src/schemas/user';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { S3Module } from 'src/s3/s3.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: userSchema },
      { name: Session.name, schema: sessionSchema },
    ]),
    S3Module,
  ],
  exports: [MongooseModule],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
