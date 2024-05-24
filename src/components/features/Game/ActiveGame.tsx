'use client';

import { GoalType, TeamColor } from 'enums/supabase';
import { Shield, Target } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react';
import { Box, Flex, HStack, VStack } from 'styled-system/jsx';
import { Database, Tables } from 'types/supabase';
import { Timer } from '~/components/timer/Timer';
import { Button } from '~/components/ui/button';
import { Heading } from '~/components/ui/heading';
import { createClient } from '~/utils/supabase/client';
import { cancel_game, end_game, goal } from './ActiveGameActions';

interface ActiveGameProps {
    game: {
        id: string;
        created_at: string;
        team: {
            id: string;
            color: 'LIGHT' | 'DARK';
            player: {
                created_at: string;
                id: string;
                position: 'DEFENDER' | 'ATTACKER';
                profile_id: string;
                team_id: string;
                profile: {
                    id: string;
                    full_name: string | null;
                    recent_rating: number;
                } | null;
            }[];
        }[];
    };
}

const renderPositionIcon = (position: string) => {
    switch (position) {
        case 'DEFENDER':
            return <Shield />;
        case 'ATTACKER':
            return <Target />;
        default:
            return null;
    }
};

const renderTeam = (
    game: {
        id: string;
        team: {
            id: string;
            color: 'LIGHT' | 'DARK';
            player: {
                created_at: string;
                id: string;
                position: 'DEFENDER' | 'ATTACKER';
                profile_id: string;
                team_id: string;
                profile: {
                    id: string;
                    full_name: string | null;
                    recent_rating: number;
                } | null;
            }[];
        }[];
    },
    color: TeamColor,
    setGoals: Dispatch<SetStateAction<Tables<'goal'>[]>>
) => {
    const team = game.team.find((team) => team.color === color);
    if (!team) {
        return null;
    }
    return (
        <VStack alignItems="stretch">
            {team.player.map((player) => {
                if (!player.profile) {
                    return null;
                }
                return (
                    <Box key={player.id}>
                        <HStack>
                            {renderPositionIcon(player.position)}
                            <Box>{player.profile.full_name}</Box>
                            <Button
                                onClick={async () => {
                                    if (!player.profile) return;
                                    const result = await goal({
                                        game_id: game.id,
                                        player_id: player.id,
                                        profile_id: player.profile.id,
                                        type: GoalType.REGULAR,
                                    });
                                    if (!result.data) return;
                                    const scoredGoal: Tables<'goal'> =
                                        result.data;
                                    setGoals((prevGoals) => [
                                        ...prevGoals,
                                        scoredGoal,
                                    ]);
                                }}
                            >
                                Goal
                            </Button>
                            {player.position === 'ATTACKER' && (
                                <Button
                                    onClick={async () => {
                                        if (!player.profile) return;
                                        const result = await goal({
                                            game_id: game.id,
                                            player_id: player.id,
                                            profile_id: player.profile.id,
                                            type: GoalType.MIDFIELD,
                                        });
                                        if (!result.data) return;
                                        const scoredGoal: Tables<'goal'> =
                                            result.data;
                                        setGoals((prevGoals) => [
                                            ...prevGoals,
                                            scoredGoal,
                                        ]);
                                    }}
                                >
                                    Midfield goal
                                </Button>
                            )}
                            <Button
                                onClick={async () => {
                                    if (!player.profile) return;
                                    const result = await goal({
                                        game_id: game.id,
                                        player_id: player.id,
                                        profile_id: player.profile.id,
                                        type: GoalType.OWN,
                                    });
                                    if (!result.data) return;
                                    const scoredGoal: Tables<'goal'> =
                                        result.data;
                                    setGoals((prevGoals) => [
                                        ...prevGoals,
                                        scoredGoal,
                                    ]);
                                }}
                            >
                                Own goal
                            </Button>
                        </HStack>
                    </Box>
                );
            })}
        </VStack>
    );
};

const calculateScore = (goals: Tables<'goal'>[]) => {
    return goals.reduce((acc, goal) => {
        if (goal.type === GoalType.MIDFIELD) {
            return acc - 1;
        }
        return acc + 1;
    }, 0);
};

const splitGoalsByTeam = (
    goals: Tables<'goal'>[],
    game: {
        id: string;
        team: {
            id: string;
            color: 'LIGHT' | 'DARK';
            player: {
                created_at: string;
                id: string;
                position: 'DEFENDER' | 'ATTACKER';
                profile_id: string;
                team_id: string;
                profile: {
                    id: string;
                    full_name: string | null;
                    recent_rating: number;
                } | null;
            }[];
        }[];
    }
) => {
    return goals.reduce<{
        lightTeamGoals: Tables<'goal'>[];
        darkTeamGoals: Tables<'goal'>[];
    }>(
        (acc, goal) => {
            const team = game.team.find((team) =>
                team.player.find((player) => player.id === goal.player_id)
            );

            if (!team) {
                return acc;
            }

            if (goal.type === GoalType.OWN) {
                if (team.color === 'LIGHT') {
                    acc.darkTeamGoals.push(goal);
                    return acc;
                }
                if (team.color === 'DARK') {
                    acc.lightTeamGoals.push(goal);
                    return acc;
                }
            }

            if (team.color === 'LIGHT') {
                acc.lightTeamGoals.push(goal);
                return acc;
            }
            if (team.color === 'DARK') {
                acc.darkTeamGoals.push(goal);
                return acc;
            }
            return acc;
        },
        { lightTeamGoals: [], darkTeamGoals: [] }
    );
};

const ActiveGame: FC<ActiveGameProps> = ({ game }) => {
    const router = useRouter();
    const supabase = createClient<Database>();
    const [goals, setGoals] = useState<Tables<'goal'>[]>([]);
    const [goalsByTeam, setGoalsByTeam] = useState<{
        lightTeamGoals: Tables<'goal'>[];
        darkTeamGoals: Tables<'goal'>[];
    }>({ lightTeamGoals: [], darkTeamGoals: [] });
    const [teamLightScore, setTeamLightScore] = useState(0);
    const [teamDarkScore, setTeamDarkScore] = useState(0);
    const profiles = game.team.flatMap((team) =>
        team.player.map((player) => player.profile)
    );

    useEffect(() => {
        supabase
            .from('goal')
            .select()
            .eq('game_id', game.id)
            .then((result) => {
                if (!result.data) return;
                console.log(result.data);
                setGoals(result.data);
            });
    }, [supabase, setGoals, game]);

    useEffect(() => {
        const splitGoals = splitGoalsByTeam(goals, game);
        setGoalsByTeam(splitGoals);
    }, [goals, setGoalsByTeam, game]);

    useEffect(() => {
        const endgame = async () => {
            const lightTeam = game.team
                .find((team) => team.color === TeamColor.LIGHT)
                ?.player.map((player) => {
                    return {
                        position: player.position,
                        profile_id: player.profile_id,
                        rating: player.profile?.recent_rating || 1000,
                    };
                });
            const darkTeam = game.team
                .find((team) => team.color === TeamColor.DARK)
                ?.player.map((player) => {
                    return {
                        position: player.position,
                        profile_id: player.profile_id,
                        rating: player.profile?.recent_rating || 1000,
                    };
                });

            if (!lightTeam || !darkTeam) return;
            const light_team_attacker = lightTeam.find(
                (player) => player.position === 'ATTACKER'
            );
            const light_team_defender = lightTeam.find(
                (player) => player.position === 'DEFENDER'
            );
            const dark_team_attacker = darkTeam.find(
                (player) => player.position === 'ATTACKER'
            );
            const dark_team_defender = darkTeam.find(
                (player) => player.position === 'DEFENDER'
            );
            if (
                !light_team_attacker ||
                !light_team_defender ||
                !dark_team_attacker ||
                !dark_team_defender
            ) {
                throw new Error('Missing player in team.');
            }

            const response = await end_game({
                game_id: game.id,
                light_team_attacker: light_team_attacker,
                light_team_defender: light_team_defender,
                light_team_score: teamLightScore,
                dark_team_attacker: dark_team_attacker,
                dark_team_defender: dark_team_defender,
                dark_team_score: teamDarkScore,
            });

            router.refresh();
        };
        const teamLightScore = calculateScore(goalsByTeam.lightTeamGoals);
        const teamDarkScore = calculateScore(goalsByTeam.darkTeamGoals);
        if (teamLightScore >= 10 || teamDarkScore >= 10) {
            endgame();
        }
        setTeamLightScore(teamLightScore);
        setTeamDarkScore(teamDarkScore);
    }, [goalsByTeam, game.id, game.team]);

    return (
        <>
            <Flex width="100%" alignItems="stretch">
                <Box flexGrow="1">
                    {renderTeam(game, TeamColor.LIGHT, setGoals)}
                    {goalsByTeam.lightTeamGoals.map((goal) => {
                        const name = profiles.find(
                            (profile) => profile?.id === goal.profile_id
                        )?.full_name;
                        return (
                            <div key={goal.id}>
                                {name}
                                {goal.type === 'OWN' && <>(e.d.)</>}
                            </div>
                        );
                    })}
                </Box>
                <VStack flexGrow="1">
                    <Timer startDate={new Date(game.created_at)} />
                    <Heading size="7xl" fontWeight="bold">
                        {teamLightScore} - {teamDarkScore}
                    </Heading>
                    <Button
                        onClick={async () => {
                            await cancel_game(game.id);
                            router.refresh();
                        }}
                        variant={'outline'}
                    >
                        Cancel game
                    </Button>
                </VStack>
                <Box flexGrow="1">
                    {renderTeam(game, TeamColor.DARK, setGoals)}
                    {goalsByTeam.darkTeamGoals.map((goal) => {
                        const name = profiles.find(
                            (profile) => profile?.id === goal.profile_id
                        )?.full_name;
                        return (
                            <div key={goal.id}>
                                {name} {goal.type === 'OWN' && <>(e.d.)</>}
                            </div>
                        );
                    })}
                </Box>
            </Flex>
        </>
    );
};

export default ActiveGame;
