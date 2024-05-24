'use server';

import { z } from 'zod';
import { zfd } from 'zod-form-data';
import { authenticatedAction } from '~/lib/safe-action';

const schema = zfd.formData({
    full_name: z.string({
        required_error: 'Name is required',
    }),
});

export const update = authenticatedAction(
    schema,
    async ({ full_name }, { supabase, user }) => {
        const { data: profile, error } = await supabase
            .from('profile')
            .update({ full_name: full_name })
            .eq('id', user.id);
    }
);
