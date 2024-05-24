'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { zfd } from 'zod-form-data';
import { unAuthenticatedAction } from '~/lib/safe-action';

const schema = zfd.formData({
    email: z.string().email(),
    password: z.string().min(8),
});

export const signup = unAuthenticatedAction(
    schema,
    async (data, { supabase }) => {
        const { error, data: userData } = await supabase.auth.signUp(data);

        console.error(error);

        if (error) {
            redirect('/error');
        }

        revalidatePath('/', 'layout');
        redirect('/account/verify-email');
    }
);
