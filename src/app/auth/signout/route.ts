import { createClient } from '~/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { NextResponse, type NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
    const supabase = createClient();

    // Check if a user's logged in
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (user) {
        await supabase.auth.signOut();
    }

    revalidatePath('/', 'layout');
    return NextResponse.redirect(new URL('/account/login', req.url), {
        status: 302,
    });
}
