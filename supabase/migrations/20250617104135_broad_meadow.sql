/*
  # Fix user registration database error

  1. Database Functions
    - Ensure the handle_new_user trigger function exists and works correctly
    - Create or update the function to properly handle new user profile creation

  2. Triggers
    - Ensure the trigger is properly set up on auth.users table
    - The trigger should automatically create a profile when a new user signs up

  3. Security
    - Verify RLS policies allow profile creation during registration
    - Add policy to allow service role to insert profiles during registration

  4. Notes
    - This fixes the "Database error saving new user" issue
    - Ensures profiles are automatically created when users register
*/

-- Create or replace the handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, created_at, updated_at)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', ''),
    now(),
    now()
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists and recreate it
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create the trigger on auth.users table
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Add a policy to allow the service role to insert profiles during registration
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'profiles' 
    AND policyname = 'Service role can insert profiles'
  ) THEN
    CREATE POLICY "Service role can insert profiles"
      ON profiles
      FOR INSERT
      TO service_role
      WITH CHECK (true);
  END IF;
END $$;

-- Ensure the update_updated_at_column function exists
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;