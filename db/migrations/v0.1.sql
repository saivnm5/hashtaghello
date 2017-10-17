CREATE TABLE "public"."hashtag" (
    "id" serial,
    "lowercaseText" text,
    "realText" text,
    PRIMARY KEY ("id"),
    UNIQUE ("realText")
);
ALTER TABLE "public"."hashtag" ADD COLUMN "createdAt" timestamp DEFAULT now();


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
ALTER TABLE "public"."story" ADD COLUMN "createdAt" timestamp DEFAULT now();


CREATE TABLE "public"."shot" (
    "id" serial,
    "story" integer NOT NULL,
    "order" integer NOT NULL,
    "imgKey" text,
    "createdAt" timestamp DEFAULT now(),
    PRIMARY KEY ("id"),
    CONSTRAINT "story_id" FOREIGN KEY ("story") REFERENCES "public"."story"("id")
);