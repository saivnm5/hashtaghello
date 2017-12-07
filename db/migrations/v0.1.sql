CREATE TABLE "public"."hashtag" (
    "id" serial,
    "lowercaseText" text,
    "realText" text,
    PRIMARY KEY ("id"),
    UNIQUE ("realText")
);
ALTER TABLE "public"."hashtag" ADD COLUMN "createdAt" timestamp DEFAULT now();


CREATE TABLE "public"."actor" (
    "id" serial,
    "name" varchar(255) NOT NULL,
    "email" varchar(255),
    "fbUserId" text,
    "isActive" boolean DEFAULT 'TRUE',
    "createdAt" timestamp DEFAULT now(),
    PRIMARY KEY ("id")
);
ALTER TABLE "public"."actor"
  ADD UNIQUE ("email"),
  ADD UNIQUE ("fbUserId");
ALTER TABLE "public"."actor" ADD COLUMN "hashtag" text NOT NULL;
ALTER TABLE "public"."actor"
  ADD COLUMN "googleUserId" text,
  ADD UNIQUE ("googleUserId");



CREATE TABLE "public"."actorAuth" (
    "id" serial,
    "actor" integer,
    "token" text NOT NULL,
    PRIMARY KEY ("id"),
    CONSTRAINT "actor_auth_id" FOREIGN KEY ("actor") REFERENCES "public"."actor"("id")
);
CREATE EXTENSION "uuid-ossp";
ALTER TABLE "public"."actorAuth" ADD COLUMN "createdAt" timestamp DEFAULT now();


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
ALTER TABLE "public"."story"
  ADD COLUMN "createdBy" integer,
  ADD CONSTRAINT "story_created_by_id" FOREIGN KEY ("createdBy") REFERENCES "public"."actor"("id");
ALTER TABLE "public"."story" ADD COLUMN "isActive" boolean DEFAULT true;
ALTER TABLE "public"."story" ADD COLUMN "allowPayment" boolean DEFAULT true;


CREATE TABLE "public"."shot" (
    "id" serial,
    "story" integer NOT NULL,
    "order" integer NOT NULL,
    "imgKey" text,
    "createdAt" timestamp DEFAULT now(),
    PRIMARY KEY ("id"),
    CONSTRAINT "story_id" FOREIGN KEY ("story") REFERENCES "public"."story"("id")
);
ALTER TABLE "public"."shot" RENAME TO "part";
ALTER TABLE "public"."part"
  ADD COLUMN "soundcloudUrl" text,
  ADD COLUMN "youtubeUrl" text,
  ADD COLUMN "vimeoUrl" text,
  ADD COLUMN "thumbnailUrl" text;
ALTER TABLE "public"."part" ADD COLUMN "text" text;



CREATE TABLE "public"."url" (
    "id" serial,
    "slug" text NOT NULL,
    "expiresAt" timestamp,
    "story" integer,
    PRIMARY KEY ("id"),
    CONSTRAINT "story_url_id" FOREIGN KEY ("story") REFERENCES "public"."story"("id")
);
ALTER TABLE "public"."url" ADD COLUMN "createdAt" timestamp DEFAULT now();
ALTER TABLE "public"."url" DROP COLUMN "expiresAt";


CREATE TABLE "public"."featuredStory" (
    "id" serial,
    "story" integer,
    "createdAt" text DEFAULT now(),
    PRIMARY KEY ("id"),
    CONSTRAINT "story_featured_id" FOREIGN KEY ("story") REFERENCES "public"."story"("id")
);
ALTER TABLE "public"."featuredStory" RENAME TO "curatedStory";
ALTER TABLE "public"."curatedStory" ADD COLUMN "rating" integer;

CREATE TABLE "public"."payment" (
    "id" serial,
    "story" integer,
    "amount" numeric(12,2),
    "buyerName" text,
    "instamojoRequestId" text,
    "isSuccessful" boolean DEFAULT 'false',
    "createdAt" timestamp DEFAULT now(),
    PRIMARY KEY ("id"),
    CONSTRAINT "story_payment_id" FOREIGN KEY ("story") REFERENCES "public"."story"("id")
);

