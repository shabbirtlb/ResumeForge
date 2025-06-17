import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
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
        throw new Error('Failed to save resume');
      }

      return resume.id;
    } catch (error) {
      console.error('Error saving resume:', error);
      throw error;
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
        throw new Error('Failed to update resume');
      }
    } catch (error) {
      console.error('Error updating resume:', error);
      throw error;
    }
  };

  const getSavedResumes = async (): Promise<SavedResume[]> => {
    if (!user) return [];
    
    try {
      const { data: resumes, error } = await supabase
        .from('resumes')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Error fetching resumes:', error);
        return [];
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
      return [];
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
        throw new Error('Failed to delete resume');
      }
    } catch (error) {
      console.error('Error deleting resume:', error);
      throw error;
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
        return null;
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
      return null;
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
        throw new Error('Failed to duplicate resume');
      }

      return newResume.id;
    } catch (error) {
      console.error('Error duplicating resume:', error);
      throw error;
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