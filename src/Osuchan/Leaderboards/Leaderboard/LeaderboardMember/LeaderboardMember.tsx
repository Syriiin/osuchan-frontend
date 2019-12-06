import React, { useEffect, useContext } from "react";
import { RouteComponentProps } from "react-router";
import { observer } from "mobx-react-lite";
import styled from "styled-components";

import { StoreContext } from "../../../../store";
import { OsuUser } from "../../../../store/models/profiles/types";
import Scores from "./Scores";
import UserInfo from "./UserInfo";
import MemberInfo from "./MemberInfo";

const LeaderboardMemberGrid = styled.div`
    margin: 20px auto;
    width: 1000px;
    display: grid;
    gap: 20px;
    grid-template-columns: repeat(2, 1fr);
    grid-template-areas:
        "userinfo memberinfo"
        "scores scores";
`;

function LeaderboardUser(props: LeaderboardUserProps) {
    const store = useContext(StoreContext);
    const userStore = store.leaderboardsStore.userStore;

    // use effect to fetch user data
    const leaderboardId = parseInt(props.match.params.leaderboardId);
    const userId = parseInt(props.match.params.userId);
    const { loadUser } = userStore;
    useEffect(() => {
        loadUser(leaderboardId, userId);
    }, [loadUser, leaderboardId, userId]);

    const membership = userStore.membership;
    const osuUser = membership ? membership.osuUser as OsuUser : null;

    // use effect to update title
    const { isLoading } = userStore;
    useEffect(() => {
        if (isLoading) {
            document.title = "Loading...";
        } else if (osuUser) {
            document.title = `${osuUser.username} - osu!chan`;
        } else {
            document.title = "User not found - osu!chan";
        }
    }, [isLoading, osuUser]);

    return (
        <>
            {userStore.isLoading && (
                <>
                    {/* Loading spinner */}
                    Loading...
                </>
            )}
            {membership && osuUser && (
                <LeaderboardMemberGrid>
                    {/* User Info */}
                    <UserInfo osuUser={membership.osuUser as OsuUser} />

                    {/* Member Info */}
                    <MemberInfo membership={membership} />

                    {/* Scores */}
                    <Scores scores={userStore.scores} />
                </LeaderboardMemberGrid>
            )}
            {!userStore.isLoading && !osuUser && (
                <h3>Leaderboard user not found!</h3>
            )}
        </>
    );
}

interface RouteParams {
    userId: string;
    leaderboardId: string;
}

interface LeaderboardUserProps extends RouteComponentProps<RouteParams> {}

export default observer(LeaderboardUser);
