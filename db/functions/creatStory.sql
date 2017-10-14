CREATE OR REPLACE FUNCTION createStory(
    hashT varchar(30),
    description varchar(100),
    OUT storyId integer)
AS $$
DECLARE
    hashtagFk integer;
BEGIN
    select hashtagid into hashtagFk from getOrCreateHashtag(hashT);
    insert into story ("hashtag", "description") values (hashtagFk, description) returning id into storyId;
END; $$
LANGUAGE plpgsql;