CREATE OR REPLACE VIEW storyPublicView
AS
select story.* from storyView as story
where story."isPrivate" = false
and story."isPublished" = true
and story."id" not in (
	select story from "curatedStory"
	where "isCensored" = true
	or "isFeatured" = true
)
order by story."id" desc;