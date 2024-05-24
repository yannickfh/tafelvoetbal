'use server';

import { GoalType } from 'enums/supabase';
import { z } from 'zod';
import { authenticatedAction } from '~/lib/safe-action';
import { getNewPlayersRating } from '~/utils/game/elo';

const goalSchema = z.object({
    profile_id: z.string().uuid(),
    game_id: z.string().uuid(),
    player_id: z.string().uuid(),
    type: z.nativeEnum(GoalType),
});

export const goal = authenticatedAction(
    goalSchema,
    async (data, { supabase, user }) => {
        const { data: goal, error } = await supabase
            .from('goal')
            .insert(data)
            .select()
            .limit(1)
            .single();
        if (error) console.error(error);
        if (!goal) throw new Error('Failed to create goal');
        return goal;
    }
);

const endGameSchema = z.object({
    game_id: z.string().uuid(),
    light_team_attacker: z.object({
        position: z.string().includes('ATTACKER'),
        profile_id: z.string().uuid(),
        rating: z.number(),
    }),
    light_team_defender: z.object({
        position: z.string().includes('DEFENDER'),
        profile_id: z.string().uuid(),
        rating: z.number(),
    }),
    light_team_score: z.number(),
    dark_team_attacker: z.object({
        position: z.string().includes('ATTACKER'),
        profile_id: z.string().uuid(),
        rating: z.number(),
    }),
    dark_team_defender: z.object({
        position: z.string().includes('DEFENDER'),
        profile_id: z.string().uuid(),
        rating: z.number(),
    }),
    dark_team_score: z.number(),
});

export const end_game = authenticatedAction(
    endGameSchema,
    async (
        {
            game_id,
            light_team_attacker,
            light_team_defender,
            light_team_score,
            dark_team_attacker,
            dark_team_defender,
            dark_team_score,
        },
        { supabase }
    ) => {
        const newRatings = getNewPlayersRating(
            {
                uuid: light_team_attacker.profile_id,
                rating: light_team_attacker.rating,
            },
            {
                uuid: light_team_defender.profile_id,
                rating: light_team_defender.rating,
            },
            {
                uuid: dark_team_attacker.profile_id,
                rating: dark_team_attacker.rating,
            },
            {
                uuid: dark_team_defender.profile_id,
                rating: dark_team_defender.rating,
            },
            light_team_score,
            dark_team_score
        );

        const { data: newRatingsData, error: ratingUpdateError } =
            await supabase
                .from('rating')
                .insert([
                    {
                        profile_id: light_team_attacker.profile_id,
                        rating: newRatings.lightTeam.attacker.new_score,
                    },
                    {
                        profile_id: light_team_defender.profile_id,
                        rating: newRatings.lightTeam.defender.new_score,
                    },
                    {
                        profile_id: dark_team_attacker.profile_id,
                        rating: newRatings.darkTeam.attacker.new_score,
                    },
                    {
                        profile_id: dark_team_defender.profile_id,
                        rating: newRatings.darkTeam.defender.new_score,
                    },
                ])
                .select('*');

        if (ratingUpdateError) throw ratingUpdateError;
        if (!newRatingsData) throw new Error('Failed to update ratings');

        const newProfileRatings = newRatingsData.map((rating) => ({
            id: rating.profile_id,
            recent_rating: rating.rating,
        }));
        const { data: updateProfileData, error: updateProfileError } =
            await supabase
                .from('profile')
                .upsert(newProfileRatings)
                .select('*');

        if (updateProfileError) throw updateProfileError;
        if (!updateProfileData) throw new Error('Failed to update profile');

        const { data, error } = await supabase
            .from('game')
            .update({ ended_at: new Date().toISOString() })
            .eq('id', game_id);
        if (error) console.error(error);
        else return data;
    }
);

export const cancel_game = authenticatedAction(
    z.string().uuid(),
    async (game_id, { supabase }) => {
        const { data, error } = await supabase
            .from('game')
            .delete()
            .eq('id', game_id);
        if (error) console.error(error);
        else return data;
    }
);
