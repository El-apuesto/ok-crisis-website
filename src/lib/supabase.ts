import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseKey);

export type Article = {
  id: string;
  headline: string;
  angle: string;
  body: string;
  category: string;
  opinion_type: string | null;
  image_url: string | null;
  created_at: string;
  run_type: string;
};

export type Comic = {
  id: string;
  image_url: string;
  caption: string | null;
  created_at: string;
};

export type Submission = {
  id: string;
  name: string | null;
  email: string | null;
  body: string;
  created_at: string;
  used: boolean;
};

// Fetch articles with optional filters
export async function fetchArticles(options: {
  category?: string;
  opinionType?: string;
  limit?: number;
  offset?: number;
  search?: string;
} = {}) {
  const { category, opinionType, limit = 20, offset = 0, search } = options;
  
  let query = supabase
    .from('articles')
    .select('*')
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);
  
  if (category && category !== 'All') {
    query = query.eq('category', category);
  }
  
  if (opinionType) {
    query = query.eq('opinion_type', opinionType);
  }
  
  if (search) {
    query = query.or(`headline.ilike.%${search}%,body.ilike.%${search}%`);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error('Error fetching articles:', error);
    return [];
  }
  
  return data as Article[];
}

// Fetch single article
export async function fetchArticle(id: string) {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error('Error fetching article:', error);
    return null;
  }
  
  return data as Article;
}

// Fetch related articles
export async function fetchRelatedArticles(category: string, excludeId: string, limit = 5) {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('category', category)
    .neq('id', excludeId)
    .order('created_at', { ascending: false })
    .limit(limit);
  
  if (error) {
    console.error('Error fetching related articles:', error);
    return [];
  }
  
  return data as Article[];
}

// Fetch comics
export async function fetchComics() {
  const { data, error } = await supabase
    .from('comics')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching comics:', error);
    return [];
  }
  
  return data as Comic[];
}

// Submit opinion
export async function submitOpinion(submission: { name?: string; email?: string; body: string }) {
  const { data, error } = await supabase
    .from('submissions')
    .insert([{
      name: submission.name || null,
      email: submission.email || null,
      body: submission.body,
      used: false
    }]);
  
  if (error) {
    console.error('Error submitting opinion:', error);
    return { success: false, error: error.message };
  }
  
  return { success: true };
}
