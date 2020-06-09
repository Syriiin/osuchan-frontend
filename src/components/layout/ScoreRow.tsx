import React, { useState } from "react";
import styled from "styled-components";
import TimeAgo from "timeago-react";
import { Score } from "../../store/models/profiles/types";
import { Row } from "./Row";
import { ModIcons } from "./ModIcons";
import { formatScoreResult } from "../../utils/formatting";
import { ScoreModal } from "./ScoreModal";
import { Button } from "../forms/Button";

const ScoreRowWrapper = styled(Row)`
    padding: 0;
    align-items: unset;
`;

const PlayerInfo = styled.div`
    display: flex;
    align-items: center;
    margin: 5px;
    width: 200px;
`;

const Avatar = styled.img`
    width: 50px;
    border-radius: 5px;
    margin-right: 10px;
`;

const Username = styled.span`
    font-size: 1.1em;
`;

const BeatmapInfo = styled.div`
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    margin: 5px;
`;

const Title = styled.span`

`;

const Artist = styled.span`
    font-size: 0.8em;
`;

const DifficultyName = styled.span`
    font-size: 0.8em;
    color: ${props => props.theme.colours.mango};
`;

const ModsContainer = styled.div`
    display: flex;
    align-items: center;
`;

const ScoreInfo = styled.div`
    width: 200px;
    display: flex;
    margin: 5px;
`;

const AccuracyContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    margin-left: 10px;
    text-align: right;
    flex-grow: 1;
`;

const Accuracy = styled.span`

`;

const ScoreDate = styled(TimeAgo)`
    font-size: 0.8em;
`;

const PerformanceContainer = styled.div`
    display: flex;
    flex-direction: column;
    margin-left: 10px;
`;

const Performance = styled.span`
    font-size: 1.5em;
`;

const Result = styled.span`
    font-size: 0.8em;
`;

const ActionButton = styled(Button)`
    border-radius: 0 5px 5px 0;
`;

export const ScoreRow = (props: ScoreRowProps) => {
    const [detailsModalOpen, setDetailsModalOpen] = useState(false);

    const score = props.score;
    const userStats = score.userStats!;
    const beatmap = score.beatmap!;

    return (
        <>
            <ScoreRowWrapper hoverable onClick={props.onClickOverride || (() => setDetailsModalOpen(true))}>
                {!props.hidePlayerInfo && (
                    <PlayerInfo>
                        <Avatar src={`https://a.ppy.sh/${userStats.osuUserId}`} />
                        <Username>
                            {userStats.osuUser!.username}
                        </Username>
                    </PlayerInfo>
                )}
                {!props.hideBeatmapInfo && (
                    <BeatmapInfo>
                        <Title>
                            {beatmap.title}
                        </Title>
                        <Artist>
                            <small>by</small> {beatmap.artist}
                        </Artist>
                        <DifficultyName>
                            {beatmap.difficultyName}
                        </DifficultyName>
                    </BeatmapInfo>
                )}
                <ModsContainer>
                    <ModIcons small bitwiseMods={score.mods} />
                </ModsContainer>
                <ScoreInfo>
                    <AccuracyContainer>
                        <Accuracy>
                            {score.accuracy.toLocaleString("en", { maximumFractionDigits: 2 })}%
                        </Accuracy>
                        <ScoreDate datetime={score.date} />
                    </AccuracyContainer>
                    <PerformanceContainer>
                        <Performance>
                            {score.pp.toLocaleString("en", { maximumFractionDigits: 0 })}pp
                        </Performance>
                        <Result>
                            {formatScoreResult(score.result)}
                        </Result>
                    </PerformanceContainer>
                </ScoreInfo>
                {props.actionButton && (
                    <ActionButton onClick={e => { e.stopPropagation(); props.actionButtonOnClick && props.actionButtonOnClick(); }}>{props.actionButtonText}</ActionButton>
                )}
            </ScoreRowWrapper>
            <ScoreModal score={score} open={detailsModalOpen} onClose={() => setDetailsModalOpen(false)} />
        </>
    );
}

interface ScoreRowProps {
    score: Score;
    hidePlayerInfo?: boolean;
    hideBeatmapInfo?: boolean;
    onClickOverride?: () => void;
    actionButton?: boolean;
    actionButtonOnClick?: () => void;
    actionButtonText?: string;
}
