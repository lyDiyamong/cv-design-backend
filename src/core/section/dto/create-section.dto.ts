import { z } from 'zod';

// Define Zod schemas for each type
const PersonalContentSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  imgUrl: z.string().url('Invalid image URL'),
  position: z.string().min(1, 'Position is required'),
  summary: z.string().min(1, 'Summary is required'),
});

const ContactContentSchema = z.object({
  phone: z.string().min(1, 'Phone number is required'),
  email: z.string().email('Invalid email address'),
  address: z.string().min(1, 'Address is required'),
});

const SkillContentSchema = z.array(
  z.object({
    name: z.string().min(1, 'Skill name is required'),
    level: z.enum(['Expert', 'Advance', 'Intermediate', 'Beginner']),
  }),
);

const ExperienceContentSchema = z.array(
  z
    .object({
      jobTitle: z.string().min(1, 'Job title is required'),
      responsibilities: z.array(z.string().optional()),
      startDate: z.coerce.date({
        required_error: 'Please select a start date',
        invalid_type_error: "That's not a valid date!",
      }),
      endDate: z.coerce.date({
        required_error: 'Please select an end date',
        invalid_type_error: "That's not a valid date!",
      }),
    })
    .superRefine((data, ctx) => {
      if (data.endDate <= data.startDate) {
        ctx.addIssue({
          code: 'custom',
          path: ['endDate'],
          message: 'End date must be later than start date',
        });
      }
    }),
);

const EducationContentSchema = z.array(
  z
    .object({
      school: z.string().min(1, 'School name is required'),
      degreeMajor: z.string().min(1, 'Degree or Major is required'),
      startDate: z.coerce.date({
        required_error: 'Please select a start date',
        invalid_type_error: "That's not a valid date!",
      }),
      endDate: z.coerce.date({
        required_error: 'Please select an end date',
        invalid_type_error: "That's not a valid date!",
      }),
    })
    .superRefine((data, ctx) => {
      if (data.endDate <= data.startDate) {
        ctx.addIssue({
          code: 'custom',
          path: ['endDate'],
          message: 'End date must be later than start date',
        });
      }
    }),
);

const LanguageContentSchema = z.array(
  z.object({
    language: z.string().min(1, 'Language is required'),
    level: z.enum(['Fluent', 'Advance', 'Intermediate', 'Beginner']),
  }),
);

const ReferenceContentSchema = z.array(
  z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.string().email('Invalid email address'),
    company: z.string().min(1, 'Company name is required'),
    position: z.string().min(1, 'Position is required'),
  }),
);

// Map schemas to types
export const SectionSchemas = {
  personal: PersonalContentSchema,
  contact: ContactContentSchema,
  skills: SkillContentSchema,
  experiences: ExperienceContentSchema,
  educations: EducationContentSchema,
  languages: LanguageContentSchema,
  references: ReferenceContentSchema,
};

// Ensure the keys are treated as a tuple of string literals
const sectionKeys = Object.keys(SectionSchemas) as [
  'personal',
  'contact',
  'skills',
  'experiences',
  'educations',
  'languages',
  'references',
];

// Define CreateSectionSchema using the keys
export const CreateSectionSchema = z.object({
  resumeId: z.string().min(1, 'Resume ID is required'),
  type: z.enum(sectionKeys),
  // We'll validate content dynamically
  content: z.unknown(),
});
