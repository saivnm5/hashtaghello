CREATE OR REPLACE FUNCTION saveStory(
    storyId integer,
    shotImgKeys text[],
    OUT success integer)
AS $$
DECLARE
    i integer = 0 ;
BEGIN
    DELETE FROM shot where "story" = storyId;
    FOR i in array_lower(shotImgKeys, 1) .. array_upper(shotImgKeys, 1)
    LOOP
        INSERT INTO
        shot ("story", "order", "imgKey")
        VALUES (storyId, i-1, shotImgKeys[i]);
    END LOOP;
    success := 1;
END; $$
LANGUAGE plpgsql;