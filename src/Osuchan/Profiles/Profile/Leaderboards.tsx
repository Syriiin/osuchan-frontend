import React, { useContext, useState } from "react";
import { observer } from "mobx-react-lite";
import styled from "styled-components";

import { Surface, SurfaceTitle, UnstyledLink, Row, Button, SurfaceHeaderContainer, LoadingSpinner } from "../../../components";
import { Membership } from "../../../store/models/leaderboards/types";
import { LeaderboardAccessType } from "../../../store/models/leaderboards/enums";
import { StoreContext } from "../../../store";

const LeaderboardsSurface = styled(Surface)`
    padding: 20px;
    grid-area: leaderboards;
`;

const TypeSwitcherButton = styled(Button)`
    margin-left: 5px;
`;

const LoadingContainer = styled.div`
    text-align: center;
    margin: 50px 0;
`;

const LeaderboardIconContainer = styled.div`
    height: 86px;
    display: flex;
    align-items: center;
`;

const LeaderboardIcon = styled.img`
    border-radius: 5px;
    width: 86px;
`;

const LeaderboardTitleContainer = styled.div`
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    margin-left: 10px;
`;

const LeaderboardTitle = styled.span`
    font-size: 1.5em;
`;

const LeaderboardType = styled.span`
    font-size: 0.8em;
    color: ${props => props.theme.colours.mango};
`;

const LeaderboardSubtitle = styled.span`
    color: ${props => props.theme.colours.timber};
`;

const MembershipInfoContainer = styled.div`
    margin-right: 10px;
    text-align: right;
`;

const MembershipPerformance = styled.div`

`;

const MembershipRank = styled.div`
    font-size: 2em;
`;

const GlobalLeaderboardRow = (props: GlobalLeaderboardRowProps) => (
    <Row hoverable>
        <LeaderboardIconContainer>
            <LeaderboardIcon src={props.membership.leaderboard!.iconUrl} />
        </LeaderboardIconContainer>
        <LeaderboardTitleContainer>
            <LeaderboardTitle>{props.membership.leaderboard!.name}</LeaderboardTitle>
            <LeaderboardType>
                {props.membership.leaderboard!.accessType === LeaderboardAccessType.Public && "PUBLIC"}
                {props.membership.leaderboard!.accessType === LeaderboardAccessType.PublicInviteOnly && "INVITE-ONLY"}
                {props.membership.leaderboard!.accessType === LeaderboardAccessType.Private && "PRIVATE"}
            </LeaderboardType>
            <LeaderboardSubtitle>{props.membership.leaderboard!.description}</LeaderboardSubtitle>
        </LeaderboardTitleContainer>
        <MembershipInfoContainer>
            <MembershipRank>
                #{props.membership.rank}
            </MembershipRank>
            <MembershipPerformance>
                {props.membership.pp.toLocaleString("en", { maximumFractionDigits: 0 })}pp
            </MembershipPerformance>
        </MembershipInfoContainer>
    </Row>
);

interface GlobalLeaderboardRowProps {
    membership: Membership;
}

const CommunityLeaderboardRow = (props: CommunityLeaderboardRowProps) => (
    <Row hoverable>
        <LeaderboardIconContainer>
            <LeaderboardIcon src={props.membership.leaderboard!.iconUrl || `https://a.ppy.sh/${props.membership.leaderboard!.owner!.id}`} />
        </LeaderboardIconContainer>
        <LeaderboardTitleContainer>
            <LeaderboardTitle>{props.membership.leaderboard!.name}</LeaderboardTitle>
            <LeaderboardType>
                {props.membership.leaderboard!.accessType === LeaderboardAccessType.Public && "PUBLIC"}
                {props.membership.leaderboard!.accessType === LeaderboardAccessType.PublicInviteOnly && "INVITE-ONLY"}
                {props.membership.leaderboard!.accessType === LeaderboardAccessType.Private && "PRIVATE"}
            </LeaderboardType>
            <LeaderboardSubtitle>{props.membership.leaderboard!.memberCount} members</LeaderboardSubtitle>
        </LeaderboardTitleContainer>
        <MembershipInfoContainer>
            <MembershipRank>
                #{props.membership.rank}
            </MembershipRank>
            <MembershipPerformance>
                {props.membership.pp.toLocaleString("en", { maximumFractionDigits: 0 })}pp
            </MembershipPerformance>
        </MembershipInfoContainer>
    </Row>
);

interface CommunityLeaderboardRowProps {
    membership: Membership;
}

const Leaderboards = observer(() => {
    const store = useContext(StoreContext);
    const usersStore = store.usersStore;

    const globalMemberships = usersStore.globalMemberships;
    const communityMemberships = usersStore.communityMemberships;

    const [leaderboardType, setLeaderboardType] = useState<"global" | "community">("global");

    const handleGlobalClick = () => setLeaderboardType("global");
    const handleCommunityClick = () => {
        setLeaderboardType("community");
        if (!usersStore.communityMembershipsLoaded) {
            usersStore.loadCommunityMemberships();
        }
    }

    return (
        <LeaderboardsSurface>
            <SurfaceHeaderContainer>
                <SurfaceTitle>Leaderboards</SurfaceTitle>
                <div>
                    <TypeSwitcherButton active={leaderboardType === "global"} action={handleGlobalClick}>Global</TypeSwitcherButton>
                    <TypeSwitcherButton active={leaderboardType === "community"} action={handleCommunityClick}>Community</TypeSwitcherButton>
                </div>
            </SurfaceHeaderContainer>
            {leaderboardType === "global" && globalMemberships.map((membership, i) => (
                <UnstyledLink key={i} to={`/leaderboards/${membership.leaderboardId}`}>
                    <GlobalLeaderboardRow membership={membership} />
                </UnstyledLink>
            ))}
            {leaderboardType === "community" && (
                <>
                    {communityMemberships.map((membership, i) => (
                        <UnstyledLink key={i} to={`/leaderboards/${membership.leaderboardId}`}>
                            <CommunityLeaderboardRow membership={membership} />
                        </UnstyledLink>
                    ))}
                    {usersStore.isLoadingCommunityMemberships && (
                        <LoadingContainer>
                            <LoadingSpinner />
                        </LoadingContainer>
                    )}
                    {usersStore.communityMembershipsLoaded && communityMemberships.length === 0 && (
                        <p>This user has not joined any community leaderboards yet...</p>
                    )}
                </>
            )}
        </LeaderboardsSurface>
    );
});

export default Leaderboards;
