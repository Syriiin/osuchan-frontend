import styled from "styled-components";
import { LeaderboardAccessType } from "../../store/models/leaderboards/enums";
import { Row } from "./Row";
import { Leaderboard, Membership } from "../../store/models/leaderboards/types";
import { NumberFormat } from "./NumberFormat";
import { observer } from "mobx-react-lite";

const LeaderboardIconContainer = styled.div`
    width: 86px;
    height: 86px;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const LeaderboardIcon = styled.img`
    border-radius: 5px;
    max-width: 100%;
    max-height: 100%;
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

const MembershipRank = styled.div`
    font-size: 2em;
`;

const MembershipPerformance = styled.div`

`;

export const CommunityLeaderboardRow = observer((props: CommunityLeaderboardRowProps) => (
    <Row hoverable>
        <LeaderboardIconContainer>
            <LeaderboardIcon src={props.leaderboard.iconUrl} />
        </LeaderboardIconContainer>
        <LeaderboardTitleContainer>
            <LeaderboardTitle>{props.leaderboard.name}</LeaderboardTitle>
            <LeaderboardType>
                {props.leaderboard.accessType === LeaderboardAccessType.Public && "PUBLIC"}
                {props.leaderboard.accessType === LeaderboardAccessType.PublicInviteOnly && "INVITE-ONLY"}
                {props.leaderboard.accessType === LeaderboardAccessType.Private && "PRIVATE"}
            </LeaderboardType>
            <LeaderboardSubtitle>{props.leaderboard.memberCount} members</LeaderboardSubtitle>
        </LeaderboardTitleContainer>
        {props.membership && (
            <MembershipInfoContainer>
                <MembershipRank>
                    #{props.membership.rank.toLocaleString("en")}
                </MembershipRank>
                <MembershipPerformance>
                    <NumberFormat value={props.membership.pp} decimalPlaces={0} />pp
                </MembershipPerformance>
            </MembershipInfoContainer>
        )}
    </Row>
));

interface CommunityLeaderboardRowProps {
    leaderboard: Leaderboard;
    membership?: Membership;
}
