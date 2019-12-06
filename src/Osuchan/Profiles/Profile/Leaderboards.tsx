import React from "react";
import styled from "styled-components";

import { Surface, SurfaceTitle } from "../../../components";

const LeaderboardsSurface = styled(Surface)`
    padding: 20px;
    grid-area: leaderboards;
`;

function Leaderboards() {
    return (
        <LeaderboardsSurface>
            <SurfaceTitle>Leaderboards</SurfaceTitle>
        </LeaderboardsSurface>
    );
}

export default Leaderboards;
