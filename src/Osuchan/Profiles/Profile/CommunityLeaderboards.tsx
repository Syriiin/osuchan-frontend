import React from "react";
import styled from "styled-components";

import { Surface, SurfaceTitle, UnstyledLink, Row } from "../../../components";
import { Membership } from "../../../store/models/leaderboards/types";
import { LeaderboardAccessType } from "../../../store/models/leaderboards/enums";

const LeaderboardsSurface = styled(Surface)`
    padding: 20px;
    grid-area: leaderboards;
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

const LeaderboardCreator = styled.span`
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

const LeaderboardRow = (props: LeaderboardRowProps) => (
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
            <LeaderboardCreator>{props.membership.leaderboard!.memberCount} members</LeaderboardCreator>
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

interface LeaderboardRowProps {
    membership: Membership;
}

const CommunityLeaderboards = (props: LeaderboardsProps) => {
    return (
        <LeaderboardsSurface>
            <SurfaceTitle>Community Leaderboards</SurfaceTitle>
            {props.memberships.map((membership, i) => (
                <UnstyledLink key={i} to={`/leaderboards/${membership.leaderboardId}`}>
                    <LeaderboardRow membership={membership} />
                </UnstyledLink>
            ))}
            {props.memberships.length === 0 && (
                <p>This user has not joined any community leaderboards yet...</p>
            )}
        </LeaderboardsSurface>
    );
}

interface LeaderboardsProps {
    memberships: Membership[];
}

export default CommunityLeaderboards;
