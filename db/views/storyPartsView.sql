CREATE OR REPLACE VIEW storyPartsView
AS
select * from storyView
join part on
part."story" = storyView."id"
