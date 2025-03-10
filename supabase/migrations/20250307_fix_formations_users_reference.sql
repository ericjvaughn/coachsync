-- Drop the existing foreign key constraint
ALTER TABLE public.formations DROP CONSTRAINT IF EXISTS formations_created_by_fkey;

-- Add the correct foreign key constraint to auth.users
ALTER TABLE public.formations 
  ADD CONSTRAINT formations_created_by_fkey 
  FOREIGN KEY (created_by) 
  REFERENCES auth.users(id) 
  ON DELETE SET NULL;
