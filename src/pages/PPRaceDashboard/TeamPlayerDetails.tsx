import { observer } from "mobx-react-lite";
import { PPRacePlayer } from "../../store/models/ppraces/types";
import styled from "styled-components";
import { Flag, NumberFormat, Row } from "../../components";
import { Pie, PieChart, ResponsiveContainer } from "recharts";

const TeamPlayers = styled.div`
    display: flex;
    flex-direction: column;
    height: 26em;
`;

const PlayerRowWrapper = styled(Row)<{ teamColour: string }>`
    padding: 0;
    align-items: unset;
    background-color: ${(props) => props.teamColour + "77"};
    font-size: 0.9em;
`;

const PlayerCount = styled.div`
    text-align: center;
    background-color: rgba(0, 0, 0, 0.25);
    padding: 10px;
    border-radius: 5px;
`;

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
    width: 7em;
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
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin: 1em;
    align-text: right;
    font-size: 1.2em;
`;

const PerformanceContribution = styled.span`
    font-size: 1.6em;
    margin-bottom: 0.3em;
`;

const ContributionText = styled.span`
    font-size: 0.7em;
`;

const ScoreCount = styled.span`
    font-size: 1em;
    text-align: right;
`;

const PlayerChartContainer = styled.div`
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
            <LeftContainer>
                <PlayerInfo>
                    <Avatar src={`https://a.ppy.sh/${user.id}`} />
                    <FlagContainer>
                        <Flag countryCode={user.country} large />
                    </FlagContainer>
                    <Username>{user.username}</Username>
                </PlayerInfo>
            </LeftContainer>
            <PlayerInfo>
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
            </PlayerInfo>
        </PlayerRowWrapper>
    );
});

interface PlayerRowProps {
    teamColour: string;
    player: PPRacePlayer;
}

const PlayerChart = observer((props: PlayerChartProps) => {
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

interface PlayerChartProps {
    teamColour: string;
    players: PPRacePlayer[];
}

const TeamPlayerDetails = observer((props: TeamPlayerDetailsProps) => {
    const players = props.players
        .slice()
        .sort((a, b) => b.ppContribution - a.ppContribution);

    return (
        <>
            <TeamPlayers>
                {players.slice(0, 3).map((player) => (
                    <PlayerRow
                        key={player.id}
                        player={player}
                        teamColour={props.teamColour}
                    />
                ))}
                {players.length > 3 && (
                    <PlayerCount>
                        ...and {players.length - 3} more players
                    </PlayerCount>
                )}
            </TeamPlayers>
            <PlayerChartContainer>
                <PlayerChart teamColour={props.teamColour} players={players} />
            </PlayerChartContainer>
        </>
    );
});

interface TeamPlayerDetailsProps {
    teamColour: string;
    players: PPRacePlayer[];
}

export default TeamPlayerDetails;
