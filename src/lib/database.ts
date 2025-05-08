import { supabase } from './supabase';
import type { Profile, Contest, Idea } from '../types/database';

// Profiles
export async function getProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching profile:', error);
    return null;
  }

  return data;
}

export async function updateProfile(userId: string, updates: Partial<Profile>) {
  const { error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId);

  if (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
}

// Contests
export async function getContests(): Promise<Contest[]> {
  const { data, error } = await supabase
    .from('contests')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching contests:', error);
    return [];
  }

  return data;
}

export async function getContest(id: string): Promise<Contest | null> {
  const { data, error } = await supabase
    .from('contests')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching contest:', error);
    return null;
  }

  return data;
}

// Ideas
export async function getIdeas(): Promise<Idea[]> {
  const { data, error } = await supabase
    .from('ideas')
    .select('*, profiles(name)')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching ideas:', error);
    return [];
  }

  return data;
}

export async function createIdea(idea: Omit<Idea, 'id' | 'created_at' | 'updated_at' | 'likes_count' | 'comments_count'>) {
  const { error } = await supabase
    .from('ideas')
    .insert(idea);

  if (error) {
    console.error('Error creating idea:', error);
    throw error;
  }
}

export async function updateIdea(id: string, updates: Partial<Idea>) {
  const { error } = await supabase
    .from('ideas')
    .update(updates)
    .eq('id', id);

  if (error) {
    console.error('Error updating idea:', error);
    throw error;
  }
}

export async function likeIdea(id: string) {
  const { error } = await supabase.rpc('increment_likes', { idea_id: id });

  if (error) {
    console.error('Error liking idea:', error);
    throw error;
  }
}