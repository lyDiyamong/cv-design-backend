import { z } from 'zod';

// Define Zod schemas for each type
const personalContentSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  position: z.string().min(1, 'Position is required'),
  summary: z
    .string()
    .min(1, 'Summary is required')
    .max(450, 'Max character is 450')
    .optional(),
});

const contactContentSchema = z.object({
  phone: z.string().min(1, 'Phone number is required'),
  email: z.string().email('Invalid email address'),
  address: z.string().min(1, 'Address is required'),
});

const skillContentSchema = z.array(
  z.object({
    name: z.string().min(1, 'Skill name is required'),
    level: z.enum(['Expert', 'Advance', 'Intermediate', 'Beginner']),
  }),
);

const experienceContentSchema = z.array(
  z
    .object({
      jobTitle: z.string().min(1, 'Job title is required'),
      responsibilities: z.array(
        z.string().max(200, 'Max character is 200').optional(),
      ),
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

const educationContentSchema = z.array(
  z
    .object({
      school: z.string().min(1, 'School name is required').optional(),
      degreeMajor: z.string().min(1, 'Degree or Major is required').optional(),
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

const languageContentSchema = z.array(
  z.object({
    language: z.string().optional(),
    level: z.enum(['Fluent', 'Advance', 'Intermediate', 'Beginner']),
  }),
);

const referenceContentSchema = z.array(
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
  personal: personalContentSchema,
  contact: contactContentSchema,
  skills: skillContentSchema,
  experiences: experienceContentSchema,
  educations: educationContentSchema,
  languages: languageContentSchema,
  references: referenceContentSchema,
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
export const createSectionSchema = z.array(
  z.object({
    resumeId: z.string().min(1, 'Resume ID is required'),
    type: z.enum(sectionKeys),
    // We'll validate content dynamically
    content: z.unknown(),
  }),
);
