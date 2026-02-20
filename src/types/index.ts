export interface Article {
  id: string;
  headline: string;
  angle: string;
  body: string;
  category: string;
  opinion_type: string | null;
  image_url: string | null;
  created_at: string;
  run_type: string;
}

export interface Comic {
  id: string;
  image_url: string;
  caption: string | null;
  created_at: string;
}

export interface Submission {
  id: string;
  name: string | null;
  email: string | null;
  body: string;
  created_at: string;
  used: boolean;
}

export type Category = 'All' | 'World' | 'National' | 'Entertainment' | 'Sports' | 'Lifestyle' | 'Opinion';
export type OpinionType = 'dear_gabby' | 'dear_guy' | 'guys_world';
