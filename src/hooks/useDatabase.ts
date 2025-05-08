import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Profile, Contest, Idea } from '../types/database';

export function useProfile(userId: string | undefined) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    async function fetchProfile() {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (error) throw error;
        setProfile(data);
      } catch (e) {
        setError(e instanceof Error ? e : new Error('An error occurred'));
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [userId]);

  return { profile, loading, error };
}

export function useContests() {
  const [contests, setContests] = useState<Contest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchContests() {
      try {
        const { data, error } = await supabase
          .from('contests')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setContests(data);
      } catch (e) {
        setError(e instanceof Error ? e : new Error('An error occurred'));
      } finally {
        setLoading(false);
      }
    }

    fetchContests();
  }, []);

  return { contests, loading, error };
}

export function useIdeas() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchIdeas() {
      try {
        const { data, error } = await supabase
          .from('ideas')
          .select('*, profiles(name)')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setIdeas(data);
      } catch (e) {
        setError(e instanceof Error ? e : new Error('An error occurred'));
      } finally {
        setLoading(false);
      }
    }

    fetchIdeas();

    // Subscribe to changes
    const subscription = supabase
      .channel('ideas_channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'ideas' }, fetchIdeas)
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { ideas, loading, error };
}