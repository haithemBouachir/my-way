export type Skill = {
  id: number;
  name: string;
  category: string;
  level: number;
};

export type LanguageEntry = {
  id: number;
  name: string;
  level: string;
};

export type LinkedProject = {
  id: number;
  title: string;
};

export type WorkExperience = {
  id: number;
  position: string;
  company: string;
  startDate: string | null;
  endDate: string | null;
  description: string;
  projects: LinkedProject[];
};

export type Project = {
  id: number;
  title: string;
  description: string;
  startDate: string | null;
  endDate: string | null;
  technologies: string;
  projectUrl: string;
};

export type Formation = {
  id: number;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string | null;
  endDate: string | null;
  description: string;
};

export type UserProfile = {
  id: number;
  fullName: string;
  email: string;
  avatarUrl: string | null;
  phone: string | null;
  address: string | null;
  postalCode: string | null;
  city: string | null;
  description: string | null;
  token: string | null;
};

export type CvBlock = {
  id: string;
  title: string;
  content: string;
  visible: boolean;
};

export type CvDocument = {
  id: number;
  title: string;
  template: string;
  blocksJson: string;
  createdAt: string;
  updatedAt: string;
};

export type Training = {
  id: number;
  title: string;
  provider: string;
  url: string;
  skillCategory: string;
  difficulty: string;
};

export type JobSuggestion = {
  title: string;
  company: string;
  location: string;
  contractType: string;
  url: string;
  source: string;
};
