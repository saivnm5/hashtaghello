CREATE OR REPLACE FUNCTION createUrl(
    storyId integer,
    slug text,
    expiresAt timestamp,
    OUT output text)
AS $$
BEGIN
    insert into
    "url" ("story", "slug", "expiresAt")
    values (storyId, slug, expiresAt);
    output := slug;
END; $$
LANGUAGE plpgsql;