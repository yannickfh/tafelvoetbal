'use client';
import { FileImage, Pencil } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { css } from 'styled-system/css';
import * as FileUpload from '~/components/ui/file-upload';
import { createClient } from '~/utils/supabase/client';
import { Icon } from '../ui/icon';
import { IconButton } from '../ui/icon-button';

export default function Avatar({
    url,
    size,
    onUpload,
}: {
    url: string | null;
    size: number;
    onUpload: (url: string) => void;
}) {
    const supabase = createClient();
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        async function downloadImage(path: string) {
            try {
                const { data, error } = await supabase.storage
                    .from('avatars')
                    .download(path);
                if (error) {
                    throw error;
                }
                const url = URL.createObjectURL(data);
                setAvatarUrl(url);
            } catch (error) {
                console.error('Error downloading image: ', error);
            }
        }

        if (url) downloadImage(url);
    }, [url, supabase]);

    const uploadAvatar = async (files: File[]) => {
        try {
            setUploading(true);

            if (!files || files.length === 0) {
                throw new Error('You must select an image to upload.');
            }

            const file = files[0];
            const fileExt = file.name.split('.').pop();
            const filePath = `${Math.random()}.${fileExt}`;

            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }
            onUpload(filePath);
        } catch (error) {
            console.error(error);
            alert('Error uploading avatar!');
        } finally {
            setUploading(false);
        }
    };

    return (
        <FileUpload.Root
            accept="image/*"
            maxFiles={1}
            position="relative"
            onFileAccept={(details) => uploadAvatar(details.files)}
        >
            <FileUpload.Dropzone
                aspectRatio="1/1"
                borderRadius="100%"
                padding="0"
                width={150}
                minHeight="auto"
                position="relative"
                className={css({
                    bg: {
                        base: 'bg.default',
                        _hover: 'bg.emphasized',
                    },
                    cursor: 'pointer',
                })}
            >
                <FileUpload.ItemGroup
                    padding="0"
                    position="absolute"
                    zIndex="1"
                >
                    {(files) =>
                        files.map((file, id) => (
                            <FileUpload.Item key={id} file={file} asChild>
                                <FileUpload.ItemPreview type="image/*" asChild>
                                    <FileUpload.ItemPreviewImage
                                        display="block"
                                        padding="0"
                                        borderRadius="100%"
                                        height="100%"
                                        width="100%"
                                    />
                                </FileUpload.ItemPreview>
                            </FileUpload.Item>
                        ))
                    }
                </FileUpload.ItemGroup>
                {avatarUrl ? (
                    <Image
                        src={avatarUrl}
                        fill={true}
                        alt="Avatar"
                        style={{ borderRadius: '100%' }}
                    />
                ) : (
                    <Icon size="2xl" color="fg.subtle">
                        <FileImage />
                    </Icon>
                )}
                <FileUpload.Trigger
                    asChild
                    position="absolute"
                    right="0"
                    bottom="0"
                    zIndex="2"
                >
                    <IconButton
                        aspectRatio="1/1"
                        borderRadius="100%"
                        variant="outline"
                        bg="white"
                        _hover={{ bg: 'bg.emphasized' }}
                    >
                        <Pencil />
                    </IconButton>
                </FileUpload.Trigger>
            </FileUpload.Dropzone>
        </FileUpload.Root>
    );
}
