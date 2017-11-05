CREATE OR REPLACE FUNCTION publishStory(
    storyId integer,
    isPrivate boolean,
    allowPayment boolean,
    slug text,
    OUT slugUrl text)
AS $$
BEGIN
    select "output" into slugUrl from getOrCreateUrl(storyId, slug);
    update "story"
    set "isPrivate" = isPrivate,
    "isPublished" = true,
    "allowPayment" = allowPayment,
    "isActive" = true
    where "id" = storyId;
END; $$
LANGUAGE plpgsql;