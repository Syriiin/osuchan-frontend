import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import styled from "styled-components";
import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom";

import { gamemodeIdFromName } from "../../../utils/osu";
import UserInfo from "./UserInfo";
import ModeSwitcher from "./ModeSwitcher";
import SandboxControls from "./SandboxControls";
import RankInfo from "./RankInfo";
import ScoreStyle from "./ScoreStyle";
import ScoresChart from "./ScoresChart";
import Scores from "./Scores";
import Leaderboards from "./Leaderboards";
import { LoadingPage } from "../../../components";
import { ResourceStatus } from "../../../store/status";
import { useStore } from "../../../utils/hooks";

const ProfileGrid = styled.div`
    margin: 20px auto;
    width: 1000px;
    display: grid;
    gap: 20px;
    grid-template-columns: repeat(6, 1fr);
    grid-template-areas:
        "userinfo userinfo userinfo modeswitcher sandboxcontrols sandboxcontrols"
        "rankinfo rankinfo rankinfo scorestyle scorestyle scorestyle"
        "scoreschart scoreschart scoreschart scoreschart scoreschart scoreschart"
        "scores scores scores scores scores scores"
        "leaderboards leaderboards leaderboards leaderboards leaderboards leaderboards";
`;

const Profile = observer(() => {
    const params = useParams<RouteParams>();

    const store = useStore();
    const usersStore = store.usersStore;

    // use effect to fetch profile data
    const { userString } = params;
    const gamemodeId = gamemodeIdFromName(params.gamemodeName);
    useEffect(() => {
        usersStore.loadUser(userString, gamemodeId);
    }, [usersStore, userString, gamemodeId]);

    const userStats = usersStore.currentUserStats;
    const osuUser = userStats?.osuUser;
    const scores = usersStore.scores;
    const sandboxScores = usersStore.sandboxScores;

    // use effect to update title
    const { loadingStatus } = usersStore;

    const [sandboxMode, setSandboxMode] = useState(false);

    return (
        <>
            <Helmet>
                {loadingStatus === ResourceStatus.Loading && (
                    <title>Loading...</title>
                )}
                {loadingStatus === ResourceStatus.Loaded && osuUser && (
                    <title>{osuUser.username} - osu!chan</title>
                )}
                {loadingStatus === ResourceStatus.Error && (
                    <title>User not found - osu!chan</title>
                )}
            </Helmet>

            {usersStore.loadingStatus === ResourceStatus.Loading && (
                <LoadingPage />
            )}
            {userStats && osuUser && (
                <ProfileGrid>
                    {/* User info */}
                    <UserInfo osuUser={osuUser} />

                    {/* Mode switcher */}
                    <ModeSwitcher
                        gamemodeId={gamemodeId}
                        userString={params.userString}
                    />

                    {/* Sandbox controls */}
                    <SandboxControls
                        gamemode={userStats.gamemode}
                        sandboxMode={sandboxMode}
                        setSandboxMode={setSandboxMode}
                    />

                    {/* PP/rank info */}
                    <RankInfo
                        osuUser={osuUser}
                        userStats={userStats}
                        sandboxMode={sandboxMode}
                    />

                    {/* Score style */}
                    <ScoreStyle
                        userStats={userStats}
                        sandboxMode={sandboxMode}
                    />

                    {scores.length > 0 && (
                        <>
                            {/* Scores */}
                            <ScoresChart
                                scores={scores}
                                sandboxScores={sandboxScores}
                                sandboxMode={sandboxMode}
                            />

                            {/* Scores */}
                            <Scores
                                scores={sandboxMode ? sandboxScores : scores}
                                gamemode={userStats.gamemode}
                                sandboxMode={sandboxMode}
                            />

                            {sandboxMode || (
                                <>
                                    {/* Leaderboards */}
                                    <Leaderboards />
                                </>
                            )}
                        </>
                    )}
                </ProfileGrid>
            )}
            {loadingStatus === ResourceStatus.Error && <h3>User not found!</h3>}
        </>
    );
});

interface RouteParams {
    userString: string;
    gamemodeName?: string;
}

export default Profile;
