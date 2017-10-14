CREATE OR REPLACE FUNCTION getOrCreateHashtag(
    hashT varchar(30),
    OUT hashtagId integer)
AS $$
BEGIN
    select id into hashtagId from hashtag where "realText" = hashT;
    if hashtagId is null then
        insert into hashtag ("realText", "lowercaseText") values (hashT, lower(hashT)) returning id into hashtagId;
    end if;
END; $$
LANGUAGE plpgsql;