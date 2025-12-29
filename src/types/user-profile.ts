
export type EducationEntry = {
  id: string; // A unique ID for each entry, useful for React keys
  degree: string;
  institution: string;
  dates: string;
};

export type UserProfile = {
  id: string;
  name: string;
  role: string;
  introduction: string;
  profilePicture?: string;
  education?: EducationEntry[]; // Changed from string to array of objects
  passions?: string;
  githubLink?: string;
  linkedinLink?: string;
  twitterLink?: string;
  instagramLink?: string;
  cvLink?: string;
  createdAt?: any;
  updatedAt?: any;
};
