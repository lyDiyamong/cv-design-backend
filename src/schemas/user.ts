import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { hashPassword } from 'src/utils/bcrypt';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ type: String, required: true })
  firstName: string;
  @Prop({ type: String, required: true })
  lastName: string;
  @Prop({ type: String, unique: true, required: true })
  email: string;
  @Prop({ enum: ['Male', 'Female'], required: true })
  gender: string;
  @Prop({ type: String })
  imgUrl?: string;
  @Prop({
    type: String,
    required: true,
  })
  password: string;
  @Prop({ type: Date, required: true })
  dateOfBirth: Date;

  omitPassword(): Pick<
    User,
    'firstName' | 'lastName' | 'email' | 'gender' | 'imgUrl' | '_id'
  > {
    // Placeholder, as implementation is added to the schema
    throw new Error('Method not implemented.');
  }
}

export const userSchema = SchemaFactory.createForClass(User);

userSchema.methods.omitPassword = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

userSchema.pre('save', async function (next) {
  // Only hash this password if the password was actually modified
  if (!this.isModified('password')) return next();
  this.password = await hashPassword(this.password);
  next();
});
