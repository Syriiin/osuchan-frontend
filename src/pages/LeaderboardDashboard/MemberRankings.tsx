import { observer } from "mobx-react-lite";
import styled from "styled-components";
import { Flag, NumberFormat, Row } from "../../components";
import { Membership } from "../../store/models/leaderboards/types";

const MemberRowWrapper = styled(Row)`
    font-size: 0.6em;
`;

const Rank = styled.span`
    margin-right: 0.3em;
    width: 2em;
    text-align: center;
    font-size: 1.5em;
`;

const PlayerInfo = styled.div`
    display: flex;
    align-items: center;
    margin-right: 0.3em;
    flex-grow: 1;
`;

const Avatar = styled.img`
    width: 3.5em;
    border-radius: 0.3em;
    margin-right: 0.6em;
`;

const FlagContainer = styled.div`
    margin-right: 0.6em;
`;

const Username = styled.span`
    font-size: 1.1em;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    max-width: 40%;
`;

const Performance = styled.span`
    font-size: 1.5em;
    white-space: nowrap;
`;

const MemberRow = observer((props: RankingRowProps) => (
    <MemberRowWrapper>
        <Rank>#{props.rank.toLocaleString("en")}</Rank>
        <PlayerInfo>
            <Avatar src={`https://a.ppy.sh/${props.membership.osuUserId}`} />
            <FlagContainer>
                <Flag countryCode={props.membership.osuUser!.country} />
            </FlagContainer>
            <Username>{props.membership.osuUser!.username}</Username>
        </PlayerInfo>
        <Performance>
            <NumberFormat value={props.membership.pp} decimalPlaces={0} />
            pp
        </Performance>
    </MemberRowWrapper>
));

interface RankingRowProps {
    membership: Membership;
    rank: number;
}

const MemberRankings = observer((props: MemberRankingProps) => (
    <>
        {props.memberships.map((membership, i) => (
            <MemberRow key={i} rank={i + 1} membership={membership} />
        ))}
    </>
));

interface MemberRankingProps {
    memberships: Membership[];
}

export default MemberRankings;
