export type ContentType = {
  personal: PersonalType;
  contact: ContactType;
  skills: SkillType[];
  experiences: ExperienceType[];
  educations: EducationType[];
  languages: LanguageType[];
  references: ReferenceType[];
};

export type PersonalType = {
  firstName: string;
  lastName: string;
  imgUrl: string;
  position: string;
  summary: string;
};

export type ContactType = {
  phone: string;
  email: string;
  address: string;
};

export type SkillType = {
  name: string;
  level: 'Expert' | 'Advance' | 'Intermediate' | 'Beginner';
};

export type ExperienceType = {
  jobTitle: string;
  position: string;
  startDate: Date;
  endDate: Date;
};

export type EducationType = {
  school: string;
  degreeMajor: string;
  startDate: Date;
  endDate: Date;
};

export type LanguageType = {
  language: string;
  level: 'Fluent' | 'Advance' | 'Intermediate' | 'Beginner';
};

export type ReferenceType = {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  position: string;
};
