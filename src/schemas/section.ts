import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';
import { ContentType, SectionType } from 'src/types';

@Schema({ timestamps: true })
export class Section<T extends SectionType = SectionType> extends Document {
  @Prop({ type: Types.ObjectId, required: true, ref: 'Resume' })
  resumeId: string;
  @Prop({
    enum: [
      'personal',
      'contact',
      'skills',
      'experiences',
      'educations',
      'languages',
      'references',
    ],
    required: true,
  })
  type: T;
  @Prop({ type: mongoose.Schema.Types.Mixed, required: true })
  content: ContentType[T];
}

export const sectionSchema = SchemaFactory.createForClass(Section);
sectionSchema.index({ resumeId: 1, type: 1 }, { unique: true });

// Create the model
// const SectionModel = mongoose.model('Section', sectionSchema);

// Ensure indexes are synced (typically during app initialization)
// SectionModel.ensureIndexes();

// Discriminators Schema

// Personal sub-schema
@Schema({ _id: false })
// Obj
export class PersonalContent {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop()
  imgUrl: string;

  @Prop({ required: true })
  position: string;

  @Prop()
  summary: string;
}
export const personalContentSchema =
  SchemaFactory.createForClass(PersonalContent);

// Contact sub-schema
// Obj
@Schema({ _id: false })
export class ContactContent {
  @Prop()
  phone: string;

  @Prop({ required: true })
  email: string;

  @Prop()
  address: string;
}

export const contactContentSchema =
  SchemaFactory.createForClass(ContactContent);

// Skill sub-schema
@Schema({ _id: false })
// Array
export class SkillContent {
  @Prop({ required: true })
  name: string;

  @Prop({
    required: true,
    enum: ['Expert', 'Advance', 'Intermediate', 'Beginner'],
  })
  level: 'Expert' | 'Advance' | 'Intermediate' | 'Beginner';
}

export const skillContentSchema = SchemaFactory.createForClass(SkillContent);

// Experience sub-schema
@Schema({ _id: false })
// Array
export class ExperienceContent {
  @Prop({ required: true })
  jobTitle: string;

  @Prop({ type: [String] })
  responsibilities: string;

  @Prop({ type: Date, required: true })
  startDate: Date;

  @Prop({ type: Date, required: true })
  endDate: Date;
}

export const experienceContentSchema =
  SchemaFactory.createForClass(ExperienceContent);

// Education sub-schema
@Schema({ _id: false })
// Array
export class EducationContent {
  @Prop({ required: true })
  school: string;

  @Prop({ required: true })
  degreeMajor: string;

  @Prop({ type: Date, required: true })
  startDate: Date;

  @Prop({ type: Date, required: true })
  endDate: Date;
}

export const educationContentSchema =
  SchemaFactory.createForClass(EducationContent);

// Language sub-schema
@Schema({ _id: false })
// Array
export class LanguageContent {
  @Prop({ required: true })
  language: string;

  @Prop({
    required: true,
    enum: ['Fluent', 'Advance', 'Intermediate', 'Beginner'],
  })
  level: 'Fluent' | 'Advance' | 'Intermediate' | 'Beginner';
}

export const languageContentSchema =
  SchemaFactory.createForClass(LanguageContent);

// Reference sub-schema
@Schema({ _id: false })
// Array
export class ReferenceContent {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  company: string;

  @Prop({ required: true })
  position: string;
}

export const referenceContentSchema =
  SchemaFactory.createForClass(ReferenceContent);

// Add Discriminators for each type of section
sectionSchema.discriminator('personal', personalContentSchema);
sectionSchema.discriminator('contact', contactContentSchema);
sectionSchema.discriminator('skills', { type: [skillContentSchema] });
sectionSchema.discriminator('experiences', { type: [experienceContentSchema] });
sectionSchema.discriminator('educations', { type: [educationContentSchema] });
sectionSchema.discriminator('languages', { type: [languageContentSchema] });
sectionSchema.discriminator('references', { type: [referenceContentSchema] });
