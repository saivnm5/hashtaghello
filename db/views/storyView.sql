CREATE OR REPLACE VIEW storyView
AS
select
story."id",
hashtag."realText" as "hashtag",
actor."name" as creator,
story."description",
part."imgKey",
part."thumbnailUrl",
concat(part."soundcloudUrl", part."youtubeUrl", part."vimeoUrl") as "mediaUrl"
from story
join hashtag
on story."hashtag" = hashtag."id"
join actor
on story."createdBy" = actor."id"
join part
on part."id" = (
    select id from part
    where part."story" = story."id"
    order by "order" asc
    limit 1
)
order by story."createdAt" desc