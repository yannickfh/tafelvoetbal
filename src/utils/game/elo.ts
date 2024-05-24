const KFACTOR = 22; // normally 32, but chosen 22 for a more conservative approach and the goal difference is added to K-factor.
// possible other modifications to K-factor could be player's rating, number of games played, etc.
const RATINGVARIANCE = 500; //After extensive testing, it was decided that it would be appropriate for the expected score formula to set the variable used to divide the rating difference to 500, rather than the traditional value of 400 used in chess. This increased value means that a player’s rating will have a smaller impact on their expected score. https://towardsdatascience.com/developing-an-elo-based-data-driven-ranking-system-for-2v2-multiplayer-games-7689f7d42a53

const getExpectationForPlayer = (
    playerRating: number,
    primaryOpponentRating: number,
    secondaryOpponentRating: number
): number => {
    const primaryOpponentExpectation =
        1 /
        (1 + 10 ** ((playerRating - primaryOpponentRating) / RATINGVARIANCE));
    const secondaryOpponentExpectation =
        1 /
        (1 + 10 ** ((playerRating - secondaryOpponentRating) / RATINGVARIANCE));
    return (primaryOpponentExpectation + secondaryOpponentExpectation) / 2;
};

const getExpectationForTeam = (
    expectationPlayerOne: number,
    expectationPlayerTwo: number
): number => {
    return (expectationPlayerOne + expectationPlayerTwo) / 2;
};

const calculateNewRating = (
    oldRating: number,
    teamScore: 1 | 0,
    goalDifference: number,
    playerExpectation: number
): number => {
    return Math.floor(
        oldRating + (KFACTOR + goalDifference) * (teamScore - playerExpectation)
    );
};

export const getGameExpectations = (
    lightTeam: {
        attacker: number;
        defender: number;
    },
    darkTeam: {
        attacker: number;
        defender: number;
    }
): {
    lightTeamExpectation: {
        team: number;
        attacker: number;
        defender: number;
    };
    darkTeamExpectation: {
        team: number;
        attacker: number;
        defender: number;
    };
} => {
    const LightTeamPlayerOneExpectation = getExpectationForPlayer(
        lightTeam.attacker,
        darkTeam.attacker,
        darkTeam.defender
    );
    const LightTeamPlayerTwoExpectation = getExpectationForPlayer(
        lightTeam.defender,
        darkTeam.attacker,
        darkTeam.defender
    );
    const DarkTeamPlayerOneExpectation = getExpectationForPlayer(
        darkTeam.attacker,
        lightTeam.attacker,
        lightTeam.defender
    );
    const DarkTeamPlayerTwoExpectation = getExpectationForPlayer(
        darkTeam.defender,
        lightTeam.attacker,
        lightTeam.defender
    );

    const lightTeamExpectation = getExpectationForTeam(
        LightTeamPlayerOneExpectation,
        LightTeamPlayerTwoExpectation
    );

    const darkTeamExpectation = getExpectationForTeam(
        DarkTeamPlayerOneExpectation,
        DarkTeamPlayerTwoExpectation
    );

    const expectations = {
        lightTeamExpectation: {
            team: lightTeamExpectation,
            attacker: LightTeamPlayerOneExpectation,
            defender: LightTeamPlayerTwoExpectation,
        },
        darkTeamExpectation: {
            team: darkTeamExpectation,
            attacker: DarkTeamPlayerOneExpectation,
            defender: DarkTeamPlayerTwoExpectation,
        },
    };

    return expectations;
};

export const getNewPlayersRating = (
    light_team_attacker: {
        uuid: string;
        rating: number;
    },
    light_team_defender: {
        uuid: string;
        rating: number;
    },
    dark_team_attacker: {
        uuid: string;
        rating: number;
    },
    dark_team_defender: {
        uuid: string;
        rating: number;
    },
    light_team_score: number,
    dark_team_score: number
) => {
    const goalDifference = Math.abs(light_team_score - dark_team_score);
    const { lightTeamExpectation, darkTeamExpectation } = getGameExpectations(
        {
            attacker: light_team_attacker.rating,
            defender: light_team_defender.rating,
        },
        {
            attacker: dark_team_attacker.rating,
            defender: dark_team_defender.rating,
        }
    );

    return {
        lightTeam: {
            attacker: {
                old_score: light_team_attacker.rating,
                new_score: calculateNewRating(
                    light_team_attacker.rating,
                    light_team_score >= 10 ? 1 : 0,
                    goalDifference,
                    lightTeamExpectation.attacker
                ),
            },
            defender: {
                old_score: light_team_defender.rating,
                new_score: calculateNewRating(
                    light_team_defender.rating,
                    light_team_score >= 10 ? 1 : 0,
                    goalDifference,
                    lightTeamExpectation.defender
                ),
            },
        },
        darkTeam: {
            attacker: {
                old_score: dark_team_attacker.rating,
                new_score: calculateNewRating(
                    dark_team_attacker.rating,
                    dark_team_score >= 10 ? 1 : 0,
                    goalDifference,
                    darkTeamExpectation.attacker
                ),
            },
            defender: {
                old_score: dark_team_defender.rating,
                new_score: calculateNewRating(
                    dark_team_defender.rating,
                    dark_team_score >= 10 ? 1 : 0,
                    goalDifference,
                    darkTeamExpectation.defender
                ),
            },
        },
    };
};
