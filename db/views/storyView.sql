CREATE OR REPLACE VIEW storyView
AS
select
story."id",
hashtag."realText" as "hashtag",
story."description",
shot."imgKey"
from story
join hashtag
on story."hashtag" = hashtag."id"
join shot
on shot.id = (
    select id from shot
    where shot."story" = story."id"
    order by "order" asc
    limit 1
)