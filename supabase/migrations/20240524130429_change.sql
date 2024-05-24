drop policy "Users can insert their own profile." on "public"."profile";

drop policy "Users can update own profile." on "public"."profile";

alter table "public"."profile" add column "recent_rating" smallint not null default '1000'::smallint;

create or replace view "public"."active_game" as  SELECT game.id,
    team.id AS team_id,
    team.color,
    player.*::player AS player,
    profile.id AS profile_id,
    profile.full_name
   FROM (((game
     LEFT JOIN team ON ((game.id = team.game_id)))
     LEFT JOIN player ON ((team.id = player.team_id)))
     LEFT JOIN profile ON ((profile.id = player.profile_id)))
  WHERE (game.ended_at = NULL::timestamp without time zone);


create policy "Enable insert for authenticated users only"
on "public"."profile"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable update access for all users"
on "public"."profile"
as permissive
for update
to public
using (true);


create policy "Enable insert for authenticated users only"
on "public"."rating"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable read access for all users"
on "public"."rating"
as permissive
for select
to public
using (true);



