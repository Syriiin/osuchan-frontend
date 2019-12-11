import React from "react";
import styled from "styled-components";

import { Surface, SurfaceTitle, UnstyledLink } from "../../../components";
import { Leaderboard } from "../../../store/models/leaderboards/types";
import { CommunityLeaderboardRow } from "../../../components/layout/CommunityLeaderboardRow";

const LeaderboardsSurface = styled(Surface)`
    padding: 20px;
    grid-area: leaderboards;
`;

function Leaderboards(props: LeaderboardsProps) {
    return (
        <LeaderboardsSurface>
            <SurfaceTitle>Leaderboards</SurfaceTitle>
            {props.leaderboards.map((leaderboard, i) => (
                <UnstyledLink key={i} to={`/leaderboards/${leaderboard.id}`}>
                    <CommunityLeaderboardRow leaderboard={leaderboard} />
                </UnstyledLink>
            ))}
        </LeaderboardsSurface>
    );
}

interface LeaderboardsProps {
    leaderboards: Leaderboard[];
}

export default Leaderboards;
