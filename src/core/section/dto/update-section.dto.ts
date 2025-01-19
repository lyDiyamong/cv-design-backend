import { z } from 'zod';

// update schemas with optional fields
const updatePersonalContentSchema = z.object({
  firstName: z
    .string()
    .min(1, 'First name is required')
    .max(50, 'Max character is 50')
    .optional(),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .max(50, 'Max character is 50')
    .optional(),
  position: z.string().max(100, 'Max character is 100').optional(),
  summary: z.string().max(450, 'Max character is 450').optional(),
});

const updateContactContentSchema = z.object({
  phone: z.string().optional(),
  email: z.string().email('Invalid email address').optional(),
  address: z.string().optional(),
});

const updateSkillContentSchema = z.array(
  z.object({
    name: z.string().min(1, 'Skill name is required').optional(),
    level: z.enum(['Expert', 'Advance', 'Intermediate', 'Beginner']).optional(),
  }),
);

const updateExperienceContentSchema = z.array(
  z
    .object({
      jobTitle: z.string().max(100, 'Max character is 100').optional(),
      company: z.string().max(100, 'Max character is 100').optional(),
      responsibility: z.string().max(250, 'Max character is 250').optional(),
      startDate: z.coerce
        .date({
          required_error: 'Please select a start date',
          invalid_type_error: "That's not a valid date!",
        })
        .optional(),
      endDate: z.coerce
        .date({
          required_error: 'Please select an end date',
          invalid_type_error: "That's not a valid date!",
        })
        .optional(),
    })
    .superRefine((data, ctx) => {
      if (data.startDate && data.endDate && data.endDate <= data.startDate) {
        ctx.addIssue({
          code: 'custom',
          path: ['endDate'],
          message: 'End date must be later than start date',
        });
      }
    }),
);

const updateEducationContentSchema = z.array(
  z
    .object({
      school: z.string().min(1, 'School name is required').optional(),
      degreeMajor: z.string().min(1, 'Degree or Major is required').optional(),
      startDate: z.coerce
        .date({
          required_error: 'Please select a start date',
          invalid_type_error: "That's not a valid date!",
        })
        .optional(),
      endDate: z.coerce
        .date({
          required_error: 'Please select an end date',
          invalid_type_error: "That's not a valid date!",
        })
        .optional(),
    })
    .superRefine((data, ctx) => {
      if (data.startDate && data.endDate && data.endDate <= data.startDate) {
        ctx.addIssue({
          code: 'custom',
          path: ['endDate'],
          message: 'End date must be later than start date',
        });
      }
    }),
);

const updateLanguageContentSchema = z.array(
  z.object({
    language: z.string().optional(),
    level: z.enum(['Fluent', 'Advance', 'Intermediate', 'Beginner']).optional(),
  }),
);

const updateReferenceContentSchema = z.array(
  z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    email: z.string().optional(),
    company: z.string().optional(),
    position: z.string().optional(),
  }),
);

// Map updated schemas to types
export const updateSectionSchemasTypes = {
  personal: updatePersonalContentSchema,
  contact: updateContactContentSchema,
  skills: updateSkillContentSchema,
  experiences: updateExperienceContentSchema,
  educations: updateEducationContentSchema,
  languages: updateLanguageContentSchema,
  references: updateReferenceContentSchema,
};

// Ensure the keys are treated as a tuple of string literals
const sectionKeys = Object.keys(updateSectionSchemasTypes) as [
  'personal',
  'contact',
  'skills',
  'experiences',
  'educations',
  'languages',
  'references',
];
// Define updateSectionSchema
export const updateSectionSchema = z.array(
  z.object({
    type: z.enum(sectionKeys),
    content: z.unknown(),
  }),
);

// Define updateSectionSchema
export const updateEachSectionSchema = z.object({
  type: z.enum(sectionKeys),
  content: z.unknown(),
});

export type UpdateEachSectionType = z.infer<typeof updateEachSectionSchema>;
