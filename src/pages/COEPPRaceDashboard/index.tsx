import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { LoadingPage, Surface } from "../../components";
import { ResourceStatus } from "../../store/status";
import { useStore } from "../../utils/hooks";
import PPChart from "./PPChart";
import Countdown from "./Countdown";
import TeamDetails from "./TeamDetails";
import RecentScores from "./RecentScores";
import { PPRaceStatus } from "../../store/models/ppraces/enums";

export const TeamColours = [
    "#db202b", // Red
    "#1e55dc", // Blue
    // "#4fa34c", // Green
    // "#9da34c", // Yellow
];

const DashboardWrapper = styled.div`
    display: grid;
    grid-template-columns: 1fr 400px;
    grid-template-rows: 1fr 150px;
    grid-template-areas:
        "teams rightContainer"
        "chart rightContainer";
    grid-gap: 10px;
    padding: 10px;
    height: 100vh;
    overflow: hidden;

    @font-face {
        font-family: "Sui Generis";
        src: url("/static/fonts/Sui Generis Regular.ttf") format("truetype");
        font-weight: normal;
        font-style: normal;
    }

    font-family: "Sui Generis", sans-serif;
`;

const ChartSurface = styled(Surface)`
    grid-area: chart;
    padding: 10px;
    background-color: transparent;
`;

const TeamDetailsContainer = styled.div`
    display: flex;
    grid-area: teams;
    gap: 10px;
    overflow: hidden;
`;

const TeamSurface = styled(Surface)<{
    teamColour: string;
    teamDarkColour?: string;
}>`
    flex: 1;
    padding: 5px;
    border: 5px solid ${(props) => props.teamColour};
    background-color: transparent;
    display: flex;
`;

const RightContainer = styled.div`
    grid-area: rightContainer;
    display: flex;
    flex-direction: column;
`;

const CountdownSurface = styled(Surface)`
    padding: 10px;
    text-align: center;
    font-size: 3em;
    font-variant-numeric: tabular-nums;
    height: 2em;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: transparent;
`;

const Finalising = styled.span`
    font-size: 0.6em;
`;

const COEPPRaceDashboard = observer(() => {
    useEffect(() => {
        const original = document.body.style.backgroundColor;
        document.body.style.backgroundColor = "transparent";

        return () => {
            document.body.style.backgroundColor = original;
        };
    }, []);

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
        }, 15 * 1000);
        return () => clearInterval(interval);
    }, [detailStore]);

    const [teamDetailsMode, setTeamDetailsMode] = useState<
        "players" | "scores"
    >("scores");

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
                    <TeamDetailsContainer
                        onClick={() => {
                            setTeamDetailsMode(
                                teamDetailsMode === "players"
                                    ? "scores"
                                    : "players"
                            );
                        }}
                    >
                        {pprace.teams.map((team, index) => (
                            <TeamSurface
                                teamColour={TeamColours[index]}
                                key={team.id}
                            >
                                <TeamDetails
                                    team={team}
                                    scores={teamScores[team.id]}
                                    teamColour={TeamColours[index]}
                                    mode={teamDetailsMode}
                                    ppDecayBase={pprace.ppDecayBase}
                                ></TeamDetails>
                            </TeamSurface>
                        ))}
                    </TeamDetailsContainer>
                    <RightContainer>
                        <CountdownSurface>
                            {pprace.status === PPRaceStatus.InProgress && (
                                <Countdown
                                    endTime={pprace.endTime ?? undefined}
                                />
                            )}
                            {pprace.status === PPRaceStatus.WaitingToStart && (
                                <Countdown
                                    endTime={pprace.startTime ?? undefined}
                                />
                            )}
                            {pprace.status === PPRaceStatus.Finalising && (
                                <Finalising>Finalising scores...</Finalising>
                            )}
                            {pprace.status === PPRaceStatus.Finished && (
                                <Countdown
                                    endTime={pprace.endTime ?? undefined}
                                />
                            )}
                        </CountdownSurface>
                        <RecentScores
                            recentScores={recentScores}
                            teams={pprace.teams}
                        />
                    </RightContainer>
                </DashboardWrapper>
            )}
        </>
    );
});

interface RouteParams {
    ppraceId: string;
}

export default COEPPRaceDashboard;
