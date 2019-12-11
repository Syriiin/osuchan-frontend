import React, { useEffect, useContext, useState } from "react";
import { RouteComponentProps } from "react-router";
import { observer } from "mobx-react-lite";
import styled from "styled-components";

import { StoreContext } from "../../../store";
import { gamemodeIdFromName } from "../../../utils/osu";
import { OsuUser } from "../../../store/models/profiles/types";
import UserInfo from "./UserInfo";
import ModeSwitcher from "./ModeSwitcher";
import SandboxControls from "./SandboxControls";
import RankInfo from "./RankInfo";
import ScoreStyle from "./ScoreStyle";
import Scores from "./Scores";
import Leaderboards from "./Leaderboards";
import { LoadingPage } from "../../../components";

const ProfileGrid = styled.div`
    margin: 20px auto;
    width: 1000px;
    display: grid;
    gap: 20px;
    grid-template-columns: repeat(6, 1fr);
    grid-template-areas:
        "userinfo userinfo userinfo modeswitcher sandboxcontrols sandboxcontrols"
        "rankinfo rankinfo rankinfo scorestyle scorestyle scorestyle"
        "scores scores scores scores scores scores"
        "leaderboards leaderboards leaderboards leaderboards leaderboards leaderboards"
        "trainingcourses trainingcourses trainingcourses trainingcourses trainingcourses trainingcourses";
`;

function Profile(props: ProfileProps) {
    const store = useContext(StoreContext);
    const usersStore = store.usersStore;

    // use effect to fetch profile data
    const { loadUser } = usersStore;
    const { userString } = props.match.params;
    const gamemodeId = gamemodeIdFromName(props.match.params.gamemodeName);
    useEffect(() => {
        loadUser(userString, gamemodeId);
    }, [loadUser, userString, gamemodeId]);

    const userStats = usersStore.currentUserStats;
    const osuUser = userStats && userStats.osuUser as OsuUser;
    const scores = usersStore.scores;
    const sandboxScores = usersStore.sandboxScores;
    const leaderboards = usersStore.leaderboards;

    // use effect to update title
    const { isLoading } = usersStore;
    useEffect(() => {
        if (isLoading) {
            document.title = "Loading...";
        } else if (osuUser) {
            document.title = `${osuUser.username} - osu!chan`;
        } else {
            document.title = "User not found - osu!chan";
        }
    }, [isLoading, osuUser]);

    const [sandboxMode, setSandboxMode] = useState(false);

    return (
        <>
            {usersStore.isLoading && (
                <LoadingPage />
            )}
            {userStats && osuUser && (
                <ProfileGrid>
                    {/* User info */}
                    <UserInfo osuUser={osuUser} />

                    {/* Mode switcher */}
                    <ModeSwitcher gamemodeId={gamemodeId} userString={props.match.params.userString} />

                    {/* Sandbox controls */}
                    <SandboxControls sandboxMode={sandboxMode} setSandboxMode={setSandboxMode} />

                    {/* PP/rank info */}
                    <RankInfo osuUser={osuUser} userStats={userStats} sandboxMode={sandboxMode} />

                    {/* Score style */}
                    <ScoreStyle userStats={userStats} sandboxMode={sandboxMode} />

                    {/* Scores */}
                    <Scores scores={sandboxMode ? sandboxScores : scores} gamemode={userStats.gamemode} sandboxMode={sandboxMode} />
                    
                    {sandboxMode || (
                        <>
                            {/* Community Leaderboards */}
                            <Leaderboards leaderboards={leaderboards} />
                        </>
                    )}
                </ProfileGrid>
            )}
            {!usersStore.isLoading && !osuUser && (
                <h3>User not found!</h3>
            )}
        </>
    );
}

interface RouteParams {
    userString: string;
    gamemodeName?: string;
}

interface ProfileProps extends RouteComponentProps<RouteParams> {}

export default observer(Profile);
