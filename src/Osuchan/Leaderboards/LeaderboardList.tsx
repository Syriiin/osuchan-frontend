import React, { useEffect, useContext } from "react";
import { observer } from "mobx-react-lite";

import { StoreContext } from "../../store";
import GlobalLeaderboards from "./GlobalLeaderboards";
import CommunityLeaderboards from "./CommunityLeaderboards";
import { LeaderboardAccessType } from "../../store/models/leaderboards/enums";
import { LoadingPage } from "../../components";

const LeaderboardList = () => {
    const store = useContext(StoreContext);
    const listStore = store.leaderboardsStore.listStore;

    // use effect to fetch leaderboards data
    const { loadLeaderboards } = listStore;
    useEffect(() => {
        loadLeaderboards();
    }, [loadLeaderboards]);

    // use effect to update title
    const { isLoading } = listStore;
    useEffect(() => {
        if (isLoading) {
            document.title = "Loading...";
        } else {
            document.title = "Leaderboards - osu!chan";
        }
    }, [isLoading]);

    const leaderboards = listStore.leaderboards;
    const globalLeaderboards = leaderboards.filter(leaderboard => leaderboard.accessType === LeaderboardAccessType.Global);
    const communityLeaderboards = leaderboards.filter(leaderboard => leaderboard.accessType !== LeaderboardAccessType.Global);

    return (
        <>
            {listStore.isLoading ? (
                <LoadingPage />
            ) : (
                <>
                    {/* Global leaderboards */}
                    <GlobalLeaderboards leaderboards={globalLeaderboards} />

                    {/* Community leaderboards */}
                    <CommunityLeaderboards leaderboards={communityLeaderboards} />
                </>
            )}
        </>
    );
}

export default observer(LeaderboardList);
