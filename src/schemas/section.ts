import { BadRequestException } from '@nestjs/common';
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
  @Prop({ type: mongoose.Schema.Types.Mixed }) // Use Mixed to allow plain objects or arrays
  content: Record<string, any> | any[];
}

export const sectionSchema = SchemaFactory.createForClass(Section);

sectionSchema.pre('save', function (next) {
  const section = this as any;

  const requiredFieldsByType: Record<string, string[]> = {
    personal: ['firstName', 'lastName'],
    contact: ['phoneNumber', 'email', 'address'],
    skills: ['name', 'level'],
    experiences: ['jobTitle', 'company', 'startDate', 'endDate'],
    education: ['schoolName', 'degreeMajor', 'startDate', 'endDate'],
    languages: ['language', 'level'],
    reference: [
      'firstName',
      'lastName',
      'position',
      'company',
      'email',
      'phoneNumber',
    ],
  };

  const requiredFields = requiredFieldsByType[section.type];

  if (!requiredFields) {
    return next(
      new BadRequestException(`Invalid section type: ${section.type}`),
    );
  }

  const content = section.content;

  // Handle content as an object or array
  let missingFields: string[] = [];
  if (Array.isArray(content)) {
    // If content is an array, validate each object in the array
    missingFields = requiredFields.filter((field) =>
      content.some(
        (item: any) => item[field] === undefined || item[field] === null,
      ),
    );
  } else if (typeof content === 'object' && content !== null) {
    // If content is an object, validate fields directly
    missingFields = requiredFields.filter(
      (field) => content[field] === undefined || content[field] === null,
    );
  } else {
    return next(
      new BadRequestException(
        'Invalid content format: must be an object or array.',
      ),
    );
  }

  if (missingFields.length > 0) {
    return next(
      new BadRequestException(
        `Missing required fields: ${missingFields.join(', ')}`,
      ),
    );
  }

  next();
});

sectionSchema.index({ resumeId: 1, type: 1 }, { unique: true });

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
  skill: string;

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

  @Prop()
  company: string;

  @Prop({ type: String })
  responsibility: string;

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

sectionSchema.discriminator(
  'personal',
  new mongoose.Schema({
    content: {
      type: mongoose.Schema.Types.Mixed, // Allow object
      required: true,
    },
  }),
);

sectionSchema.discriminator(
  'contact',
  new mongoose.Schema({
    content: {
      type: mongoose.Schema.Types.Mixed, // Allow object
      required: true,
    },
  }),
);

sectionSchema.discriminator(
  'skills',
  new mongoose.Schema({
    content: {
      type: [mongoose.Schema.Types.Mixed], // Array of objects
      required: true,
    },
  }),
);

sectionSchema.discriminator(
  'experiences',
  new mongoose.Schema({
    content: {
      type: [mongoose.Schema.Types.Mixed], // Array of objects
      required: true,
    },
  }),
);

sectionSchema.discriminator(
  'educations',
  new mongoose.Schema({
    content: {
      type: [mongoose.Schema.Types.Mixed], // Array of objects
      required: true,
    },
  }),
);

sectionSchema.discriminator(
  'languages',
  new mongoose.Schema({
    content: {
      type: [mongoose.Schema.Types.Mixed], // Array of objects
      required: true,
    },
  }),
);

sectionSchema.discriminator(
  'references',
  new mongoose.Schema({
    content: {
      type: [mongoose.Schema.Types.Mixed], // Array of objects
      required: true,
    },
  }),
);
