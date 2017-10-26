CREATE OR REPLACE FUNCTION createAuthToken(
  actorId integer,
  OUT authToken text)
AS $$
BEGIN
  authToken := concat(uuid_generate_v1(), '-', actorId);
  INSERT INTO
  "actorAuth" ("actor", "token")
  VALUES (actorId, authToken);
END; $$
LANGUAGE plpgsql;