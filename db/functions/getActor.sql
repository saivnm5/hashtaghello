CREATE OR REPLACE FUNCTION getActor(
   authToken text,
   OUT actor integer)
AS $$
BEGIN
	actor := null;
  select id into actor from actor where "fbUserId" = authToken;
END; $$
LANGUAGE plpgsql;