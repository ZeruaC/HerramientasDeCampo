-- Replace the client-generated proposal_number (date + last-3-digits-of-
-- timestamp, which collided in practice — only 1000 possible suffixes per
-- day) with a real, DB-side sequential counter. A Postgres sequence
-- guarantees atomicity: two concurrent inserts can never get the same
-- number, no retry logic needed in the app.
CREATE SEQUENCE IF NOT EXISTS public.proposal_number_seq START WITH 1027 INCREMENT BY 1;

ALTER TABLE public.proposals
  ALTER COLUMN proposal_number SET DEFAULT ('OF-' || nextval('public.proposal_number_seq'));
