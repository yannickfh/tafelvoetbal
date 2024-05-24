'use client';
import { FC } from 'react';
import { Box } from 'styled-system/jsx';
import { Tables } from 'types/supabase';
import { toast } from '~/components/Toast';
import Avatar from '~/components/account/avatar';
import { update } from './avatar-actions';

interface AvatarFormProps {
    profile: Tables<'profile'>;
}

const AvatarForm: FC<AvatarFormProps> = ({ profile }) => {
    return (
        <Box
            position="absolute"
            top="0"
            left="50%"
            transform="translate(-50%, -50%)"
        >
            <Avatar
                url={profile.avatar_url}
                size={150}
                onUpload={(url) => {
                    toast.create({
                        title: 'Avatar updated',
                        description:
                            'Your avatar has been updated successfully',
                        type: 'success',
                    });
                    update({ avatar_url: url });
                }}
            />
        </Box>
    );
};

export default AvatarForm;
