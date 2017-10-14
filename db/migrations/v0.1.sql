CREATE TABLE "public"."hashtag" (
    "id" serial,
    "lowercaseText" text,
    "realText" text,
    PRIMARY KEY ("id"),
    UNIQUE ("realText")
);

CREATE TABLE "public"."story" (
    "id" serial,
    "hashtag" integer,
    "description" text,
    "isPrivate" boolean DEFAULT 'true',
    "isPublished" boolean DEFAULT 'false',
    "shareCount" integer DEFAULT '0',
    PRIMARY KEY ("id"),
    CONSTRAINT "hashtag_id" FOREIGN KEY ("hashtag") REFERENCES "public"."hashtag"("id")
);

ALTER TABLE "public"."hashtag" ADD COLUMN "createdAt" timestamp DEFAULT now();
ALTER TABLE "public"."story" ADD COLUMN "createdAt" timestamp DEFAULT now();