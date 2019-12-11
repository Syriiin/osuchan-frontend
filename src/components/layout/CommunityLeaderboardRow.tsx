import React from "react";
import styled from "styled-components";

import { Row } from "./Row";
import { OsuUser } from "../../store/models/profiles/types";
import { Leaderboard } from "../../store/models/leaderboards/types";

const LeaderboardTitleContainer = styled.div`
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    margin-left: 10px;
`;

const LeaderboardTitle = styled.span`
    font-size: 1.5em;
`;

const LeaderboardCreator = styled.span`
    color: ${props => props.theme.colours.timber};
`;

const LeaderboardIcon = styled.img`

`;

export function CommunityLeaderboardRow(props: CommunityLeaderboardRowProps) {
    const leaderboard = props.leaderboard;
    const owner = leaderboard.owner as OsuUser;

    return (
        <Row hoverable>
            <LeaderboardIcon src={leaderboard.iconUrl || "https://osu.ppy.sh/images/badges/mods/mod_coop@2x.png"} />
            <LeaderboardTitleContainer>
                <LeaderboardTitle>{leaderboard.name}</LeaderboardTitle>
                <LeaderboardCreator>{owner.username}</LeaderboardCreator>
            </LeaderboardTitleContainer>
        </Row>
    );
}

interface CommunityLeaderboardRowProps {
    leaderboard: Leaderboard;
}

