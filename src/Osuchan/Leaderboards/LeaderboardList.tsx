import React, { useEffect, useContext } from "react";
import { observer } from "mobx-react-lite";

import { StoreContext } from "../../store";
import GlobalLeaderboards from "./GlobalLeaderboards";
import CommunityLeaderboards from "./CommunityLeaderboards";
import { LoadingPage, BottomScrollDetector } from "../../components";
import { Gamemode } from "../../store/models/common/enums";

const LeaderboardList = () => {
    const store = useContext(StoreContext);
    const listStore = store.leaderboardsStore.listStore;

    // use effect to fetch leaderboards data
    const { loadLeaderboards } = listStore;
    useEffect(() => {
        loadLeaderboards(Gamemode.Standard);
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

    const globalLeaderboards = listStore.globalLeaderboards;
    const communityLeaderboards = listStore.communityLeaderboards;

    const loadNextCommunityLeaderboardPage = () => {
        if (!listStore.communityLeaderboardPagesEnded && !listStore.isLoadingCommunityLeaderboardPage) {
            listStore.loadNextCommunityLeaderboardPage(Gamemode.Standard);
        }
    }

    return (
        <>
            {listStore.isLoading ? (
                <LoadingPage />
            ) : (
                <>
                    {/* Global leaderboards */}
                    <GlobalLeaderboards leaderboards={globalLeaderboards} />

                    {/* Community leaderboards */}
                    <BottomScrollDetector onBottomScrolled={loadNextCommunityLeaderboardPage}>
                        <CommunityLeaderboards leaderboards={communityLeaderboards} />
                    </BottomScrollDetector>
                </>
            )}
        </>
    );
}

export default observer(LeaderboardList);
