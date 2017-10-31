CREATE OR REPLACE VIEW storyView
AS
select
story."id",
hashtag."realText" as "hashtag",
actor."hashtag" as "createdByName",
story."createdBy",
story."description",
part."imgKey",
part."thumbnailUrl",
concat(part."soundcloudUrl", part."youtubeUrl", part."vimeoUrl") as "mediaUrl",
url."slug",
story."isPrivate",
story."allowPayment",
story."isPublished"
from story
join hashtag
on story."hashtag" = hashtag."id"
join actor
on story."createdBy" = actor."id"
left join part
on part."id" = (
    select id from part
    where part."story" = story."id"
    order by "order" asc
    limit 1
)
left join url
on url."id" = (
	select "id" from url
	where url."story" = story."id"
	order by url."id" desc
	limit 1
)
where story."isActive" = true
order by story."createdAt" desc
