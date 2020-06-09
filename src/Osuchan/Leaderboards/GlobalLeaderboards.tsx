import React from "react";
import styled from "styled-components";

import { Leaderboard } from "../../store/models/leaderboards/types";
import { Surface, SurfaceTitle, UnstyledLink } from "../../components";

const GlobalLeaderboardsSurface = styled(Surface)`
    margin: 20px auto;
    width: 1000px;
    padding: 20px;
`;

const GlobalLeaderboardsGrid = styled.div`
    display: grid;
    gap: 10px;
    grid-template-columns: repeat(3, 1fr);
`;

const LeaderboardTileWrapper = styled.div`
    display: flex;
    align-items: center;
    padding: 10px;
    height: 100%;
    border-radius: 5px;
    background-color: ${props => props.theme.colours.foreground};
    cursor: pointer;

    &:hover {
        background-color: ${props => props.theme.colours.pillow};
    }
`;

const LeaderboardTitleContainer = styled.div`
    display: flex;
    flex-direction: column;
    flex-grow: 1;
`;

const LeaderboardTitle = styled.span`
    font-size: 1.5em;
`;

const LeaderboardDescription = styled.span`
    color: ${props => props.theme.colours.timber};
`;

const LeaderboardIcon = styled.img`

`;

const LeaderboardTile = (props: LeaderboardTileProps) => {
    const leaderboard = props.leaderboard;

    return (
        <LeaderboardTileWrapper>
            <LeaderboardTitleContainer>
                <LeaderboardTitle>{leaderboard.name}</LeaderboardTitle>
                <LeaderboardDescription>{leaderboard.description}</LeaderboardDescription>
            </LeaderboardTitleContainer>
            <LeaderboardIcon src={leaderboard.iconUrl} />
        </LeaderboardTileWrapper>
    );
}

interface LeaderboardTileProps {
    leaderboard: Leaderboard;
}

const GlobalLeaderboards = (props: GlobalLeaderboardsProps) => {
    return (
        <GlobalLeaderboardsSurface>
            <SurfaceTitle>Global Leaderboards</SurfaceTitle>
            <GlobalLeaderboardsGrid>
                {props.leaderboards.map((leaderboard, i) => (
                    <UnstyledLink key={i} to={`/leaderboards/${leaderboard.id}`}>
                        <LeaderboardTile leaderboard={leaderboard} />
                    </UnstyledLink>
                ))}
            </GlobalLeaderboardsGrid>
        </GlobalLeaderboardsSurface>
    );
}

interface GlobalLeaderboardsProps {
    leaderboards: Leaderboard[];
}

export default GlobalLeaderboards;
