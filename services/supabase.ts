
import { createClient } from '@supabase/supabase-js';
import { RSVPData } from '../types';

// These environment variables are expected to be available in the deployment context
const supabaseUrl = (window as any).process?.env?.SUPABASE_URL || '';
const supabaseAnonKey = (window as any).process?.env?.SUPABASE_ANON_KEY || '';

// If keys aren't provided, we'll mock the database for preview purposes
const isMock = !supabaseUrl || !supabaseAnonKey;

export const supabase = !isMock ? createClient(supabaseUrl, supabaseAnonKey) : null;

export const submitRSVP = async (data: RSVPData) => {
  if (isMock) {
    console.log('Mock Supabase Submission:', data);
    
    // Persist to local storage for demo purposes
    const existing = JSON.parse(localStorage.getItem('mock_rsvps') || '[]');
    const newEntry = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      created_at: new Date().toISOString()
    };
    existing.push(newEntry);
    localStorage.setItem('mock_rsvps', JSON.stringify(existing));

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    return { data: [newEntry], error: null };
  }
  
  const { data: result, error } = await supabase!
    .from('rsvp_entries')
    .insert([data])
    .select();
    
  return { data: result, error };
};

export const fetchAllRSVPs = async (): Promise<RSVPData[]> => {
  if (isMock) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return JSON.parse(localStorage.getItem('mock_rsvps') || '[]');
  }
  
  const { data, error } = await supabase!
    .from('rsvp_entries')
    .select('*')
    .order('created_at', { ascending: false });
    
  if (error) throw error;
  return data || [];
};
