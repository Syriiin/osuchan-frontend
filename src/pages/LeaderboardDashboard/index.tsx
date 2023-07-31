import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { LoadingPage } from "../../components";
import { ResourceStatus } from "../../store/status";
import { useStore } from "../../utils/hooks";
import { gamemodeIdFromName } from "../../utils/osu";
import MemberRankings from "./MemberRankings";
import ScoreRankings from "./ScoreRankings";

const DashboardWrapper = styled.div`
    display: flex;
    flex-direction: column;
    height: 100vh;
    font-size: 4rem;
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
    const leaderboardType = params.leaderboardType;
    const gamemode = gamemodeIdFromName(params.gamemode);
    const leaderboardId = parseInt(params.leaderboardId);

    const store = useStore();
    const detailStore = store.leaderboardsStore.detailStore;

    const { loadingStatus, leaderboard, rankings, leaderboardScores } = detailStore;

    useEffect(() => {
        detailStore.loadLeaderboard(leaderboardType, gamemode, leaderboardId, true);
    }, [detailStore, leaderboardType, gamemode, leaderboardId]);

    useEffect(() => {
        const interval = setInterval(() => {
            detailStore.reloadLeaderboard(true);
        }, 5 * 60 * 1000);
        return () => clearInterval(interval);
      }, [detailStore]);

    return (
        <>
            <Helmet>
                {loadingStatus === ResourceStatus.Loading && (
                    <title>Loading...</title>
                )}
                {loadingStatus === ResourceStatus.Loaded && leaderboard && (
                    <title>{leaderboard.name} - osu!chan</title>
                )}
                {loadingStatus === ResourceStatus.Error && (
                    <title>Leaderboard not found - osu!chan</title>
                )}
            </Helmet>

            {detailStore.loadingStatus === ResourceStatus.Loading && (
                <LoadingPage />
            )}

            
            {detailStore.loadingStatus === ResourceStatus.Error && (
                <h3>Leaderboard not found!</h3>
            )}

            {leaderboard && (
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
            )}
        </>
    );
});

interface RouteParams {
    leaderboardType: "global" | "community";
    gamemode: "osu" | "taiko" | "catch" | "mania";
    leaderboardId: string;
}

export default LeaderboardDashboard;
