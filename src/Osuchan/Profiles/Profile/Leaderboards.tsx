import React from "react";
import styled from "styled-components";

import { Surface, SurfaceTitle, UnstyledLink, CommunityLeaderboardRow } from "../../../components";
import { Leaderboard } from "../../../store/models/leaderboards/types";

const LeaderboardsSurface = styled(Surface)`
    padding: 20px;
    grid-area: leaderboards;
`;

const Leaderboards = (props: LeaderboardsProps) => {
    return (
        <LeaderboardsSurface>
            <SurfaceTitle>Leaderboards</SurfaceTitle>
            {props.leaderboards.map((leaderboard, i) => (
                <UnstyledLink key={i} to={`/leaderboards/${leaderboard.id}`}>
                    <CommunityLeaderboardRow leaderboard={leaderboard} />
                </UnstyledLink>
            ))}
            {props.leaderboards.length === 0 && (
                <p>This user has not joined any community leaderboards yet...</p>
            )}
        </LeaderboardsSurface>
    );
}

interface LeaderboardsProps {
    leaderboards: Leaderboard[];
}

export default Leaderboards;
