CREATE OR REPLACE FUNCTION getOrCreateActor(
  name varchar(255),
  email varchar(255),
  fbUserId text,
  googleUserId text,
  hashtag text,
  OUT accessToken text)
AS $$
DECLARE
  actor integer;
BEGIN
	select id into actor from actor where "fbUserId" = fbUserId;
  if actor is null then
    select id into actor from actor where "googleUserId" = googleUserId;
  end if;
	if actor is null then
    INSERT INTO
    actor ("name", "email", "fbUserId", "googleUserId", "hashtag")
    VALUES (name, email, fbUserId, googleUserId, hashtag);
    select id into actor from actor where "fbUserId" = fbUserId;
  end if;
  select "authtoken" into accessToken from createAuthToken(actor);
END; $$
LANGUAGE plpgsql;