ALTER TABLE polls
  ADD COLUMN IF NOT EXISTS timezone VARCHAR(50);

UPDATE polls
SET timezone = 'Asia/Seoul'
WHERE timezone IS NULL;

ALTER TABLE polls
  ALTER COLUMN timezone SET DEFAULT 'Asia/Seoul';

ALTER TABLE polls
  ALTER COLUMN timezone SET NOT NULL;
