import { redirect } from 'next/navigation';
import { FC } from 'react';
import { Box, Flex, Grid } from 'styled-system/jsx';
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

    if (user) {
        return redirect('/dashboard');
    }

    return (
        <Grid gridTemplateColumns="2" minH="screen">
            <Flex
                alignItems="center"
                justifyContent="center"
                py="12"
                height="full"
            >
                {children}
            </Flex>
            <Box bg="bg.muted"></Box>
        </Grid>
    );
};

export default layout;
