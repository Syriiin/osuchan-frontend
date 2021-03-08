import styled from "styled-components";
import { observer } from "mobx-react-lite";

import { Surface, SurfaceTitle, ScoreRow } from "../../../components";
import { Score } from "../../../store/models/profiles/types";

const TopScoresSurface = styled(Surface)`
    margin: 20px auto;
    width: 1000px;
    padding: 20px;
`;

const TopScores = observer((props: TopScoresProps) => (
    <TopScoresSurface>
        <SurfaceTitle>Top Scores</SurfaceTitle>
        {props.scores.map((score, i) => (
            <ScoreRow key={i} score={score} />
        ))}
    </TopScoresSurface>
));

interface TopScoresProps {
    scores: Score[];
}

export default TopScores;
