'use server';
import { FC } from 'react';
import { Stack, VStack } from 'styled-system/jsx';
import { Tables } from 'types/supabase';
import * as Card from '~/components/ui/card';
import { FormLabel } from '~/components/ui/form-label';
import { Input } from '~/components/ui/input';
import SubmitButton from './SubmitButton';
import { update } from './profile-actions';

interface ProfileFormProps {
    profile: Tables<'profile'>;
}

const ProfileForm: FC<ProfileFormProps> = ({ profile }) => {
    const initialState = {
        full_name: profile.full_name ?? '',
        errors: [], // Add the errors property to the initialState object
    };

    return (
        <form action={update}>
            <Card.Body>
                <VStack gap="6">
                    <Stack gap="1.5" width="xs">
                        <FormLabel htmlFor="firstName">Name</FormLabel>
                        <Input
                            id="full_name"
                            name="full_name"
                            type="text"
                            defaultValue={initialState.full_name || undefined}
                            required
                        />
                    </Stack>
                </VStack>
            </Card.Body>
            <Card.Footer>
                <SubmitButton />
            </Card.Footer>
        </form>
    );
};

export default ProfileForm;
