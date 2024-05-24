import { redirect } from 'next/navigation';
import { type NextRequest } from 'next/server';
import { createClient } from '~/utils/supabase/server';

// Creating a handler to a GET request to route /auth/confirm
export async function GET(request: NextRequest) {
    const supabase = createClient();

    // Check if a user's logged in
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (user) {
        return redirect('/dashboard');
    }
    return redirect('/account/login');
}
