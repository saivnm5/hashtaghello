CREATE OR REPLACE VIEW storyFeaturedView
AS
select story.* from storyView as story
join "featuredStory" as featured
on featured."story" = story."id"
where story."isPrivate" = false
and story."isPublished" = true
order by featured."id" desc;
