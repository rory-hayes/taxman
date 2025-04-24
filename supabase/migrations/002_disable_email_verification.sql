-- Disable email verification requirement
ALTER TABLE auth.users
    ALTER COLUMN email_confirmed_at SET DEFAULT CURRENT_TIMESTAMP;

-- Update existing users to be confirmed
UPDATE auth.users
SET email_confirmed_at = CURRENT_TIMESTAMP
WHERE email_confirmed_at IS NULL; 