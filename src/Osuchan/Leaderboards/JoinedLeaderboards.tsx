import { Membership } from "../../store/models/leaderboards/types";
import { UnstyledLink, CommunityLeaderboardRow } from "../../components";
import { formatGamemodeNameShort } from "../../utils/formatting";
import { observer } from "mobx-react-lite";

const JoinedLeaderboards = observer((props: JoinedLeaderboardsProps) => (
    <>
        {props.memberships.map((membership, i) => (
            <UnstyledLink
                key={i}
                to={`/leaderboards/community/${formatGamemodeNameShort(
                    membership.leaderboard!.gamemode
                )}/${membership.leaderboardId}`}
            >
                <CommunityLeaderboardRow
                    leaderboard={membership.leaderboard!}
                    membership={membership}
                />
            </UnstyledLink>
        ))}
    </>
));

interface JoinedLeaderboardsProps {
    memberships: Membership[];
}

export default JoinedLeaderboards;
