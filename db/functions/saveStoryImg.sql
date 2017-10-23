CREATE OR REPLACE FUNCTION saveStoryImg(
    storyId integer,
    imgKeys text[],
    OUT success integer)
AS $$
DECLARE
    i integer = 0 ;
    tempOrder integer;
    tempUrl text;
BEGIN
    FOR i in array_lower(imgKeys, 1) .. array_upper(imgKeys, 1)
    LOOP
        select cast(split_part(imgKeys[i], '###', 1) as integer) into tempOrder;
        tempUrl := split_part(imgKeys[i], '###', 2);
        INSERT INTO
        part ("story", "order", "imgKey")
        VALUES (storyId, tempOrder, tempUrl);
    END LOOP;
    success := 1;
END; $$
LANGUAGE plpgsql;