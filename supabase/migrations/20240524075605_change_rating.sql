revoke delete on table "public"."profile_rating" from "anon";

revoke insert on table "public"."profile_rating" from "anon";

revoke references on table "public"."profile_rating" from "anon";

revoke select on table "public"."profile_rating" from "anon";

revoke trigger on table "public"."profile_rating" from "anon";

revoke truncate on table "public"."profile_rating" from "anon";

revoke update on table "public"."profile_rating" from "anon";

revoke delete on table "public"."profile_rating" from "authenticated";

revoke insert on table "public"."profile_rating" from "authenticated";

revoke references on table "public"."profile_rating" from "authenticated";

revoke select on table "public"."profile_rating" from "authenticated";

revoke trigger on table "public"."profile_rating" from "authenticated";

revoke truncate on table "public"."profile_rating" from "authenticated";

revoke update on table "public"."profile_rating" from "authenticated";

revoke delete on table "public"."profile_rating" from "service_role";

revoke insert on table "public"."profile_rating" from "service_role";

revoke references on table "public"."profile_rating" from "service_role";

revoke select on table "public"."profile_rating" from "service_role";

revoke trigger on table "public"."profile_rating" from "service_role";

revoke truncate on table "public"."profile_rating" from "service_role";

revoke update on table "public"."profile_rating" from "service_role";

alter table "public"."profile_rating" drop constraint "profile_rating_profile_id_fkey";

alter table "public"."profile_rating" drop constraint "profile_rating_pkey";

drop index if exists "public"."profile_rating_pkey";

drop table "public"."profile_rating";

create table "public"."rating" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "profile_id" uuid not null,
    "rating" smallint not null default '1000'::smallint
);


alter table "public"."rating" enable row level security;

CREATE UNIQUE INDEX rating_pkey ON public.rating USING btree (id, profile_id);

alter table "public"."rating" add constraint "rating_pkey" PRIMARY KEY using index "rating_pkey";

alter table "public"."rating" add constraint "profile_rating_profile_id_fkey" FOREIGN KEY (profile_id) REFERENCES profile(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."rating" validate constraint "profile_rating_profile_id_fkey";

grant delete on table "public"."rating" to "anon";

grant insert on table "public"."rating" to "anon";

grant references on table "public"."rating" to "anon";

grant select on table "public"."rating" to "anon";

grant trigger on table "public"."rating" to "anon";

grant truncate on table "public"."rating" to "anon";

grant update on table "public"."rating" to "anon";

grant delete on table "public"."rating" to "authenticated";

grant insert on table "public"."rating" to "authenticated";

grant references on table "public"."rating" to "authenticated";

grant select on table "public"."rating" to "authenticated";

grant trigger on table "public"."rating" to "authenticated";

grant truncate on table "public"."rating" to "authenticated";

grant update on table "public"."rating" to "authenticated";

grant delete on table "public"."rating" to "service_role";

grant insert on table "public"."rating" to "service_role";

grant references on table "public"."rating" to "service_role";

grant select on table "public"."rating" to "service_role";

grant trigger on table "public"."rating" to "service_role";

grant truncate on table "public"."rating" to "service_role";

grant update on table "public"."rating" to "service_role";


