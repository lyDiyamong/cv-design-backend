import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';
import { ContentType } from 'src/types';
import { SectionType } from 'src/types';

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

// Discriminators Schema

// Personal sub-schema
@Schema({ _id: false })
// Obj
export class PersonalContent {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true })
  imgUrl: string;

  @Prop({ required: true })
  position: string;

  @Prop({ required: true })
  summary: string;
}
export const personalContentSchema =
  SchemaFactory.createForClass(PersonalContent);

// Contact sub-schema
// Obj
@Schema({ _id: false })
export class ContactContent {
  @Prop({ required: true })
  phone: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
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

  @Prop({ required: true })
  position: string;

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
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

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
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
sectionSchema.discriminator('skills', skillContentSchema);
sectionSchema.discriminator('experiences', experienceContentSchema);
sectionSchema.discriminator('educations', educationContentSchema);
sectionSchema.discriminator('languages', languageContentSchema);
sectionSchema.discriminator('references', referenceContentSchema);
