CREATE OR REPLACE FUNCTION getActor(
   authToken text,
   OUT actorId integer,
   OUT currentHashtag text)
AS $$
BEGIN
	actorId := null;
  select "actor".id, "actor"."hashtag"
  into actorId, currentHashtag
  from "actorAuth"
	join actor on
	"actor"."id" = "actorAuth"."actor"
	where "actorAuth" ."token" = authToken;
END; $$
LANGUAGE plpgsql;