CREATE OR REPLACE FUNCTION saveStory(
    storyId integer,
    partImgKeys text[],
    OUT success integer)
AS $$
DECLARE
    i integer = 0 ;
BEGIN
    DELETE FROM part where "story" = storyId;
    FOR i in array_lower(partImgKeys, 1) .. array_upper(partImgKeys, 1)
    LOOP
        INSERT INTO
        part ("story", "order", "imgKey")
        VALUES (storyId, i-1, partImgKeys[i]);
    END LOOP;
    success := 1;
END; $$
LANGUAGE plpgsql;