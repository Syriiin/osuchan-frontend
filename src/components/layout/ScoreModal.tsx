import styled from "styled-components";

import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { observer } from "mobx-react-lite";
import { Fragment, useState } from "react";
import { BeatmapStatus, Gamemode } from "../../store/models/common/enums";
import { Score } from "../../store/models/profiles/types";
import { formatCalculatorEngine, formatDiffcalcValueName, formatScoreResult, formatTime } from "../../utils/formatting";
import { Button } from "../forms/Button";
import { BasicModal } from "./BasicModal";
import { DataCell, DataTable } from "./DataTable";
import { ModIcons } from "./ModIcons";
import { NumberFormat } from "./NumberFormat";
import { TimeAgo } from "./TimeAgo";

const BannerImage = styled.img`
    width: 100%;
    min-width: 900px;
    min-height: 250px;
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
    color: ${(props) => props.theme.colours.timber};
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

const DetailsBar = styled(Button)`
    display: block;
    width: 100%;
    border-radius: 0;
`;

const Chevron = styled(FontAwesomeIcon)`
    transform: scaleY(${(props: ChevronProps) => (props.open ? "-1" : "1")});
    transition: transform 0.2s linear;
`;

interface ChevronProps {
    open?: boolean;
}

const DetailsCollapser = styled.div<DetailsCollapserProps>`
    overflow: hidden;
    max-height: ${(props) => (props.open ? "500px" : "0px")};
    transition: max-height 0.3s linear;
`;

interface DetailsCollapserProps {
    open?: boolean;
}

const DetailsContainer = styled.div`
    padding: 10px;
`;

const DiffcalcHeader = styled.h3`
    text-align: center;
`;

const DiffcalcDetailsContainer = styled.div`
    display: flex;
    justify-content: space-between;
`;

const DifficultyDataTable = styled(DataTable)`
    max-width: 300px;
    font-size: 1.1em;
`;

const PerformanceDataTable = styled(DataTable)`
    max-width: 300px;
    font-size: 1.1em;
`;

export const ScoreModal = observer((props: ScoreModalProps) => {
    const score = props.score;
    const beatmap = score.beatmap!;

    const [detailsOpen, setDetailsOpen] = useState(false);

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
                        <ModIcons small mods={score.modsJson} />
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
                    <StarRating>
                        <NumberFormat
                            value={score.difficultyTotal}
                            decimalPlaces={2}
                        />{" "}
                        stars
                    </StarRating>
                </BeatmapInfo>

                {/* Score info: date, 300s, 100s, 50s, misses, combo, acc, pp, result */}
                <ScoreInfo>
                    <ScoreDate>
                        Played <TimeAgo datetime={score.date} />
                    </ScoreDate>
                    <ScoreDataTable>
                        {score.gamemode === Gamemode.Standard && (
                            <>
                                <tr>
                                    <td>300</td>
                                    <DataCell>{score.statistics["great"] ?? 0}</DataCell>
                                </tr>
                                <tr>
                                    <td>100</td>
                                    <DataCell>{score.statistics["ok"] ?? 0}</DataCell>
                                </tr>
                                <tr>
                                    <td>50</td>
                                    <DataCell>{score.statistics["meh"] ?? 0}</DataCell>
                                </tr>
                                <tr>
                                    <td>Miss</td>
                                    <DataCell>{score.statistics["miss"] ?? 0}</DataCell>
                                </tr>
                            </>
                        )}
                        {score.gamemode === Gamemode.Taiko && (
                            <>
                                <tr>
                                    <td>Great</td>
                                    <DataCell>{score.statistics["great"] ?? 0}</DataCell>
                                </tr>
                                <tr>
                                    <td>Good</td>
                                    <DataCell>{score.statistics["ok"] ?? 0}</DataCell>
                                </tr>
                                <tr>
                                    <td>Miss</td>
                                    <DataCell>{score.statistics["miss"] ?? 0}</DataCell>
                                </tr>
                            </>
                        )}
                        {score.gamemode === Gamemode.Catch && (
                            <>
                                <tr>
                                    <td>Fruits</td>
                                    <DataCell>{score.statistics["great"] ?? 0}</DataCell>
                                </tr>
                                <tr>
                                    <td>Ticks</td>
                                    <DataCell>{score.statistics["large_tick_hit"] ?? 0}</DataCell>
                                </tr>
                                <tr>
                                    <td>Droplets</td>
                                    <DataCell>{score.statistics["small_tick_hit"] ?? 0}</DataCell>
                                </tr>
                                <tr>
                                    <td>Droplet Miss</td>
                                    <DataCell>{score.statistics["small_tick_miss"] ?? 0}</DataCell>
                                </tr>
                                <tr>
                                    <td>Miss</td>
                                    <DataCell>{score.statistics["miss"] ?? 0}</DataCell>
                                </tr>
                            </>
                        )}
                        {score.gamemode === Gamemode.Mania && (
                            <>
                                <tr>
                                    <td>MAX</td>
                                    <DataCell>{score.statistics["perfect"] ?? 0}</DataCell>
                                </tr>
                                <tr>
                                    <td>300</td>
                                    <DataCell>{score.statistics["great"] ?? 0}</DataCell>
                                </tr>
                                <tr>
                                    <td>200</td>
                                    <DataCell>{score.statistics["good"] ?? 0}</DataCell>
                                </tr>
                                <tr>
                                    <td>100</td>
                                    <DataCell>{score.statistics["ok"] ?? 0}</DataCell>
                                </tr>
                                <tr>
                                    <td>50</td>
                                    <DataCell>{score.statistics["meh"] ?? 0}</DataCell>
                                </tr>
                                <tr>
                                    <td>Miss</td>
                                    <DataCell>{score.statistics["miss"] ?? 0}</DataCell>
                                </tr>
                            </>
                        )}
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
            <DetailsBar action={() => setDetailsOpen(!detailsOpen)}>
                <Chevron
                    open={detailsOpen}
                    icon={faChevronDown}
                    size="sm"
                />
                {detailsOpen ? (
                    " Hide difficulty and performance details "
                ) : (
                    " Show difficulty and performance details "
                )}
                <Chevron
                    open={detailsOpen}
                    icon={faChevronDown}
                    size="sm"
                />
            </DetailsBar>
            <DetailsCollapser open={detailsOpen}>
                <DetailsContainer>
                    {score.performanceCalculations.map(performanceCalculation => (
                        <Fragment key={performanceCalculation.calculatorEngine}>
                            <DiffcalcHeader>{formatCalculatorEngine(performanceCalculation.calculatorEngine)}</DiffcalcHeader>
                            <DiffcalcDetailsContainer>
                                <DifficultyDataTable>
                                    {performanceCalculation.difficultyCalculation.difficultyValues.map((value) => (
                                        <tr key={value.name}>
                                            <td>{formatDiffcalcValueName(value.name)}</td>
                                            <DataCell>
                                                <NumberFormat
                                                    value={value.value}
                                                    decimalPlaces={2}
                                                /> stars
                                            </DataCell>
                                        </tr>
                                    ))}
                                </DifficultyDataTable>
                                <PerformanceDataTable>
                                    {performanceCalculation.performanceValues.map((value) => (
                                        <tr key={value.name}>
                                            <td>{formatDiffcalcValueName(value.name)}</td>
                                            <DataCell>
                                                <NumberFormat
                                                    value={value.value}
                                                    decimalPlaces={0}
                                                />pp
                                            </DataCell>
                                        </tr>
                                    ))}
                                </PerformanceDataTable>
                            </DiffcalcDetailsContainer>
                        </Fragment>
                    ))}
                </DetailsContainer>
            </DetailsCollapser>
        </BasicModal>
    );
});

export interface ScoreModalProps {
    score: Score;
    open: boolean;
    onClose: () => void;
}
