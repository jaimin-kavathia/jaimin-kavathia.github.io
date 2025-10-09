// Core TypeScript interfaces for the portfolio website

export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  technologies: string[];
  category: "mobile" | "web" | "cross-platform";
  images: string[];
  githubUrl?: string;
  demoUrl?: string;
  appStoreUrl?: string;
  playStoreUrl?: string;
  featured: boolean;
  completionDate: string;
  clientType?: "personal" | "freelance" | "company";
  status?: "completed" | "in-progress" | "planned";
}

export interface Skill {
  name: string;
  category: "mobile" | "backend" | "tools" | "design";
  proficiency: number; // 0-100
  yearsOfExperience: number;
  color: string; // Tailwind gradient classes
  icon?: string;
}

export interface PersonalInfo {
  name: string;
  title: string;
  yearsOfExperience: number;
  location: string;
  email: string;
  phone?: string;
  socialLinks: {
    github: string;
    linkedin: string;
    twitter?: string;
    portfolio?: string;
    medium?: string;
  };
  bio: string;
  tagline: string;
}

export interface Achievement {
  id: string;
  title: string;
  description?: string;
  date: string;
  type: "award" | "recognition" | "milestone";
  organization?: string;
}

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  date: string;
  credentialUrl?: string;
  description?: string;
  skills?: string[];
}

export interface PackageItem {
  id: string;
  name: string;
  description: string;
  version: string;
  technologies: string[];
  githubUrl?: string;
  pubDevUrl?: string;
  blogUrl?: string;
}
