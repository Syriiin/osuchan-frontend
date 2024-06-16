import styled from "styled-components";

import { observer } from "mobx-react-lite";
import { BeatmapStatus, Gamemode } from "../../store/models/common/enums";
import { Score } from "../../store/models/profiles/types";
import { formatScoreResult, formatTime } from "../../utils/formatting";
import { BasicModal } from "./BasicModal";
import { DataCell, DataTable } from "./DataTable";
import { ModIcons } from "./ModIcons";
import { NumberFormat } from "./NumberFormat";
import { TimeAgo } from "./TimeAgo";

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

const Artist = styled.span``;

const DifficultyName = styled.span`
    color: ${(props) => props.theme.colours.mango};
`;

const Mapper = styled.span`
    color: ${(props) => props.theme.colours.mango};
`;

const BeatmapDate = styled.span`
    margin-bottom: 5px;
    font-style: italic;
`;

const ModsContainer = styled.div`
    display: flex;
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

const Result = styled.span``;

export const ScoreModal = observer((props: ScoreModalProps) => {
    const score = props.score;
    const beatmap = score.beatmap!;

    return (
        <BasicModal open={props.open} onClose={props.onClose}>
            <BannerImage
                src={`https://assets.ppy.sh/beatmaps/${beatmap.setId}/covers/cover.jpg`}
            />
            <InfoContainer>
                {/* Beatmap info: ranked date, title, artist, diffname, mapper, mods, cs, ar, od, bpm, length, stars */}
                <BeatmapInfo>
                    {/* TODO: make url to gamemode specific (accounting for converts) */}
                    <Title
                        href={`https://osu.ppy.sh/beatmapsets/${beatmap.setId}#osu/${beatmap.id}`}
                    >
                        {beatmap.title}
                    </Title>
                    <Artist>by {beatmap.artist}</Artist>
                    <DifficultyName>{beatmap.difficultyName}</DifficultyName>
                    <Mapper>Mapset by {beatmap.creatorName}</Mapper>
                    <BeatmapDate>
                        {beatmap.status === BeatmapStatus.Loved
                            ? "Loved"
                            : "Ranked"}{" "}
                        <TimeAgo datetime={beatmap.approvalDate} />
                    </BeatmapDate>
                    <ModsContainer>
                        <ModIcons small bitwiseMods={score.mods} />
                    </ModsContainer>
                    <BeatmapDataTable>
                        <tr>
                            <td>BPM</td>
                            <DataCell>
                                <NumberFormat
                                    value={score.bpm}
                                    decimalPlaces={0}
                                />
                            </DataCell>
                        </tr>
                        <tr>
                            <td>Length</td>
                            <DataCell>{formatTime(score.length)}</DataCell>
                        </tr>
                        {[
                            Gamemode.Standard,
                            Gamemode.Catch,
                            Gamemode.Mania,
                        ].includes(score.gamemode) && (
                                <tr>
                                    <td>
                                        {score.gamemode === Gamemode.Mania
                                            ? "Keys"
                                            : "Circle Size"}
                                    </td>
                                    <DataCell>
                                        <NumberFormat
                                            value={score.circleSize}
                                            decimalPlaces={1}
                                        />
                                    </DataCell>
                                </tr>
                            )}
                        {[Gamemode.Standard, Gamemode.Catch].includes(
                            score.gamemode
                        ) && (
                                <tr>
                                    <td>Approach Rate</td>
                                    <DataCell>
                                        <NumberFormat
                                            value={score.approachRate}
                                            decimalPlaces={1}
                                        />
                                    </DataCell>
                                </tr>
                            )}
                        <tr>
                            <td>Overall Difficulty</td>
                            <DataCell>
                                <NumberFormat
                                    value={score.overallDifficulty}
                                    decimalPlaces={1}
                                />
                            </DataCell>
                        </tr>
                    </BeatmapDataTable>
                    {score.gamemode === Gamemode.Standard && (
                        <StarRating>
                            <NumberFormat
                                value={score.difficultyTotal}
                                decimalPlaces={2}
                            />{" "}
                            stars
                        </StarRating>
                    )}
                </BeatmapInfo>

                {/* Score info: date, 300s, 100s, 50s, misses, combo, acc, pp, result */}
                <ScoreInfo>
                    <ScoreDate>
                        Played <TimeAgo datetime={score.date} />
                    </ScoreDate>
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
                    <Accuracy>
                        <NumberFormat
                            value={score.accuracy}
                            decimalPlaces={2}
                        />
                        %
                    </Accuracy>
                    <Combo>
                        {score.bestCombo}x / {beatmap.maxCombo}x
                    </Combo>
                    <Performance>
                        <NumberFormat
                            value={score.performanceTotal}
                            decimalPlaces={0}
                        />
                        pp
                    </Performance>
                    <Result>{formatScoreResult(score.result)}</Result>
                </ScoreInfo>
            </InfoContainer>
        </BasicModal>
    );
});

export interface ScoreModalProps {
    score: Score;
    open: boolean;
    onClose: () => void;
}
