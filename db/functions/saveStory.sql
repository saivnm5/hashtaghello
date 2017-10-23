CREATE OR REPLACE FUNCTION saveStory(
    storyId integer,
    imgKeys text[],
    soundcloudUrls text[],
    youtubeUrls text[],
    vimeoUrls text[],
    OUT success integer)
AS $$
DECLARE
    i integer = 0 ;
    tempOrder integer;
    tempUrl text;
    tempThumbUrl text;
BEGIN
    DELETE FROM part where "story" = storyId;
    select * from saveStoryImg(storyId, imgKeys);
    select * from saveStoryMedia(storyId, soundcloudUrls, 'soundcloud');
    select * from saveStoryMedia(storyId, youtubeUrls, 'youtube');
    select * from saveStoryMedia(storyId, vimeoUrls, 'vimeo');
    success := 1;
END; $$
LANGUAGE plpgsql;