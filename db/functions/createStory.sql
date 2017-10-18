CREATE OR REPLACE FUNCTION createStory(
    hashT varchar(30),
    description varchar(100),
    actor integer,
    OUT storyId integer)
AS $$
DECLARE
    hashtagFk integer;
BEGIN
    select hashtagid into hashtagFk from getOrCreateHashtag(hashT);
    insert into
   	story ("hashtag", "description", "createdBy")
   	values (hashtagFk, description, actor)
   	returning id into storyId;
END; $$
LANGUAGE plpgsql;