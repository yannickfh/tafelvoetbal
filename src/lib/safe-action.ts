import { DEFAULT_SERVER_ERROR, createSafeActionClient } from 'next-safe-action';
import { Database } from 'types/supabase';
import { createClient } from '~/utils/supabase/server';

export class ActionError extends Error {}

export const unAuthenticatedAction = createSafeActionClient({
    async middleware() {
        const supabase = createClient<Database>();

        return { supabase };
    },
    handleReturnedServerError(e) {
        if (e instanceof ActionError) {
            return e.message;
        }
        return DEFAULT_SERVER_ERROR;
    },
});

export const authenticatedAction = createSafeActionClient({
    async middleware() {
        const supabase = createClient<Database>();

        // Check if a user's logged in
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            throw new ActionError('User is not authenticated');
        }
        return { supabase, user };
    },
    handleReturnedServerError(e) {
        if (e instanceof ActionError) {
            return e.message;
        }
        return DEFAULT_SERVER_ERROR;
    },
});
