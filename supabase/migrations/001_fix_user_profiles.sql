-- Modify user_profiles table to make fields nullable
ALTER TABLE public.user_profiles
    ALTER COLUMN age_range DROP NOT NULL,
    ALTER COLUMN location DROP NOT NULL,
    ALTER COLUMN job_field DROP NOT NULL;

-- Add onboarding_completed column to track profile completion
ALTER TABLE public.user_profiles
    ADD COLUMN IF NOT EXISTS onboarding_completed boolean DEFAULT false;

-- Update the handle_new_user() function to handle nullable fields
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email)
  VALUES (new.id, new.email);
  RETURN new;
END;
$$; 