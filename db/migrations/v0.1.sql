CREATE TABLE "public"."hashtag" (
    "id" serial,
    "lowercaseText" text,
    "realText" text,
    PRIMARY KEY ("id"),
    UNIQUE ("realText")
);
