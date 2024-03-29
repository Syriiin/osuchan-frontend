import { Leaderboard, Membership } from "../../store/models/leaderboards/types";
import { UnstyledLink, GlobalLeaderboardRow } from "../../components";
import { formatGamemodeNameShort } from "../../utils/formatting";
import { observer } from "mobx-react-lite";

const GlobalLeaderboards = observer((props: GlobalLeaderboardsProps) => (
    <>
        {props.leaderboards &&
            props.leaderboards.map((leaderboard, i) => (
                <UnstyledLink
                    key={i}
                    to={`/leaderboards/global/${formatGamemodeNameShort(
                        leaderboard.gamemode
                    )}/${leaderboard.id}`}
                >
                    <GlobalLeaderboardRow leaderboard={leaderboard} />
                </UnstyledLink>
            ))}
        {props.memberships &&
            props.memberships.map((membership, i) => (
                <UnstyledLink
                    key={i}
                    to={`/leaderboards/global/${formatGamemodeNameShort(
                        membership.leaderboard!.gamemode
                    )}/${membership.leaderboardId}`}
                >
                    <GlobalLeaderboardRow
                        leaderboard={membership.leaderboard!}
                        membership={membership}
                    />
                </UnstyledLink>
            ))}
    </>
));

interface GlobalLeaderboardsProps {
    leaderboards?: Leaderboard[];
    memberships?: Membership[];
}

export default GlobalLeaderboards;
