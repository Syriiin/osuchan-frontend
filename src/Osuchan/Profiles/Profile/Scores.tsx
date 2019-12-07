import React, { useState } from "react";
import styled from "styled-components";

import { Surface, SurfaceTitle, ScoreRow } from "../../../components";
import { Score } from "../../../store/models/profiles/types";
import ScoreEditModal from "./ScoreEditModal";
import { observer } from "mobx-react-lite";
import { Gamemode } from "../../../store/models/common/enums";

const ScoresSurface = styled(Surface)`
    padding: 20px;
    grid-area: scores;
`;

const SandboxEditTip = styled.span`
    font-size: 0.5em;
    font-style: italic;
    font-weight: 400;
    color: ${props => props.theme.colours.timber};
`;

function ProfileScoreRow(props: ProfileScoreRowProps) {
    const [editModalOpen, setEditModalOpen] = useState(false);

    const score = props.score;

    return (
        <>
            <ScoreRow onClickOverride={props.sandboxMode ? () => setEditModalOpen(true) : undefined} score={score} hidePlayerInfo />
            <ScoreEditModal score={score} gamemode={props.gamemode} open={editModalOpen} onClose={() => setEditModalOpen(false)} />
        </>
    );
}

interface ProfileScoreRowProps {
    score: Score;
    gamemode: Gamemode;
    sandboxMode: boolean;
}

function Scores(props: ScoresProps) {
    return (
        <ScoresSurface>
            <SurfaceTitle>
                Scores
                {props.sandboxMode && (
                    <SandboxEditTip>TIP: Click on a score to edit it</SandboxEditTip>
                )}
            </SurfaceTitle>
            {props.scores.map((score, i) => (
                <ProfileScoreRow key={i} score={score} gamemode={props.gamemode} sandboxMode={props.sandboxMode} />
            ))}
        </ScoresSurface>
    );
}

interface ScoresProps {
    scores: Score[];
    gamemode: Gamemode;
    sandboxMode: boolean;
}

export default observer(Scores);
