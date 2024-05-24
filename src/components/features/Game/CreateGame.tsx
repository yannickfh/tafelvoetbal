'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { FC, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Box, HStack } from 'styled-system/jsx';
import { Tables } from 'types/supabase';
import Select from '~/components/form/Select';
import { Button } from '~/components/ui/button';
import { createGameAction } from './createGameActions';
import { createGameSchema, createGameSchemaType } from './createGameValidation';

interface CreateGameProps {
    players: Tables<'profile'>[];
}

const CreateGame: FC<CreateGameProps> = ({ players }) => {
    const router = useRouter();
    const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);
    const { register, handleSubmit, control, watch, formState } =
        useForm<createGameSchemaType>({
            resolver: zodResolver(createGameSchema),
        });

    useEffect(() => {
        const subscription = watch((value, { name, type }) =>
            setSelectedPlayers(Object.values(value))
        );
        return () => subscription.unsubscribe();
    }, [watch]);

    return (
        <form
            onSubmit={handleSubmit(async (data) => {
                const {
                    data: responseData,
                    validationErrors,
                    serverError,
                } = await createGameAction(data);

                if (data && !serverError && !validationErrors) {
                    router.refresh();
                }
            })}
        >
            <HStack>
                <Box>
                    <Controller
                        name="lightAttacker"
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => (
                            <Select
                                items={players.map((player) => ({
                                    label: player.full_name || 'Unknown',
                                    value: player.id,
                                    disabled: selectedPlayers.includes(
                                        player.id
                                    ),
                                }))}
                                name={field.name}
                                value={[field.value]}
                                disabled={field.disabled}
                                label={'Light attacker'}
                                onValueChange={(details) => {
                                    field.onChange(...details.value);
                                }}
                            />
                        )}
                    />
                    <Controller
                        name="lightDefender"
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => (
                            <Select
                                items={players.map((player) => ({
                                    label: player.full_name || 'Unknown',
                                    value: player.id,
                                    disabled: selectedPlayers.includes(
                                        player.id
                                    ),
                                }))}
                                name={field.name}
                                value={[field.value]}
                                disabled={field.disabled}
                                label={'Light defender'}
                                onValueChange={(details) => {
                                    field.onChange(...details.value);
                                }}
                            />
                        )}
                    />
                </Box>
                <Button
                    type="submit"
                    disabled={!formState.isValid && formState.isDirty}
                >
                    Create game
                </Button>
                <Box>
                    <Controller
                        name="darkAttacker"
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => (
                            <Select
                                items={players.map((player) => ({
                                    label: player.full_name || 'Unknown',
                                    value: player.id,
                                    disabled: selectedPlayers.includes(
                                        player.id
                                    ),
                                }))}
                                name={field.name}
                                value={[field.value]}
                                disabled={field.disabled}
                                label={'Dark attacker'}
                                onValueChange={(details) => {
                                    field.onChange(...details.value);
                                }}
                            />
                        )}
                    />
                    <Controller
                        name="darkDefender"
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => (
                            <Select
                                items={players.map((player) => ({
                                    label: player.full_name || 'Unknown',
                                    value: player.id,
                                    disabled: selectedPlayers.includes(
                                        player.id
                                    ),
                                }))}
                                name={field.name}
                                value={[field.value]}
                                disabled={field.disabled}
                                label={'Dark defender'}
                                onValueChange={(details) => {
                                    field.onChange(...details.value);
                                }}
                            />
                        )}
                    />
                </Box>
            </HStack>
        </form>
    );
};

export default CreateGame;
