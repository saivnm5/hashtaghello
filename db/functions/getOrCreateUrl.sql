CREATE OR REPLACE FUNCTION getOrCreateUrl(
    storyId integer,
    slug text,
    expiresAt timestamp,
    OUT output text)
AS $$
BEGIN
	select "slug" into output from "url" where "story" = storyId and "slug" = slug;
	if output is null then
    insert into
    "url" ("story", "slug", "expiresAt")
    values (storyId, slug, expiresAt);
    output := slug;
   end if;
END; $$
LANGUAGE plpgsql;