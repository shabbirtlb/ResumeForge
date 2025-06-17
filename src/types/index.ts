export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  website?: string;
  linkedin?: string;
  github?: string;
  summary: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  achievements: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  honors?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  liveUrl?: string;
  githubUrl?: string;
  imageUrl?: string;
}

export interface Skill {
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  category: 'Technical' | 'Soft' | 'Language' | 'Tool';
}

export interface SectionOrder {
  resume: string[];
  portfolio: string[];
}

export interface FontSettings {
  mainHeader: string;
  sectionHeaders: string;
  subHeaders: string;
  bodyText: string;
  contactInfo: string;
  dates: string;
}

export interface ColorSettings {
  // Text Colors
  mainHeaderText: string;
  sectionHeaderText: string;
  subHeaderText: string;
  bodyText: string;
  contactText: string;
  dateText: string;
  linkText: string;
  
  // Background Colors
  pageBackground: string;
  headerBackground: string;
  sectionBackground: string;
  cardBackground: string;
  alternateBackground: string;
  
  // Accent & Border Colors
  primaryAccent: string;
  secondaryAccent: string;
  borderColor: string;
  dividerColor: string;
  shadowColor: string;
  
  // Interactive Colors
  hoverColor: string;
  activeColor: string;
}

export interface GradientSettings {
  type: 'linear' | 'radial' | 'solid';
  direction: string; // For linear: '45deg', '90deg', etc. For radial: 'circle', 'ellipse'
  startColor: string;
  endColor: string;
  midColor?: string; // Optional middle color for 3-color gradients
  opacity: number; // 0-1 for transparency
}

export interface PortfolioColorSettings extends ColorSettings {
  // Portfolio-specific colors
  heroBackground: string;
  heroGradient: GradientSettings;
  heroOverlay: string;
  navigationBackground: string;
  footerBackground: string;
  projectCardBackground: string;
  skillTagBackground: string;
  timelineAccent: string;
}

export interface CustomizationSettings {
  resume: {
    fonts: FontSettings;
    colors: ColorSettings;
    spacing: {
      sectionSpacing: string;
      paragraphSpacing: string;
      lineHeight: string;
    };
    borders: {
      sectionBorderWidth: string;
      dividerStyle: 'solid' | 'dashed' | 'dotted';
      borderRadius: string;
    };
  };
  portfolio: {
    fonts: FontSettings;
    colors: PortfolioColorSettings;
    spacing: {
      sectionSpacing: string;
      paragraphSpacing: string;
      lineHeight: string;
    };
    borders: {
      sectionBorderWidth: string;
      dividerStyle: 'solid' | 'dashed' | 'dotted';
      borderRadius: string;
    };
    layout: {
      heroHeight: string;
      cardShadow: string;
      animationSpeed: string;
    };
  };
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  experience: Experience[];
  education: Education[];
  projects: Project[];
  skills: Skill[];
  sectionOrder: SectionOrder;
  customization: CustomizationSettings;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  preview: string;
  category: 'Modern' | 'Classic' | 'Creative' | 'Minimal';
}

export type FormStep = 'personal' | 'experience' | 'education' | 'projects' | 'skills' | 'order' | 'customization' | 'preview';

// New Auth and Dashboard Types
export interface User {
  id: string;
  email: string;
  fullName: string;
  createdAt: string;
  lastLogin: string;
}

export interface SavedResume {
  id: string;
  userId: string;
  title: string;
  data: ResumeData;
  createdAt: string;
  updatedAt: string;
  isTemplate: boolean;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export type AuthAction = 
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGIN_FAILURE' }
  | { type: 'LOGOUT' }
  | { type: 'REGISTER_START' }
  | { type: 'REGISTER_SUCCESS'; payload: User }
  | { type: 'REGISTER_FAILURE' };