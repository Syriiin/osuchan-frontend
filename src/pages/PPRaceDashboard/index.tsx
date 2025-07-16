import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { LoadingPage, Surface } from "../../components";
import { ResourceStatus } from "../../store/status";
import { useStore } from "../../utils/hooks";
import RecentScoreRow from "./RecentScoreRow";
import PPChart from "./PPChart";
import Countdown from "./Countdown";
import TeamDetails from "./TeamDetails";

export const TeamColours = [
    "#a34c4c", // Red
    "#4c6aa3", // Blue
    "#4fa34c", // Green
    "#9da34c", // Yellow
];

const DashboardWrapper = styled.div`
    background-color: ${(props) => props.theme.colours.background};
    display: grid;
    grid-template-columns: 1fr 5fr 1fr;
    grid-template-rows: 1fr;
    grid-template-areas: "chart teams rightContainer";
    grid-gap: 10px;
    padding: 10px;
    height: 100vh;
    overflow: hidden;
`;

const ChartSurface = styled(Surface)`
    grid-area: chart;
    padding: 10px;
`;

const TeamDetailsContainer = styled.div`
    display: flex;
    grid-area: teams;
    gap: 10px;
`;

const TeamSurface = styled(Surface)<{ teamColour: string }>`
    flex: 1;
    padding: 10px;
    border: 5px solid ${(props) => props.teamColour};
    background-color: ${(props) => props.teamColour + "33"};
    display: flex;
`;

const RightContainer = styled.div`
    grid-area: rightContainer;
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

const CountdownSurface = styled(Surface)`
    padding: 10px;
    text-align: center;
    font-size: 3em;
    font-family: "Courier New", Courier, monospace;
    font-weight: bold;
`;

const RecentScoresSurface = styled(Surface)`
    padding: 10px;
    flex: 1;
`;

const PPRaceDashboard = observer(() => {
    const params = useParams<RouteParams>();
    const ppraceId = parseInt(params.ppraceId);

    const store = useStore();
    const detailStore = store.ppracesStore.detailStore;

    const { loadingStatus, pprace, teamScores, recentScores } = detailStore;

    useEffect(() => {
        detailStore.loadPPRace(ppraceId);
    }, [detailStore, ppraceId]);

    useEffect(() => {
        const interval = setInterval(() => {
            detailStore.reloadPPRace();
        }, 30 * 1000);
        return () => clearInterval(interval);
    }, [detailStore]);

    return (
        <>
            <Helmet>
                {loadingStatus === ResourceStatus.Loading && (
                    <title>Loading...</title>
                )}
                {loadingStatus === ResourceStatus.Loaded && pprace && (
                    <title>{pprace.name} - osu!chan</title>
                )}
                {loadingStatus === ResourceStatus.Error && (
                    <title>PP Race not found - osu!chan</title>
                )}
            </Helmet>

            {detailStore.loadingStatus === ResourceStatus.Loading && (
                <LoadingPage />
            )}

            {detailStore.loadingStatus === ResourceStatus.Error && (
                <h3>PP Race not found!</h3>
            )}

            {detailStore.loadingStatus === ResourceStatus.Loaded && pprace && (
                <DashboardWrapper>
                    <ChartSurface>
                        <PPChart teams={pprace.teams} />
                    </ChartSurface>
                    <TeamDetailsContainer>
                        {pprace.teams.map((team, index) => (
                            <TeamSurface
                                teamColour={TeamColours[index]}
                                key={team.id}
                            >
                                <TeamDetails
                                    team={team}
                                    scores={teamScores[team.id]}
                                    teamColour={TeamColours[index]}
                                ></TeamDetails>
                            </TeamSurface>
                        ))}
                    </TeamDetailsContainer>
                    <RightContainer>
                        <CountdownSurface>
                            <Countdown endTime={pprace.endTime ?? undefined} />
                        </CountdownSurface>
                        <RecentScoresSurface>
                            {recentScores.slice(0, 20).map((score) => {
                                const team = pprace.teams.find((t) =>
                                    t.players.some(
                                        (p) =>
                                            p.user.id ===
                                            score.userStats!.osuUserId
                                    )
                                );
                                return (
                                    <RecentScoreRow
                                        key={score.id}
                                        score={score}
                                        teamColour={
                                            TeamColours[
                                                pprace.teams.indexOf(team!)
                                            ]
                                        }
                                    />
                                );
                            })}
                        </RecentScoresSurface>
                    </RightContainer>
                </DashboardWrapper>
            )}
        </>
    );
});

interface RouteParams {
    ppraceId: string;
}

export default PPRaceDashboard;
