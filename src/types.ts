export interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  link?: string;
  image?: string;
  images?: string[];
}

export interface SkillCategory {
  id: string;
  title: string;
  icon: string;
  description: string;
  skills: string[];
}

export interface PlaygroundCode {
  html: string;
  css: string;
  js: string;
  explanation?: string;
}

export interface ExcelHeader {
  key: string;
  label: string;
  type: "string" | "number" | "formula";
  formula?: string;
}

export interface ExcelRow {
  [key: string]: any;
}

export interface ExcelMetric {
  label: string;
  value: string | number;
  excelFormula?: string;
}

export interface ExcelSheet {
  title: string;
  chartType: "bar" | "line" | "area" | "pie" | "composed";
  headers: ExcelHeader[];
  rows: ExcelRow[];
  summaryMetrics: ExcelMetric[];
}

export interface DocSectionContent {
  type: "paragraph" | "bullet-list" | "callout" | "table";
  text?: string;
  items?: string[];
}

export interface DocSection {
  heading: string;
  content: DocSectionContent[];
}

export interface WordDoc {
  title: string;
  subtitle: string;
  meta: {
    author: string;
    date: string;
    version?: string;
    classification?: string;
  };
  sections: DocSection[];
}

export interface AvatarFilters {
  brightness: number;
  contrast: number;
  saturate: number;
  grayscale: number;
  blur: number;
  sepia: number;
}

export interface PortfolioData {
  name: string;
  title: string;
  bio: string;
  avatarUrl: string;
  avatarFilters?: AvatarFilters;
  linkedinUrl: string;
  githubUrl: string;
  email: string;
  projects: Project[];
  instagramUrl?: string;
  facebookUrl?: string;
  phone?: string;
}

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  projectType: string;
  details: string;
  submittedAt: string;
  status: "unread" | "read";
}
