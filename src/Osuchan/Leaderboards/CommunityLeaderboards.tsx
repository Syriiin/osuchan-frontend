import { Leaderboard } from "../../store/models/leaderboards/types";
import { UnstyledLink, CommunityLeaderboardRow } from "../../components";
import { formatGamemodeNameShort } from "../../utils/formatting";
import { observer } from "mobx-react-lite";

const CommunityLeaderboards = observer((props: CommunityLeaderboardsProps) => (
    <>
        {props.leaderboards.map((leaderboard, i) => (
            <UnstyledLink key={i} to={`/leaderboards/community/${formatGamemodeNameShort(leaderboard.gamemode)}/${leaderboard.id}`}>
                <CommunityLeaderboardRow leaderboard={leaderboard} />
            </UnstyledLink>
        ))}
    </>
));

interface CommunityLeaderboardsProps {
    leaderboards: Leaderboard[];
}

export default CommunityLeaderboards;
