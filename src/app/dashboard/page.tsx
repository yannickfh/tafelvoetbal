import { FC } from 'react';
import { HStack, VStack } from 'styled-system/jsx';
import { Database } from 'types/supabase';
import RankingByEloCard from '~/components/features/dashboard/RankingByEloCard';
import RankingByGamesCard from '~/components/features/dashboard/RankingByGamesCard';
import { createClient } from '~/utils/supabase/server';

interface pageProps {}

const page: FC<pageProps> = async ({}) => {
    const supabase = createClient<Database>();

    // Check if a user's logged in
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return null;
    }

    const { data: profilesWithGameCountAndElo, error: profilesError } =
        await supabase
            .from('profile')
            .select('full_name, recent_rating, game(count)');

    return (
        <VStack>
            <HStack w="full" alignItems="stretch" gap="10">
                {profilesWithGameCountAndElo && (
                    <RankingByEloCard profiles={profilesWithGameCountAndElo} />
                )}
                {profilesWithGameCountAndElo && (
                    <RankingByGamesCard
                        profiles={profilesWithGameCountAndElo}
                    />
                )}
            </HStack>
        </VStack>
    );
};

export default page;
