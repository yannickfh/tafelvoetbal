import { FC } from 'react';
import { Database } from 'types/supabase';
import ActiveGame from '~/components/features/Game/ActiveGame';
import CreateGame from '~/components/features/Game/CreateGame';
import { createClient } from '~/utils/supabase/server';

interface pageProps {}

const page: FC<pageProps> = async ({}) => {
    const supabase = createClient<Database>();

    const GameWithTeamsPlayersQuery = supabase
        .from('game')
        .select(`id, created_at, team(id, color, player(*, profile(id, full_name, recent_rating)))`)
        .is('ended_at', null)
        .limit(1)
        .maybeSingle();

    const { data: activeGame, error: activeGameError } =
        await GameWithTeamsPlayersQuery;

    if (!activeGame) {
        const { data: profiles, error: profilesError } = await supabase
            .from('profile')
            .select();
        if (!profiles) {
            return <div>Loading...</div>;
        }
        return <CreateGame players={profiles} />;
    }

    if (activeGame) {
        return <ActiveGame game={activeGame} />;
    }
};

export default page;
