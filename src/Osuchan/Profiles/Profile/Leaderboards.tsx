import { useState } from "react";
import { observer } from "mobx-react-lite";
import styled from "styled-components";

import {
    Surface,
    SurfaceTitle,
    UnstyledLink,
    Button,
    SurfaceHeaderContainer,
    ButtonGroup,
    LoadingSection,
    GlobalLeaderboardRow,
    CommunityLeaderboardRow,
} from "../../../components";
import { formatGamemodeNameShort } from "../../../utils/formatting";
import { PaginatedResourceStatus } from "../../../store/status";
import { hasFlag } from "../../../utils/general";
import { useStore } from "../../../utils/hooks";

const LeaderboardsSurface = styled(Surface)`
    padding: 20px;
    grid-area: leaderboards;
`;

const Leaderboards = observer(() => {
    const store = useStore();
    const usersStore = store.usersStore;

    const globalMemberships = usersStore.globalMemberships;
    const communityMemberships = usersStore.communityMemberships;

    const [leaderboardType, setLeaderboardType] = useState<
        "global" | "community"
    >("global");

    const handleGlobalClick = () => setLeaderboardType("global");
    const handleCommunityClick = () => {
        setLeaderboardType("community");
        if (
            usersStore.communityMembershipsStatus ===
            PaginatedResourceStatus.NotLoaded
        ) {
            usersStore.loadCommunityMemberships();
        }
    };

    return (
        <LeaderboardsSurface>
            <SurfaceHeaderContainer>
                <SurfaceTitle>Leaderboards</SurfaceTitle>
                <ButtonGroup>
                    <Button
                        $active={leaderboardType === "global"}
                        action={handleGlobalClick}
                    >
                        Global
                    </Button>
                    <Button
                        $active={leaderboardType === "community"}
                        action={handleCommunityClick}
                    >
                        Community
                    </Button>
                </ButtonGroup>
            </SurfaceHeaderContainer>
            {leaderboardType === "global" &&
                globalMemberships.map((membership, i) => (
                    <UnstyledLink
                        key={i}
                        to={`/leaderboards/global/${formatGamemodeNameShort(
                            membership.leaderboard!.gamemode
                        )}/${membership.leaderboardId}/members/${
                            membership.osuUserId
                        }`}
                    >
                        <GlobalLeaderboardRow
                            leaderboard={membership.leaderboard!}
                            membership={membership}
                        />
                    </UnstyledLink>
                ))}
            {leaderboardType === "community" && (
                <>
                    {hasFlag(
                        usersStore.communityMembershipsStatus,
                        PaginatedResourceStatus.ContentAvailable
                    ) && (
                        <>
                            {communityMemberships.map((membership, i) => (
                                <UnstyledLink
                                    key={i}
                                    to={`/leaderboards/community/${formatGamemodeNameShort(
                                        membership.leaderboard!.gamemode
                                    )}/${membership.leaderboardId}/members/${
                                        membership.osuUserId
                                    }`}
                                >
                                    <CommunityLeaderboardRow
                                        leaderboard={membership.leaderboard!}
                                        membership={membership}
                                    />
                                </UnstyledLink>
                            ))}
                            {hasFlag(
                                usersStore.communityMembershipsStatus,
                                PaginatedResourceStatus.MoreToLoad
                            ) && (
                                <Button
                                    fullWidth
                                    isLoading={
                                        usersStore.communityMembershipsStatus ===
                                        PaginatedResourceStatus.LoadingMore
                                    }
                                    action={() =>
                                        usersStore.loadNextCommunityMembershipsPage()
                                    }
                                >
                                    Load More
                                </Button>
                            )}
                            {communityMemberships.length === 0 && (
                                <p>
                                    This user has not joined any community
                                    leaderboards yet...
                                </p>
                            )}
                        </>
                    )}
                    {usersStore.communityMembershipsStatus ===
                        PaginatedResourceStatus.LoadingInitial && (
                        <LoadingSection />
                    )}
                </>
            )}
        </LeaderboardsSurface>
    );
});

export default Leaderboards;
