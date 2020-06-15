import React from "react";
import styled from "styled-components";

import { Row } from "./Row";
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

const LeaderboardType = styled.span`
    font-size: 0.8em;
    color: ${props => props.theme.colours.mango};
`;

const LeaderboardCreator = styled.span`
    color: ${props => props.theme.colours.timber};
`;

export const CommunityLeaderboardRow = (props: CommunityLeaderboardRowProps) => {
    const leaderboard = props.leaderboard;

    return (
        <Row hoverable>
            <LeaderboardIconContainer>
                <LeaderboardIcon src={leaderboard.iconUrl || `https://a.ppy.sh/${leaderboard.owner!.id}`} />
            </LeaderboardIconContainer>
            <LeaderboardTitleContainer>
                <LeaderboardTitle>{leaderboard.name}</LeaderboardTitle>
                <LeaderboardType>
                    {leaderboard.accessType === LeaderboardAccessType.Public && "PUBLIC"}
                    {leaderboard.accessType === LeaderboardAccessType.PublicInviteOnly && "INVITE-ONLY"}
                    {leaderboard.accessType === LeaderboardAccessType.Private && "PRIVATE"}
                </LeaderboardType>
                <LeaderboardCreator>{leaderboard.owner!.username}</LeaderboardCreator>
            </LeaderboardTitleContainer>
        </Row>
    );
}

interface CommunityLeaderboardRowProps {
    leaderboard: Leaderboard;
}

