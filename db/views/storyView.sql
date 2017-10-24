CREATE OR REPLACE VIEW storyView
AS
select
story."id",
hashtag."realText" as "hashtag",
story."description",
part."imgKey",
part."thumbnailUrl",
part."soundcloudUrl",
part."youtubeUrl",
part."vimeoUrl"
from story
join hashtag
on story."hashtag" = hashtag."id"
join part
on part."id" = (
    select id from part
    where part."story" = story."id"
    order by "order" asc
    limit 1
)
order by story."createdAt" desc