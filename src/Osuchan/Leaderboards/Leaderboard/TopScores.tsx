import { useState } from "react";
import styled from "styled-components";
import { observer } from "mobx-react-lite";

import { Surface, SurfaceTitle, ScoreRow, Button } from "../../../components";
import { Score } from "../../../store/models/profiles/types";

const TopScoresSurface = styled(Surface)`
    margin: 20px auto;
    width: 1000px;
    padding: 20px;
`;

const TopScores = observer((props: TopScoresProps) => {
    const [showAllScores, setShowAllScores] = useState(false);

    return (
        <TopScoresSurface>
            <SurfaceTitle>Top Scores</SurfaceTitle>
            {(showAllScores
                ? props.scores
                : props.scores.slice(0, 5)
            ).map((score, i) => (
                <ScoreRow key={i} score={score} />
            ))}
            {props.scores.length > 5 && !showAllScores && (
                <Button
                    type="button"
                    fullWidth
                    action={() => setShowAllScores(true)}
                >
                    Show More
                </Button>
            )}
            {props.scores.length === 0 && <p>No scores found...</p>}
        </TopScoresSurface>
    );
});

interface TopScoresProps {
    scores: Score[];
}

export default TopScores;
