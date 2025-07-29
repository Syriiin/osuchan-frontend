import { observer } from "mobx-react-lite";
import { PPRacePlayer } from "../../store/models/ppraces/types";
import styled from "styled-components";
import { Flag, NumberFormat, Row } from "../../components";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

const TeamPlayerDetailsWrapper = styled.div`
    display: grid;
    grid-template-rows: 1fr 500px;
    grid-template-areas:
        "players"
        "chart";
    grid-gap: 10px;
    height: 100%;
`;

const TeamPlayers = styled.div`
    grid-area: players;
    display: flex;
    flex-direction: column;
    overflow: hidden;
`;

const PlayerRowWrapper = styled(Row)<{ teamColour: string }>`
    display: grid;
    grid-template-columns: 70px 1fr 200px;
    grid-template-areas: "rank player performance";
    grid-gap: 10px;
    padding: 10px;
    align-items: unset;
    background-color: ${(props) => props.teamColour + "77"};
    font-size: 0.9em;
    height: 60px;
`;

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
    font-size: 2em;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    max-width: 8em;
`;

const PerformanceContainer = styled.div`
    grid-area: performance;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-text: right;
    font-size: 0.8em;
`;

const PerformanceContribution = styled.span`
    font-size: 1.6em;
    margin-bottom: 0.3em;
    text-align: right;
`;

const ContributionText = styled.span`
    font-size: 0.7em;
`;

const ScoreCount = styled.span`
    font-size: 1em;
    text-align: right;
`;

const PlayerChartContainer = styled.div`
    grid-area: chart;
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 1;
`;

const PlayerRow = observer((props: PlayerRowProps) => {
    const player = props.player;
    const user = props.player.user;

    return (
        <PlayerRowWrapper teamColour={props.teamColour}>
            <Rank>#{props.rank}</Rank>
            <PlayerInfo>
                <Avatar src={`https://a.ppy.sh/${user.id}`} />
                <FlagContainer>
                    <Flag countryCode={user.country} large />
                </FlagContainer>
                <Username>{user.username}</Username>
            </PlayerInfo>
            <PerformanceContainer>
                <PerformanceContribution>
                    <NumberFormat
                        value={player.ppContribution}
                        decimalPlaces={0}
                    />
                    pp <ContributionText>contributed</ContributionText>
                </PerformanceContribution>
                <ScoreCount>
                    {player.scoreCount}{" "}
                    {player.scoreCount === 1 ? "score" : "scores"} /{" "}
                    <NumberFormat value={player.pp} decimalPlaces={0} />
                    pp total
                </ScoreCount>
            </PerformanceContainer>
        </PlayerRowWrapper>
    );
});

interface PlayerRowProps {
    teamColour: string;
    player: PPRacePlayer;
    rank: number;
}

const PlayerChart = observer((props: PlayerChartProps) => {
    const total = props.players.reduce(
        (acc, player) => acc + player.ppContribution,
        0
    );
    const mainPlayers = props.players.filter(
        (player) => player.ppContribution / total > 0.02
    );
    const otherPlayers = props.players.filter(
        (player) => player.ppContribution / total <= 0.02
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

interface PlayerChartProps {
    teamColour: string;
    players: PPRacePlayer[];
}

const TeamPlayerDetails = observer((props: TeamPlayerDetailsProps) => {
    const players = props.players
        .slice()
        .sort((a, b) => b.ppContribution - a.ppContribution);

    return (
        <TeamPlayerDetailsWrapper>
            <TeamPlayers>
                {players.slice(0, 20).map((player, i) => (
                    <PlayerRow
                        key={player.id}
                        player={player}
                        teamColour={props.teamColour}
                        rank={i + 1}
                    />
                ))}
            </TeamPlayers>
            <PlayerChartContainer>
                <PlayerChart teamColour={props.teamColour} players={players} />
            </PlayerChartContainer>
        </TeamPlayerDetailsWrapper>
    );
});

interface TeamPlayerDetailsProps {
    teamColour: string;
    players: PPRacePlayer[];
}

export default TeamPlayerDetails;
