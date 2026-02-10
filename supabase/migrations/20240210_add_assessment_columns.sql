-- Add quiz_data and assignment_data columns to lessons table
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS quiz_data JSONB;
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS assignment_data JSONB;

-- Add quiz_answers, assignment_submission, and score columns to progress table
ALTER TABLE progress ADD COLUMN IF NOT EXISTS quiz_answers JSONB; -- Store as array of selected indices
ALTER TABLE progress ADD COLUMN IF NOT EXISTS assignment_submission TEXT;
ALTER TABLE progress ADD COLUMN IF NOT EXISTS score INTEGER;

-- Update the check constraint for lesson types to include 'quiz' and 'assignment' if it exists
-- Note: This depends on how the type constraint was set up. 
-- Common pattern is a check constraint or an enum.
-- If it's a check constraint:
ALTER TABLE lessons DROP CONSTRAINT IF EXISTS lessons_type_check;
ALTER TABLE lessons ADD CONSTRAINT lessons_type_check CHECK (type IN ('video', 'reading', 'youtube', 'quiz', 'assignment'));
