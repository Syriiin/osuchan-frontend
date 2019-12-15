import React from "react";
import styled from "styled-components";

import { Row } from "./Row";
import { OsuUser } from "../../store/models/profiles/types";
import { Leaderboard } from "../../store/models/leaderboards/types";
import { LeaderboardAccessType } from "../../store/models/leaderboards/enums";

const LeaderboardIconContainer = styled.div`
    height: 86px;
    display: flex;
    align-items: center;
`;

const LeaderboardIcon = styled.img`
    border-radius: 5px;
    width: 86px;
`;

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

const LeaderboardType = styled.span`
    font-size: 0.8em;
`;

export function CommunityLeaderboardRow(props: CommunityLeaderboardRowProps) {
    const leaderboard = props.leaderboard;
    const owner = leaderboard.owner as OsuUser;

    return (
        <Row hoverable>
            <LeaderboardIconContainer>
                <LeaderboardIcon src={leaderboard.iconUrl || `https://a.ppy.sh/${owner.id}`} />
            </LeaderboardIconContainer>
            <LeaderboardTitleContainer>
                <LeaderboardTitle>{leaderboard.name}</LeaderboardTitle>
                <LeaderboardCreator>{owner.username}</LeaderboardCreator>
                <LeaderboardType>
                    {leaderboard.accessType === LeaderboardAccessType.Public && "PUBLIC"}
                    {leaderboard.accessType === LeaderboardAccessType.PublicInviteOnly && "INVITE-ONLY"}
                    {leaderboard.accessType === LeaderboardAccessType.Private && "PRIVATE"}
                </LeaderboardType>
            </LeaderboardTitleContainer>
        </Row>
    );
}

interface CommunityLeaderboardRowProps {
    leaderboard: Leaderboard;
}

