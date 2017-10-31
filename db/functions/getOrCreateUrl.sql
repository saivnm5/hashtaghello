CREATE OR REPLACE FUNCTION getOrCreateUrl(
    storyId integer,
    slugT text,
    expiresAt timestamp,
    OUT output text)
AS $$
BEGIN
	select "slug" into output from "url" where "story" = storyId and "slug" = slugT;
	if output is null then
        insert into
        "url" ("story", "slug", "expiresAt")
        values (storyId, slugT, expiresAt);
        output := slugT;
    end if;
END; $$
LANGUAGE plpgsql;