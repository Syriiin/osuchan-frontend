import React from "react";
import styled from "styled-components";

import { Surface, SurfaceTitle, ScoreRow } from "../../../../components";
import { Score } from "../../../../store/models/profiles/types";

const ScoresSurface = styled(Surface)`
    padding: 20px;
    grid-area: scores;
`;

const Scores = (props: ScoresProps) => {
    return (
        <ScoresSurface>
            <SurfaceTitle>Scores</SurfaceTitle>
            {props.scores.map((score, i) => (
                <ScoreRow key={i} score={score} hidePlayerInfo />
            ))}
        </ScoresSurface>
    );
}

interface ScoresProps {
    scores: Score[];
}

export default Scores;
