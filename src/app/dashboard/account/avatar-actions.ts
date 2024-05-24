'use server';

import { z } from 'zod';
import { authenticatedAction } from '~/lib/safe-action';

const schema = z.object({
    avatar_url: z.string().optional(),
});

export const update = authenticatedAction(
    schema,
    async ({ avatar_url }, { supabase, user }) => {
        const { error } = await supabase
            .from('profile')
            .update({ avatar_url: avatar_url })
            .eq('id', user.id);
    }
);
