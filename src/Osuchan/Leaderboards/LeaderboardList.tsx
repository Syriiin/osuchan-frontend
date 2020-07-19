import React, { useEffect, useContext, useState } from "react";
import { observer } from "mobx-react-lite";
import { useParams } from "react-router";
import styled from "styled-components";

import { StoreContext } from "../../store";
import GlobalLeaderboards from "./GlobalLeaderboards";
import CommunityLeaderboards from "./CommunityLeaderboards";
import { BottomScrollDetector, Surface, SurfaceHeaderContainer, SurfaceTitle, ButtonGroup, Button, UnstyledLink, Divider, SurfaceSubtitle, LoadingSection } from "../../components";
import { gamemodeIdFromName } from "../../utils/osu";
import JoinedLeaderboards from "./JoinedLeaderboards";
import CreateLeaderboardModal from "./CreateLeaderboardModal";
import { PaginatedResourceStatus } from "../../store/status";
import { hasFlag } from "../../utils/general";

const LeaderboardsSurface = styled(Surface)`
    margin: 20px auto;
    width: 1000px;
    padding: 20px;
`;

const SwitcherButtonGroup = styled(ButtonGroup)`
    margin-left: 5px;
`;

const LeaderboardList = observer(() => {
    const params = useParams<RouteParams>();
    const leaderboardType = params.leaderboardType;
    const gamemode = gamemodeIdFromName(params.gamemode);

    const store = useContext(StoreContext);
    const listStore = store.leaderboardsStore.listStore;
    const meStore = store.meStore;

    const { globalLeaderboards, globalMemberships, communityLeaderboards, communityMemberships, unload, loadGlobalLeaderboards, loadCommunityLeaderboards, loadCommunityMemberships } = listStore;
    const { user, isAuthenticated } = meStore;

    useEffect(() => {
        document.title = "Leaderboards - osu!chan";
        return () => {
            unload();
        }
    }, [unload]);

    useEffect(() => {
        unload();

        // Load community leaderboards
        if (leaderboardType === "community") {
            loadCommunityLeaderboards(gamemode);

            if (isAuthenticated) {
                loadCommunityMemberships(gamemode, user!.osuUserId);
            }
        }

        // Load global leaderboards
        if (leaderboardType === "global") {
            loadGlobalLeaderboards(gamemode, user?.osuUserId);
        }
    }, [isAuthenticated, user, leaderboardType, gamemode, unload, loadCommunityMemberships, loadGlobalLeaderboards, loadCommunityLeaderboards]);

    const loadNextGlobalLeaderboardPage = () => {
        if (listStore.globalLeaderboardsStatus === PaginatedResourceStatus.PartiallyLoaded) {
            listStore.loadNextGlobalLeaderboardsPage(user?.osuUserId);
        }
    }

    const loadNextCommunityLeaderboardPage = () => {
        if (listStore.communityLeaderboardsStatus === PaginatedResourceStatus.PartiallyLoaded) {
            listStore.loadNextCommunityLeaderboardsPage();
        }
    }

    const [createLeaderboardModalOpen, setCreateLeaderboardModalOpen] = useState(false);

    return (
        <LeaderboardsSurface>
            <SurfaceHeaderContainer>
                <SurfaceTitle>Leaderboards</SurfaceTitle>
                <SwitcherButtonGroup>
                    <UnstyledLink to={`../global/${params.gamemode}`}>
                        <Button active={params.leaderboardType === "global"}>Global</Button>
                    </UnstyledLink>
                    <UnstyledLink to={`../community/${params.gamemode}`}>
                        <Button active={params.leaderboardType === "community"}>Community</Button>
                    </UnstyledLink>
                </SwitcherButtonGroup>
                <SwitcherButtonGroup>
                    <UnstyledLink to={`../${params.leaderboardType}/osu`}>
                        <Button active={params.gamemode === "osu"}>osu!</Button>
                    </UnstyledLink>
                    <UnstyledLink to={`../${params.leaderboardType}/taiko`}>
                        <Button active={params.gamemode === "taiko"}>osu!taiko</Button>
                    </UnstyledLink>
                    <UnstyledLink to={`../${params.leaderboardType}/catch`}>
                        <Button active={params.gamemode === "catch"}>osu!catch</Button>
                    </UnstyledLink>
                    <UnstyledLink to={`../${params.leaderboardType}/mania`}>
                        <Button active={params.gamemode === "mania"}>osu!mania</Button>
                    </UnstyledLink>
                </SwitcherButtonGroup>
            </SurfaceHeaderContainer>
            
            {params.leaderboardType === "global" && (
                <>
                    {hasFlag(listStore.globalLeaderboardsStatus, PaginatedResourceStatus.ContentAvailable) && (
                        <>
                            {/* NOTE: ideally we want to defer loading leaderboards until we are logged in so we dont needlessly load the leaderboards and then memberships straight after */}
                            <BottomScrollDetector onBottomScrolled={loadNextGlobalLeaderboardPage}>
                                {globalMemberships.length > 0 ? (
                                    <GlobalLeaderboards memberships={globalMemberships} />
                                ) : (
                                    <GlobalLeaderboards leaderboards={globalLeaderboards} />
                                )}
                            </BottomScrollDetector>
                        </>
                    )}
                    {listStore.globalLeaderboardsStatus === PaginatedResourceStatus.LoadingInitial && (
                        <LoadingSection />
                    )}
                </>
            )}
            {params.leaderboardType === "community" && (
                <>
                    {isAuthenticated && (
                        <>
                            <SurfaceSubtitle>Joined Leaderboards</SurfaceSubtitle>
                            {hasFlag(listStore.communityMembershipsStatus, PaginatedResourceStatus.ContentAvailable) && (
                                <>
                                    <JoinedLeaderboards memberships={communityMemberships} />

                                    {hasFlag(listStore.communityMembershipsStatus, PaginatedResourceStatus.MoreToLoad) && (
                                        <Button fullWidth isLoading={listStore.communityMembershipsStatus === PaginatedResourceStatus.LoadingMore} action={() => listStore.loadNextCommunityMembershipsPage(user!.osuUserId)}>Load More</Button>
                                    )}

                                    {communityMemberships.length === 0 && (
                                        <p>You have not joined any community leaderboards yet...</p>
                                    )}

                                    <Divider spacingScale={5} />
                                </>
                            )}
                            {listStore.communityMembershipsStatus === PaginatedResourceStatus.LoadingInitial && (
                                <LoadingSection />
                            )}
                        </>
                    )}

                    <SurfaceHeaderContainer>
                        <SurfaceSubtitle>Popular Leaderboards</SurfaceSubtitle>
                        {user?.osuUser && (
                            <div>
                                <Button fullWidth action={() => setCreateLeaderboardModalOpen(true)}>Create New Leaderboard</Button>
                            </div>
                        )}
                    </SurfaceHeaderContainer>
                    {hasFlag(listStore.communityLeaderboardsStatus, PaginatedResourceStatus.ContentAvailable) && (
                        <BottomScrollDetector onBottomScrolled={loadNextCommunityLeaderboardPage}>
                            <CommunityLeaderboards leaderboards={communityLeaderboards} />
                        </BottomScrollDetector>
                    )}
                    {hasFlag(listStore.communityLeaderboardsStatus, PaginatedResourceStatus.Loading) && (
                        <LoadingSection />
                    )}
                    <CreateLeaderboardModal open={createLeaderboardModalOpen} onClose={() => setCreateLeaderboardModalOpen(false)} />
                </>
            )}
        </LeaderboardsSurface>
    );
});

interface RouteParams {
    leaderboardType: "global" | "community";
    gamemode: "osu" | "taiko" | "catch" | "mania";
}

export default LeaderboardList;
