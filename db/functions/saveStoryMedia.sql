CREATE OR REPLACE FUNCTION saveStoryMedia(
    storyId integer,
    mediaUrls text[],
    mediaSource text,
    OUT success integer)
AS $$
DECLARE
    i integer = 0 ;
    tempOrder integer;
    tempUrl text;
    tempThumbUrl text;
BEGIN
    FOR i in array_lower(mediaUrls, 1) .. array_upper(mediaUrls, 1)
    LOOP
        select cast(split_part(mediaUrls[i], '###', 1) as integer) into tempOrder;
        tempUrl := split_part(mediaUrls[i], '###', 2);
        tempThumbUrl := split_part(mediaUrls[i], '###', 3);
        if mediaSource = 'soundcloud' then
            INSERT INTO
            part ("story", "order", "soundcloudUrl", "thumbnailUrl")
            VALUES (storyId, tempOrder, tempUrl, tempThumbUrl);
        elsif mediaSource = 'youtube' then
            INSERT INTO
            part ("story", "order", "youtubeUrl", "thumbnailUrl")
            VALUES (storyId, tempOrder, tempUrl, tempThumbUrl);
        elsif mediaSource = 'vimeo' then
            INSERT INTO
            part ("story", "order", "vimeoUrl", "thumbnailUrl")
            VALUES (storyId, tempOrder, tempUrl, tempThumbUrl);
        end if;
    END LOOP;
    success := 1;
END; $$
LANGUAGE plpgsql;