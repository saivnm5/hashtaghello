CREATE OR REPLACE FUNCTION saveStoryText(
    storyId integer,
    texts text[],
    OUT success integer)
AS $$
DECLARE
    i integer = 0;
    tempOrder integer;
    tempText text;
BEGIN
    FOR i in array_lower(texts, 1) .. array_upper(texts, 1)
    LOOP
        select cast(split_part(texts[i], '###', 1) as integer) into tempOrder;
        tempText := split_part(texts[i], '###', 2);
        INSERT INTO
        part ("story", "order", "text")
        VALUES (storyId, tempOrder, tempText);
    END LOOP;
    success := 1;
END; $$
LANGUAGE plpgsql;