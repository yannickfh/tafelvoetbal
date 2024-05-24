import { VStack } from 'styled-system/jsx';
import { Database } from 'types/supabase';
import { Button } from '~/components/ui/button';
import * as Card from '~/components/ui/card';
import { createClient } from '~/utils/supabase/server';
import AvatarForm from './AvatarForm';
import ProfileForm from './ProfileForm';

export default async function Account() {
    const supabase = createClient<Database>();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return null;
    }

    const { data: profile, error } = await supabase
        .from('profile')
        .select()
        .eq('id', user.id)
        .single();

    return (
        <VStack>
            {profile && (
                <Card.Root
                    marginTop="100px"
                    paddingTop="50px"
                    overflow="visible"
                >
                    <Card.Header>
                        <AvatarForm profile={profile} />
                    </Card.Header>
                    <ProfileForm profile={profile} />
                </Card.Root>
            )}

            <form action="/auth/signout" method="post">
                <Button variant="outline" type="submit" mt="6">
                    Logout
                </Button>
            </form>
        </VStack>
    );
}
