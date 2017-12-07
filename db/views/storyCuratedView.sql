CREATE OR REPLACE VIEW storyCuratedView
AS
select story.* from storyView as story
join "curatedStory" as curated
on curated."story" = story."id"
order by curated."rating" desc;
