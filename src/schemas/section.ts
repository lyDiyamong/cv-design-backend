import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';
import { ContentType } from 'src/types/contentType';
import { SectionType } from 'src/types/sectionType';

@Schema({ timestamps: true })
export class Section<T extends SectionType = SectionType> extends Document {
  @Prop({ type: Types.ObjectId, required: true, ref: 'Resume' })
  resumeId: string;
  @Prop({
    enum: [
      'personal',
      'contact',
      'skill',
      'experience',
      'education',
      'languages',
      'reference',
    ],
    required: true,
  })
  type: T;
  @Prop({ type: mongoose.Schema.Types.Mixed, required: true })
  content: ContentType[T];
}

export const sectionSchema = SchemaFactory.createForClass(Section);
