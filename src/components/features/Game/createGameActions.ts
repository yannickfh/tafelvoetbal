'use server';

import { authenticatedAction } from '~/lib/safe-action';
import { createGameSchema } from './createGameValidation';

export const createGameAction = authenticatedAction(
    createGameSchema,
    async (data, { supabase, user }) => {
        const { data: game_id, error } = await supabase.rpc('create_game', {
            darkattacker: data.darkAttacker,
            darkdefender: data.darkDefender,
            lightattacker: data.lightAttacker,
            lightdefender: data.lightDefender,
        });
        if (error) console.error(error);
        else return game_id;
    }
);
