CREATE OR REPLACE VIEW partView
AS
select
"id",
"story",
"imgKey",
"thumbnailUrl",
concat("soundcloudUrl", "youtubeUrl", "vimeoUrl") as "mediaUrl",
"order"
from part
order by "order" asc;