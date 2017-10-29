CREATE OR REPLACE FUNCTION createOrUpdateStory(
    hasgtagIn varchar(30),
    descriptionIn varchar(100),
    actor integer,
    storyIn integer,
    OUT storyId integer)
AS $$
DECLARE
    hashtagFk integer;
    slug text;
BEGIN
    select hashtagid into hashtagFk from getOrCreateHashtag(hasgtagIn);
    if storyIn is null then
      insert into
      story ("hashtag", "description", "createdBy")
      values (hashtagFk, descriptionIn, actor)
      returning "id" into storyId;
    else
      update "story"
      set "hashtag" = hashtagFk,
      "description" = descriptionIn
      where "id" = storyIn;
      storyId := storyIn;
    end if;
END; $$
LANGUAGE plpgsql;