import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Session extends Document {
  @Prop({ required: true, type: mongoose.Types.ObjectId, ref: 'User' })
  userId: string;

  @Prop({ type: String })
  userAgent?: string;
}

export const sessionSchema = SchemaFactory.createForClass(Session);
