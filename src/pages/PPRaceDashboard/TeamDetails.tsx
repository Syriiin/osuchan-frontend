import styled from "styled-components";
import { PPRacePlayer, PPRaceTeam } from "../../store/models/ppraces/types";
import { Score } from "../../store/models/profiles/types";
import { observer } from "mobx-react-lite";
import { Flag, ModIcons, NumberFormat, Row, TimeAgo } from "../../components";
import { formatScoreResult } from "../../utils/formatting";
import { Pie, PieChart, ResponsiveContainer } from "recharts";

const TeamDetailsWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 10px;
    width: 100%;
`;

const TeamTitle = styled.div<{ teamColour: string }>`
    text-align: center;
    font-size: 1.5em;
    font-weight: bold;
    background-color: ${(props) => props.teamColour};
    border-radius: 5px;
    padding: 10px;
`;

const TeamScores = styled.div`
    display: flex;
    flex-direction: column;
    height: 26em;
`;

const ScoreRowWrapper = styled(Row)<ScoreRowWrapperProps>`
    padding: 0;
    align-items: unset;
    background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)),
        ${(props) =>
            `url("https://assets.ppy.sh/beatmaps/${props.beatmapSetId}/covers/cover.jpg")`};
    background-size: cover;
    text-shadow: 0 0 0.5em black;
    font-size: 0.9em;
`;

interface ScoreRowWrapperProps {
    beatmapSetId: number;
}

const LeftContainer = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;
    gap: 0.5em;
    margin: 0.5em;
`;

const PlayerInfo = styled.div`
    display: flex;
    align-items: center;
`;

const Avatar = styled.img`
    width: 3em;
    border-radius: 1em;
    margin-right: 1em;
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
    display: flex;
`;

const MetadataContainer = styled.div`
    display: flex;
    flex-direction: column;
`;

const ModsContainer = styled.div`
    display: flex;
    flex: 1;
    justify-content: flex-end;
    align-items: center;
`;

const Title = styled.span`
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    max-width: 15em;
`;

const Artist = styled.span`
    font-size: 0.8em;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    max-width: 15em;
`;

const DifficultyName = styled.span`
    font-size: 0.8em;
    color: ${(props) => props.theme.colours.mango};
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    max-width: 15em;
`;

const ScoreInfo = styled.div`
    display: flex;
    margin: 0.5em;
    font-size: 1.3em;
`;

const AccuracyContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-left: 1em;
    text-align: right;
    flex-grow: 1;
`;

const Accuracy = styled.span``;

const ScoreDate = styled.span`
    font-size: 0.8em;
`;

const PerformanceContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-left: 1em;
`;

const Performance = styled.span`
    font-size: 1.5em;
`;

const Result = styled.span`
    font-size: 0.8em;
`;

const ScoreCount = styled.div`
    text-align: center;
    background-color: rgba(0, 0, 0, 0.25);
    padding: 10px;
    border-radius: 5px;
`;

const ScoreChartContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 1;
`;

const TeamTotal = styled.div<{ teamColour: string }>`
    text-align: center;
    font-size: 1.5em;
    font-weight: bold;
    margin-top: 1em;
    background-color: ${(props) => props.teamColour};
    border-radius: 5px;
    padding: 10px;
`;

export const ScoreRow = observer((props: ScoreRowProps) => {
    const score = props.score;
    const user = props.score.userStats!.osuUser!;
    const beatmap = score.beatmap!;

    return (
        <ScoreRowWrapper beatmapSetId={beatmap.setId}>
            <LeftContainer>
                <PlayerInfo>
                    <Avatar src={`https://a.ppy.sh/${user.id}`} />
                    <FlagContainer>
                        <Flag countryCode={user.country} large />
                    </FlagContainer>
                    <Username>{user.username}</Username>
                </PlayerInfo>
                <BeatmapInfo>
                    <MetadataContainer>
                        <Title>{beatmap.title}</Title>
                        <Artist>
                            <small>by</small> {beatmap.artist}
                        </Artist>
                        <DifficultyName>
                            {beatmap.difficultyName}
                        </DifficultyName>
                    </MetadataContainer>
                    <ModsContainer>
                        <ModIcons small mods={score.modsJson} />
                    </ModsContainer>
                </BeatmapInfo>
            </LeftContainer>
            <ScoreInfo>
                <AccuracyContainer>
                    <Accuracy>
                        <NumberFormat
                            value={score.accuracy}
                            decimalPlaces={2}
                        />
                        %
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
            </ScoreInfo>
        </ScoreRowWrapper>
    );
});

interface ScoreRowProps {
    score: Score;
}

const ScoreChart = observer((props: ScoreChartProps) => {
    const total = props.players.reduce(
        (acc, player) => acc + player.ppContribution,
        0
    );
    const mainPlayers = props.players.filter(
        (player) => player.ppContribution / total > 0.01
    );
    const otherPlayers = props.players.filter(
        (player) => player.ppContribution / total <= 0.01
    );
    const otherPlayersContribution = otherPlayers.reduce(
        (acc, player) => acc + player.ppContribution,
        0
    );
    const data = mainPlayers
        .sort((a, b) => b.ppContribution - a.ppContribution)
        .map((player) => ({
            name: player.user.username,
            value: player.ppContribution,
        }));

    if (otherPlayersContribution > 0) {
        data.push({
            name: "Others",
            value: otherPlayersContribution,
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
                />
            </PieChart>
        </ResponsiveContainer>
    );
});

interface ScoreChartProps {
    teamColour: string;
    players: PPRacePlayer[];
}

const TeamDetails = observer((props: TeamDetailsProps) => {
    const team = props.team;
    const scores = props.scores;

    return (
        <TeamDetailsWrapper>
            <TeamTitle teamColour={props.teamColour}>{team.name}</TeamTitle>
            <TeamScores>
                {scores.slice(0, 3).map((score) => (
                    <ScoreRow key={score.id} score={score} />
                ))}
                {team.scoreCount > 3 && (
                    <ScoreCount>
                        ...and {team.scoreCount - 3} more scores
                    </ScoreCount>
                )}
            </TeamScores>
            <ScoreChartContainer>
                <ScoreChart
                    teamColour={props.teamColour}
                    players={team.players}
                />
            </ScoreChartContainer>
            <TeamTotal teamColour={props.teamColour}>
                <NumberFormat value={team.totalPp} decimalPlaces={0} />
                pp
            </TeamTotal>
        </TeamDetailsWrapper>
    );
});

interface TeamDetailsProps {
    team: PPRaceTeam;
    scores: Score[];
    teamColour: string;
}

export default TeamDetails;
