CREATE OR REPLACE FUNCTION saveStory(
    storyId integer,
    imgKeys text[] default null,
    soundcloudUrls text[] default null,
    youtubeUrls text[] default null,
    vimeoUrls text[] default null,
    OUT output integer)
AS $$
DECLARE
    i integer = 0 ;
    tempOrder integer;
    tempUrl text;
    tempThumbUrl text;
BEGIN
    DELETE FROM part where "story" = storyId;
    if imgKeys is not null then
        select "success" into output from saveStoryImg(storyId, imgKeys);
    end if;
    if soundcloudUrls is not null then
        select "success" into output from saveStoryMedia(storyId, soundcloudUrls, 'soundcloud');
    end if;
    if youtubeUrls is not null then
        select "success" into output from saveStoryMedia(storyId, youtubeUrls, 'youtube');
    end if;
    if vimeoUrls is not null then
        select "success" into output from saveStoryMedia(storyId, vimeoUrls, 'vimeo');
    end if;
END; $$
LANGUAGE plpgsql;