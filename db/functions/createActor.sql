CREATE OR REPLACE FUNCTION createActor(
    name varchar(255),
    email varchar(255),
    fbUserId text,
    OUT actor integer)
AS $$
BEGIN
    INSERT INTO
    actor ("name", "email", "fbUserId")
    VALUES (name, email, fbUserId);
    select id into actor from actor where "fbUserId" = fbUserId;
END; $$
LANGUAGE plpgsql;