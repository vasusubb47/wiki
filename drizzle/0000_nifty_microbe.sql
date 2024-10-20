CREATE TABLE IF NOT EXISTS "wiki_multi_media" (
	"media_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"page_id" uuid NOT NULL,
	"url" varchar(255),
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone,
	CONSTRAINT "wiki_multi_media_url_unique" UNIQUE("url")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "wiki_page_status" (
	"id" integer PRIMARY KEY NOT NULL,
	"desc" varchar(256),
	CONSTRAINT "wiki_page_status_desc_unique" UNIQUE("desc")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "wiki_page_voting" (
	"user_id" uuid NOT NULL,
	"page_id" uuid NOT NULL,
	"vote" integer,
	CONSTRAINT "wiki_page_voting_page_id_user_id_pk" PRIMARY KEY("page_id","user_id"),
	CONSTRAINT "wiki_page_voting_user_id_unique" UNIQUE("user_id"),
	CONSTRAINT "wiki_page_voting_page_id_unique" UNIQUE("page_id"),
	CONSTRAINT "wiki_page_voting_vote_unique" UNIQUE("vote")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "wiki_page_ranking" (
	"page_id" uuid NOT NULL,
	"up_votes" integer,
	"down_votes" integer,
	CONSTRAINT "wiki_page_ranking_page_id_unique" UNIQUE("page_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "wiki_pages" (
	"page_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"author_id" uuid NOT NULL,
	"title" varchar(255),
	"status" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone,
	CONSTRAINT "wiki_pages_title_unique" UNIQUE("title")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "wiki_user" (
	"user_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"first_name" varchar(35) NOT NULL,
	"middle_name" varchar(35),
	"last_name" varchar(35),
	"email" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"sex" varchar(7),
	"dob" date,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone,
	CONSTRAINT "wiki_user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "wiki_multi_media" ADD CONSTRAINT "wiki_multi_media_page_id_wiki_pages_page_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."wiki_pages"("page_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "wiki_page_voting" ADD CONSTRAINT "wiki_page_voting_user_id_wiki_user_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."wiki_user"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "wiki_page_voting" ADD CONSTRAINT "wiki_page_voting_page_id_wiki_pages_page_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."wiki_pages"("page_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "wiki_page_ranking" ADD CONSTRAINT "wiki_page_ranking_page_id_wiki_pages_page_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."wiki_pages"("page_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "wiki_pages" ADD CONSTRAINT "wiki_pages_author_id_wiki_user_user_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."wiki_user"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "wiki_pages" ADD CONSTRAINT "wiki_pages_status_wiki_page_status_id_fk" FOREIGN KEY ("status") REFERENCES "public"."wiki_page_status"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
