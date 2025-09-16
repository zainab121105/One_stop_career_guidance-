export interface User {
  id: string;
  email: string;
  name: string;
  photoURL?: string;
  onboardingCompleted: boolean;
  createdAt: Date;
}

export interface AcademicProfile {
  level: 'high-school' | 'intermediate' | 'undergraduate' | 'postgraduate';
  stream: string;
  subjects: string[];
  marks?: number;
  gpa?: number;
  institution: string;
  yearOfStudy?: number;
}

export interface Skill {
  id: string;
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  category: 'technical' | 'soft' | 'language' | 'domain';
}

export interface CareerSuggestion {
  id: string;
  title: string;
  description: string;
  matchPercentage: number;
  requiredSkills: string[];
  averageSalary: string;
  growthPotential: 'high' | 'medium' | 'low';
  pathways: string[];
}

export interface QuizResult {
  category: string;
  score: number;
  percentile: number;
  strengths: string[];
  recommendations: string[];
}

export interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  completed: boolean;
}