import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { useParams } from "react-router";
import styled, { ThemeProvider } from "styled-components";
import { LoadingPage } from "../../components";
import { ResourceStatus } from "../../store/status";
import { useStore } from "../../utils/hooks";
import { gamemodeIdFromName } from "../../utils/osu";
import MemberRankings from "./MemberRankings";
import ScoreRankings from "./ScoreRankings";

const DashboardWrapper = styled.div`
    background-color: ${(props) => props.theme.colours.background};
    display: flex;
    flex-direction: column;
    height: 100vh;
    font-size: 4rem;
    overflow: hidden;
`;

const Header = styled.h1`
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1em;
    margin-bottom: 0;
`;

const LeaderboardIcon = styled.img`
    width: 1.5em;
    height: 1.5em;
    border-radius: 0.2em;
    margin-right: 0.5em;
`;

const RankingsContainer = styled.div`
    flex: 1;
    display: flex;
    margin: 0 1em;
    gap: 1em;
`;

const RankingTitle = styled.h2`
    font-size: 0.6em;
    text-align: center;
`;

const MemberRankingsContainer = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
`;

const ScoreRankingsContainer = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
`;

const LeaderboardDashboard = observer(() => {
    const params = useParams<RouteParams>();
    const leaderboardType = params.leaderboardType!;
    const gamemode = gamemodeIdFromName(params.gamemode);
    const leaderboardId = parseInt(params.leaderboardId!);

    const store = useStore();
    const detailStore = store.leaderboardsStore.detailStore;

    const { loadingStatus, leaderboard, rankings, leaderboardScores } = detailStore;

    useEffect(() => {
        void detailStore.loadLeaderboard(leaderboardType, gamemode, leaderboardId, true);
    }, [detailStore, leaderboardType, gamemode, leaderboardId]);

    useEffect(() => {
        const interval = setInterval(() => {
            void detailStore.reloadLeaderboard(true, true);
        }, 60 * 1000);
        return () => clearInterval(interval);
    }, [detailStore]);

    return (
        <>
            <title>
                {leaderboard
                    ? `${leaderboard.name} - osu!chan`
                    : loadingStatus === ResourceStatus.Loading
                      ? "Loading..."
                      : loadingStatus === ResourceStatus.Error
                        ? "Leaderboard not found - osu!chan"
                        : "osu!chan"}
            </title>
            {leaderboard === null && detailStore.loadingStatus === ResourceStatus.Loading && (
                <LoadingPage />
            )}

            {leaderboard === null && detailStore.loadingStatus === ResourceStatus.Error && (
                <h3>Leaderboard not found!</h3>
            )}

            {leaderboard && (
                <ThemeProvider
                    theme={(osuchanTheme) => {
                        const theme = osuchanTheme!;
                        return {
                            ...theme,
                            colours: {
                                ...theme.colours,
                                ...leaderboard.customColours,
                            },
                        };
                    }}
                >
                    <DashboardWrapper>
                        <Header>
                            <LeaderboardIcon src={leaderboard.iconUrl} />
                            {leaderboard.name}
                        </Header>
                        <RankingsContainer>
                            <MemberRankingsContainer>
                                <RankingTitle>Player Ranking</RankingTitle>
                                <MemberRankings memberships={rankings} />
                            </MemberRankingsContainer>
                            <ScoreRankingsContainer>
                                <RankingTitle>Score Ranking</RankingTitle>
                                <ScoreRankings scores={leaderboardScores} />
                            </ScoreRankingsContainer>
                        </RankingsContainer>
                    </DashboardWrapper>
                </ThemeProvider>
            )}
        </>
    );
});

interface RouteParams extends Record<string, string | undefined> {
    leaderboardType: "global" | "community";
    gamemode: "osu" | "taiko" | "catch" | "mania";
    leaderboardId: string;
}

export default LeaderboardDashboard;
