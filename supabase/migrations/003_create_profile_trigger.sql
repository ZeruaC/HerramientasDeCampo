-- Auto-create a public.profiles row whenever a new user signs up (or is
-- created directly in the Supabase dashboard). Without this, INSERT INTO
-- proposals fails with a foreign key violation on proposals_user_id_fkey,
-- since proposals.user_id references profiles.id, not auth.users.id
-- directly.
--
-- Applied directly to project sqmhkswgfbvfwxcdkcmi on 2026-07-26. This
-- migration file was previously missing / never actually applied — all
-- existing users at the time had no profiles row and could not save
-- proposals. Backfilled those rows as part of the same fix.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Backfill profiles for existing users who signed up before this trigger
-- existed.
INSERT INTO public.profiles (id, email)
SELECT u.id, u.email
FROM auth.users u
LEFT JOIN public.profiles p ON p.id = u.id
WHERE p.id IS NULL
ON CONFLICT (id) DO NOTHING;
