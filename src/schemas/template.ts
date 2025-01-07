import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Template extends Document {
  @Prop({ type: String, required: true })
  name: string;
  @Prop({ type: String })
  description?: string;
  @Prop({ type: String, required: true })
  tempImg: string;
}

export const templateSchema = SchemaFactory.createForClass(Template);
