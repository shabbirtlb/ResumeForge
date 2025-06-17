import { useAuth } from '../contexts/AuthContext';
import { supabase, testSupabaseConnection } from '../lib/supabase';
import type { ResumeData, SavedResume } from '../types';

export const useResumeStorage = () => {
  const { user } = useAuth();

  const saveResume = async (title: string, data: ResumeData, isTemplate: boolean = false): Promise<string> => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { data: resume, error } = await supabase
        .from('resumes')
        .insert({
          user_id: user.id,
          title,
          data,
          is_template: isTemplate,
        })
        .select()
        .single();

      if (error) {
        console.error('Error saving resume:', error);
        throw new Error(`Failed to save resume: ${error.message}`);
      }

      return resume.id;
    } catch (error) {
      console.error('Error saving resume:', error);
      if (error instanceof Error) {
        throw new Error(`Failed to save resume: ${error.message}`);
      }
      throw new Error('Failed to save resume: Unknown error');
    }
  };

  const updateResume = async (id: string, title: string, data: ResumeData): Promise<void> => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { error } = await supabase
        .from('resumes')
        .update({
          title,
          data,
        })
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error updating resume:', error);
        throw new Error(`Failed to update resume: ${error.message}`);
      }
    } catch (error) {
      console.error('Error updating resume:', error);
      if (error instanceof Error) {
        throw new Error(`Failed to update resume: ${error.message}`);
      }
      throw new Error('Failed to update resume: Unknown error');
    }
  };

  const getSavedResumes = async (): Promise<SavedResume[]> => {
    if (!user) return [];
    
    try {
      // Test Supabase connection first
      const connectionOk = await testSupabaseConnection();
      if (!connectionOk) {
        throw new Error('Unable to connect to the database. Please verify your Supabase configuration and internet connection.');
      }

      const { data: resumes, error } = await supabase
        .from('resumes')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Error fetching resumes:', error);
        throw new Error(`Failed to fetch resumes: ${error.message}`);
      }

      return resumes.map(resume => ({
        id: resume.id,
        userId: resume.user_id,
        title: resume.title,
        data: resume.data,
        isTemplate: resume.is_template,
        createdAt: resume.created_at,
        updatedAt: resume.updated_at,
      }));
    } catch (error) {
      console.error('Error fetching resumes:', error);
      if (error instanceof Error) {
        // Check if it's a network error
        if (error.message.includes('Failed to fetch') || error.name === 'TypeError') {
          throw new Error('Network error: Unable to connect to the database. Please check your Supabase configuration and internet connection.');
        }
        throw error;
      }
      throw new Error('Failed to fetch resumes: Unknown error');
    }
  };

  const deleteResume = async (id: string): Promise<void> => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { error } = await supabase
        .from('resumes')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error deleting resume:', error);
        throw new Error(`Failed to delete resume: ${error.message}`);
      }
    } catch (error) {
      console.error('Error deleting resume:', error);
      if (error instanceof Error) {
        throw new Error(`Failed to delete resume: ${error.message}`);
      }
      throw new Error('Failed to delete resume: Unknown error');
    }
  };

  const getResume = async (id: string): Promise<SavedResume | null> => {
    if (!user) return null;

    try {
      const { data: resume, error } = await supabase
        .from('resumes')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error fetching resume:', error);
        if (error.code === 'PGRST116') {
          return null; // Resume not found
        }
        throw new Error(`Failed to fetch resume: ${error.message}`);
      }

      return {
        id: resume.id,
        userId: resume.user_id,
        title: resume.title,
        data: resume.data,
        isTemplate: resume.is_template,
        createdAt: resume.created_at,
        updatedAt: resume.updated_at,
      };
    } catch (error) {
      console.error('Error fetching resume:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to fetch resume: Unknown error');
    }
  };

  const duplicateResume = async (resume: SavedResume): Promise<string> => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { data: newResume, error } = await supabase
        .from('resumes')
        .insert({
          user_id: user.id,
          title: `${resume.title} (Copy)`,
          data: resume.data,
          is_template: false,
        })
        .select()
        .single();

      if (error) {
        console.error('Error duplicating resume:', error);
        throw new Error(`Failed to duplicate resume: ${error.message}`);
      }

      return newResume.id;
    } catch (error) {
      console.error('Error duplicating resume:', error);
      if (error instanceof Error) {
        throw new Error(`Failed to duplicate resume: ${error.message}`);
      }
      throw new Error('Failed to duplicate resume: Unknown error');
    }
  };

  return {
    saveResume,
    updateResume,
    getSavedResumes,
    deleteResume,
    getResume,
    duplicateResume,
  };
};