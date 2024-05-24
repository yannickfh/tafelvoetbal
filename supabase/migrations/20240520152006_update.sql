alter table "public"."profile_game" drop constraint "profile_game_pkey";

drop index if exists "public"."profile_game_pkey";

create table "public"."profile_rating" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "profile_id" uuid not null,
    "rating" smallint not null default '1000'::smallint
);


alter table "public"."profile_rating" enable row level security;

alter table "public"."profile" drop column "rating";

CREATE UNIQUE INDEX profile_rating_pkey ON public.profile_rating USING btree (id);

CREATE UNIQUE INDEX profile_game_pkey ON public.profile_game USING btree (id, profile_id, game_id);

alter table "public"."profile_rating" add constraint "profile_rating_pkey" PRIMARY KEY using index "profile_rating_pkey";

alter table "public"."profile_game" add constraint "profile_game_pkey" PRIMARY KEY using index "profile_game_pkey";

alter table "public"."profile_rating" add constraint "profile_rating_profile_id_fkey" FOREIGN KEY (profile_id) REFERENCES profile(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."profile_rating" validate constraint "profile_rating_profile_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.create_profile_rating()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
begin
  insert into public.rating(profile_id, rating)
  values (new.id, 1000);
  return new;
end;
$function$
;

grant delete on table "public"."profile_rating" to "anon";

grant insert on table "public"."profile_rating" to "anon";

grant references on table "public"."profile_rating" to "anon";

grant select on table "public"."profile_rating" to "anon";

grant trigger on table "public"."profile_rating" to "anon";

grant truncate on table "public"."profile_rating" to "anon";

grant update on table "public"."profile_rating" to "anon";

grant delete on table "public"."profile_rating" to "authenticated";

grant insert on table "public"."profile_rating" to "authenticated";

grant references on table "public"."profile_rating" to "authenticated";

grant select on table "public"."profile_rating" to "authenticated";

grant trigger on table "public"."profile_rating" to "authenticated";

grant truncate on table "public"."profile_rating" to "authenticated";

grant update on table "public"."profile_rating" to "authenticated";

grant delete on table "public"."profile_rating" to "service_role";

grant insert on table "public"."profile_rating" to "service_role";

grant references on table "public"."profile_rating" to "service_role";

grant select on table "public"."profile_rating" to "service_role";

grant trigger on table "public"."profile_rating" to "service_role";

grant truncate on table "public"."profile_rating" to "service_role";

grant update on table "public"."profile_rating" to "service_role";

create policy "Enable read access for all users"
on "public"."game"
as permissive
for select
to public
using (true);


create policy "Enable read access for all users"
on "public"."profile_game"
as permissive
for select
to public
using (true);


CREATE TRIGGER profile_created_trigger AFTER INSERT ON public.profile FOR EACH ROW EXECUTE FUNCTION create_profile_rating();


