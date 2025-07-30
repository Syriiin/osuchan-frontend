import { observer } from "mobx-react-lite";
import styled from "styled-components";
import { Flag, ModIcons, NumberFormat, Row, TimeAgo } from "../../components";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { Score } from "../../store/models/profiles/types";
import { formatScoreResult } from "../../utils/formatting";

const TeamScoreDetailsWrapper = styled.div`
    display: grid;
    grid-template-rows: 1fr 500px;
    grid-template-areas:
        "scores"
        "chart";
    grid-gap: 10px;
    height: 100%;
`;

const TeamScores = styled.div`
    grid-area: scores;
    display: flex;
    flex-direction: column;
    overflow: hidden;
`;

const ScoreRowWrapper = styled(Row)<ScoreRowWrapperProps>`
    display: grid;
    grid-template-columns: 70px 150px 1fr 100px 100px;
    grid-template-areas: "rank player beatmap details performance";
    grid-gap: 10px;
    padding: 10px;
    align-items: unset;
    background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)),
        ${(props) =>
            `url("https://assets.ppy.sh/beatmaps/${props.beatmapSetId}/covers/cover.jpg")`};
    background-size: cover;
    text-shadow: 0 0 0.5em black;
    height: 60px;
`;

interface ScoreRowWrapperProps {
    beatmapSetId: number;
}

const Rank = styled.div`
    grid-area: rank;
    display: flex;
    align-items: center;
    font-size: 1.8em;
`;

const PlayerInfo = styled.div`
    grid-area: player;
    display: flex;
    align-items: center;
    font-size: 0.7em;
`;

const FlagContainer = styled.div`
    margin-right: 1em;
`;

const Username = styled.span`
    font-size: 1.5em;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    max-width: 8em;
`;

const BeatmapInfo = styled.div`
    grid-area: beatmap;
    display: grid;
    grid-template-columns: 10em 1fr;
    grid-template-rows: auto auto auto;
    grid-template-areas:
        "title title"
        "artist mods"
        "diffname mods";
    align-items: center;
    font-size: 0.8em;
    overflow: hidden;
`;

const Title = styled.span`
    grid-area: title;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
`;

const Artist = styled.span`
    grid-area: artist;
    font-size: 0.8em;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
`;

const DifficultyName = styled.div`
    grid-area: diffname;
    font-size: 0.8em;
    color: ${(props) => props.theme.colours.mango};
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
`;

const ModsContainer = styled.div`
    grid-area: mods;
    display: flex;
    flex: 1;
    justify-content: flex-end;
    align-items: center;

    img {
        width: 30px;
        margin-left: -15px;
    }
`;

const AccuracyContainer = styled.div`
    grid-area: details;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    text-align: right;
`;

const Accuracy = styled.span``;

const ScoreDate = styled.span`
    font-size: 0.8em;
`;

const PerformanceContainer = styled.div`
    grid-area: performance;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
`;

const Performance = styled.span`
    font-size: 1.2em;
`;

const Result = styled.span`
    font-size: 0.8em;
`;

const ScoreChartContainer = styled.div`
    grid-area: chart;
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 1;
`;

const ScoreRow = observer((props: ScoreRowProps) => {
    const score = props.score;
    const user = props.score.userStats!.osuUser!;
    const beatmap = score.beatmap!;

    return (
        <ScoreRowWrapper beatmapSetId={beatmap.setId}>
            <Rank>#{props.rank}</Rank>
            <PlayerInfo>
                <FlagContainer>
                    <Flag countryCode={user.country} large />
                </FlagContainer>
                <Username>{user.username}</Username>
            </PlayerInfo>
            <BeatmapInfo>
                <Title>{beatmap.title}</Title>
                <Artist>
                    <small>by</small> {beatmap.artist}
                </Artist>
                <DifficultyName>{beatmap.difficultyName}</DifficultyName>
                <ModsContainer>
                    <ModIcons small mods={score.modsJson} />
                </ModsContainer>
            </BeatmapInfo>
            <AccuracyContainer>
                <Accuracy>
                    <NumberFormat value={score.accuracy} decimalPlaces={2} />%
                </Accuracy>
                <ScoreDate>
                    <TimeAgo datetime={score.date} />
                </ScoreDate>
            </AccuracyContainer>
            <PerformanceContainer>
                <Performance>
                    <NumberFormat
                        value={score.performanceTotal}
                        decimalPlaces={0}
                    />
                    pp
                </Performance>
                <Result>{formatScoreResult(score.result)}</Result>
            </PerformanceContainer>
        </ScoreRowWrapper>
    );
});

interface ScoreRowProps {
    score: Score;
    rank: number;
}

const ScoreChart = observer((props: ScoreChartProps) => {
    const scoreValues = props.topScores.map((score) => score.performanceTotal);
    const weightedScores = scoreValues.map(
        (value, index) => value * props.ppDecayBase ** index
    );
    const topScoreTotal = weightedScores.reduce((acc, value) => acc + value, 0);
    const missingPp = props.teamPpTotal - topScoreTotal;

    const mainScores = weightedScores.filter(
        (score) => score / props.teamPpTotal > 0.02
    );
    const otherScores = weightedScores.filter(
        (score) => score / props.teamPpTotal <= 0.02
    );
    const otherScoresContribution =
        otherScores.reduce((acc, score) => acc + score, 0) + missingPp;
    const data = mainScores
        .sort((a, b) => b - a)
        .map((score) => ({
            name: score.toFixed(0) + "pp",
            value: score,
        }));

    if (otherScoresContribution > 0) {
        data.push({
            name: "Others - " + otherScoresContribution.toFixed(0) + "pp",
            value: otherScoresContribution,
        });
    }
    return (
        // 99% to fix resizing down https://github.com/recharts/recharts/issues/172
        <ResponsiveContainer width="99%" height="99%">
            <PieChart>
                <Pie
                    data={data}
                    dataKey="value"
                    nameKey="name"
                    fill={props.teamColour}
                    startAngle={90}
                    endAngle={-270}
                    label={(props) => {
                        const { name, percent } = props;
                        return `${name}: ${(percent * 100).toLocaleString(
                            "en",
                            {
                                maximumFractionDigits: 0,
                            }
                        )}%`;
                    }}
                >
                    {data.map((entry, index) => (
                        <Cell
                            key={`cell-${index}`}
                            fill={
                                index % 2 === 0
                                    ? props.teamColour
                                    : props.teamColour + "bb"
                            }
                        />
                    ))}
                </Pie>
            </PieChart>
        </ResponsiveContainer>
    );
});

interface ScoreChartProps {
    teamColour: string;
    topScores: Score[];
    teamPpTotal: number;
    ppDecayBase: number;
}

const TeamScoreDetails = observer((props: TeamScoreDetailsProps) => {
    const topScores = props.topScores;

    return (
        <TeamScoreDetailsWrapper>
            <TeamScores>
                {topScores.slice(0, 20).map((score, i) => (
                    <ScoreRow key={score.id} score={score} rank={i + 1} />
                ))}
            </TeamScores>
            <ScoreChartContainer>
                <ScoreChart
                    teamColour={props.teamColour}
                    topScores={topScores}
                    teamPpTotal={props.teamPpTotal}
                    ppDecayBase={props.ppDecayBase}
                />
            </ScoreChartContainer>
        </TeamScoreDetailsWrapper>
    );
});

interface TeamScoreDetailsProps {
    teamColour: string;
    topScores: Score[];
    teamPpTotal: number;
    scoresCount: number;
    ppDecayBase: number;
}

export default TeamScoreDetails;
