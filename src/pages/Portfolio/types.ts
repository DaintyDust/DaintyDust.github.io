export interface ProjectLanguage {
  name: string;
  badgeUrl?: string;
  color?: string;
}

export interface ProjectImageCompare {
  type: "compare";
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
}

export type ProjectMediaItem = string | ProjectImageCompare;

export interface ProjectItem {
  id: string;
  title: string;
  date: string;
  description: string;
  image?: string;
  images?: ProjectMediaItem[];
  githubUrl?: string;
  externalUrl?: string;
  externalUrlLabel?: string;
  languages?: ProjectLanguage[];
  initialPosition?: { top?: number; left?: number; right?: number; bottom?: number };
}
