CREATE OR REPLACE VIEW storyFeaturedView
AS
select story.* from storyView as story
join "curatedStory" as featured
on featured."story" = story."id"
and featured."isFeatured" = true
where story."isPrivate" = false
and story."isPublished" = true
order by featured."id" desc;
