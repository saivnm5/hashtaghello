CREATE OR REPLACE FUNCTION getActor(
   authToken text,
   OUT actorId integer)
AS $$
BEGIN
	actorId := null;
  select "actor" into actorId from "actorAuth" where "token" = authToken;
END; $$
LANGUAGE plpgsql;