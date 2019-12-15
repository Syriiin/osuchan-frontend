import React from "react";
import styled from "styled-components";

import { Score, Beatmap } from "../../store/models/profiles/types";
import { BasicModal } from "./BasicModal";
import { formatScoreResult, formatTime } from "../../utils/formatting";
import { DataTable, DataCell } from "./DataTable";
import TimeAgo from "timeago-react";
import { ModIcons } from "./ModIcons";
import { ScoreResult } from "../../store/models/profiles/enums";
import { BeatmapStatus } from "../../store/models/common/enums";

const BannerImage = styled.img`
    width: 100%;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
`;

const InfoContainer = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 10px;
`;

const BeatmapInfo = styled.div`
    display: flex;
    flex-direction: column;
`;

const Title = styled.a`
    font-size: 1.5em;
    color: #fff;
`;

const Artist = styled.span`

`;

const DifficultyName = styled.span`
    color: ${props => props.theme.colours.mango};
`;

const Mapper = styled.span`
    color: ${props => props.theme.colours.mango};
`;

const BeatmapDate = styled.span`
    margin-bottom: 5px;
    font-style: italic;
`;

const BeatmapDataTable = styled(DataTable)`
    max-width: 200px;
    font-size: 1.1em;
`;

const StarRating = styled.span`
    font-size: 2em;
`;

const ScoreInfo = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: flex-end;
`;

const ScoreDate = styled.span`
    font-style: italic;
`;

const ScoreDataTable = styled(DataTable)`
    max-width: 150px;
    font-size: 1.1em;
`;

const Combo = styled.span`
    font-size: 1.3em;
`;

const Accuracy = styled.span`
    font-size: 1.5em;
`;

const Performance = styled.span`
    font-size: 2em;
`;

const Result = styled.span`

`;

const NochokePerformance = styled.span`
    color: ${props => props.theme.colours.timber};
`;

export function ScoreModal(props: ScoreModalProps) {
    const score = props.score;
    const beatmap = score.beatmap as Beatmap;

    return (
        <BasicModal open={props.open} onClose={props.onClose}>
            <BannerImage src={`https://assets.ppy.sh/beatmaps/${beatmap.setId}/covers/cover.jpg`} />
            <InfoContainer>
                {/* Beatmap info: ranked date, title, artist, diffname, mapper, mods, cs, ar, od, bpm, length, stars */}
                <BeatmapInfo>
                    {/* TODO: make url to gamemode specific (accounting for converts) */}
                    <Title href={`https://osu.ppy.sh/beatmapsets/${beatmap.setId}#osu/${beatmap.id}`}>{beatmap.title}</Title>
                    <Artist>by {beatmap.artist}</Artist>
                    <DifficultyName>{beatmap.difficultyName}</DifficultyName>
                    <Mapper>Mapset by {beatmap.creatorName}</Mapper>
                    <BeatmapDate>{beatmap.status === BeatmapStatus.Loved ? "Loved" : "Ranked"} <TimeAgo datetime={beatmap.approvalDate} /></BeatmapDate>
                    <ModIcons small bitwiseMods={score.mods} />
                    <BeatmapDataTable>
                        <tr>
                            <td>BPM</td>
                            <DataCell>{score.bpm.toLocaleString("en", { maximumFractionDigits: 0 })}</DataCell>
                        </tr>
                        <tr>
                            <td>Length</td>
                            <DataCell>{formatTime(score.length)}</DataCell>
                        </tr>
                        <tr>
                            <td>Circle Size</td>
                            <DataCell>{score.circleSize.toLocaleString("en", { maximumFractionDigits: 1 })}</DataCell>
                        </tr>
                        <tr>
                            <td>Approach Rate</td>
                            <DataCell>{score.approachRate.toLocaleString("en", { maximumFractionDigits: 1 })}</DataCell>
                        </tr>
                        <tr>
                            <td>Overall Difficulty</td>
                            <DataCell>{score.overallDifficulty.toLocaleString("en", { maximumFractionDigits: 1 })}</DataCell>
                        </tr>
                    </BeatmapDataTable>
                    <StarRating>{score.starRating.toLocaleString("en", { maximumFractionDigits: 2 })} stars</StarRating>
                </BeatmapInfo>

                {/* Score info: date, 300s, 100s, 50s, misses, combo, acc, pp, result */}
                <ScoreInfo>
                    <ScoreDate>Played <TimeAgo datetime={score.date} /></ScoreDate>
                    <ScoreDataTable>
                        <tr>
                            <td>300</td>
                            <DataCell>{score.count300}</DataCell>
                        </tr>
                        <tr>
                            <td>100</td>
                            <DataCell>{score.count100}</DataCell>
                        </tr>
                        <tr>
                            <td>50</td>
                            <DataCell>{score.count50}</DataCell>
                        </tr>
                        <tr>
                            <td>Miss</td>
                            <DataCell>{score.countMiss}</DataCell>
                        </tr>
                    </ScoreDataTable>
                    <Accuracy>{score.accuracy.toLocaleString("en", { maximumFractionDigits: 2 })}%</Accuracy>
                    <Combo>{score.bestCombo}x / {beatmap.maxCombo}x</Combo>
                    <Performance>{score.pp.toLocaleString("en", { maximumFractionDigits: 0 })}pp</Performance>
                    <Result>{formatScoreResult(score.result)}</Result>
                    {Boolean(score.result & ScoreResult.Choke) && (
                        <NochokePerformance>No-choke {score.nochokePp.toLocaleString("en", { maximumFractionDigits: 0 })}pp</NochokePerformance>
                    )}
                </ScoreInfo>
            </InfoContainer>
        </BasicModal>
    );
}

export interface ScoreModalProps {
    score: Score;
    open: boolean;
    onClose: () => void;
}
