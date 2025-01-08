import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Resume extends Document {
  @Prop({ type: Types.ObjectId, required: true, ref: 'User' })
  userId: string;
  @Prop({ type: Types.ObjectId, required: true, ref: 'Template' })
  templateId: string;
  @Prop({ type: String, required: true })
  title: string;
  @Prop({ type: String, required: true })
  previewImg: string;
}

export const resumeSchema = SchemaFactory.createForClass(Resume);
