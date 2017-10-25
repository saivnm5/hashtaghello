CREATE OR REPLACE FUNCTION publishStory(
    storyId integer,
    isPrivate boolean,
    slug text,
    OUT slugUrl text)
AS $$
BEGIN
    select "output" into slugUrl from createUrl(storyId, slug, null);
    update "story"
    set "isPrivate" = isPrivate,
    "isPublished" = true,
    "isActive" = true
    where "id" = storyId;
END; $$
LANGUAGE plpgsql;