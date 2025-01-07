import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

// Schema
import { sessionSchema, Session } from 'src/schemas/session';
import { User, userSchema } from 'src/schemas/user';
import { UserService } from './user.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: userSchema },
      { name: Session.name, schema: sessionSchema },
    ]),
  ],
  exports: [MongooseModule],
  providers: [UserService],
})
export class UserModule {}
