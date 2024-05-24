'use client';
import { FC } from 'react';
import * as Card from '~/components/ui/card';
import * as Table from '~/components/ui/table';

interface RankingByEloCardProps {
    profiles: {
        full_name: string | null;
        recent_rating: number;
        game: {
            count: number;
        }[];
    }[];
}

const RankingByGamesCard: FC<RankingByEloCardProps> = ({ profiles }) => {
    return (
        <Card.Root w="full">
            <Card.Header>
                <Card.Title>Most active players</Card.Title>
                <Card.Description>
                    Players with the most games played
                </Card.Description>
            </Card.Header>
            <Card.Body>
                <Table.Root>
                    <Table.Head>
                        <Table.Row>
                            <Table.Header></Table.Header>
                            <Table.Header>Player</Table.Header>
                            <Table.Header textAlign="right">Games</Table.Header>
                        </Table.Row>
                    </Table.Head>
                    <Table.Body>
                        {profiles
                            .sort((a, b) => b.game[0].count - a.game[0].count)
                            .map((profile, index) => {
                                return (
                                    <Table.Row key={index}>
                                        <Table.Cell fontWeight="medium">
                                            {index + 1}
                                        </Table.Cell>
                                        <Table.Cell width="100%">
                                            {profile.full_name || 'Unknown'}
                                        </Table.Cell>
                                        <Table.Cell textAlign="right">
                                            {profile.game[0].count}
                                        </Table.Cell>
                                    </Table.Row>
                                );
                            })}
                    </Table.Body>
                </Table.Root>
            </Card.Body>
        </Card.Root>
    );
};

export default RankingByGamesCard;
