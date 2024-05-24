import { redirect } from 'next/navigation';
import { FC } from 'react';
import { Box, HStack } from 'styled-system/jsx';
import Sidebar from '~/components/sidebar/sidebar';
import { createClient } from '~/utils/supabase/server';

interface layoutProps {
    children: React.ReactNode;
}

const layout: FC<layoutProps> = async ({ children }) => {
    const supabase = createClient();

    // Check if a user's logged in
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return redirect('/account/login');
    }

    return (
        <HStack
            gap="0"
            height="full"
            width="full"
            minH="screen"
            bgColor="bg.muted"
            alignItems="flex-start"
        >
            <Sidebar user={user} />
            <Box flexGrow="1" pl="14" py="8">
                <Box px="8">{children}</Box>
            </Box>
        </HStack>
    );
};

export default layout;
