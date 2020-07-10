import React from "react";
import { observer } from "mobx-react-lite";

import { Membership } from "../../store/models/leaderboards/types";
import { UnstyledLink, CommunityLeaderboardRow } from "../../components";
import { formatGamemodeNameShort } from "../../utils/formatting";

const JoinedLeaderboards = (props: JoinedLeaderboardsProps) => {
    return (
        <>
            {props.memberships.map((membership, i) => (
                <UnstyledLink key={i} to={`/leaderboards/community/${formatGamemodeNameShort(membership.leaderboard!.gamemode)}/${membership.leaderboardId}`}>
                    <CommunityLeaderboardRow leaderboard={membership.leaderboard!} membership={membership} />
                </UnstyledLink>
            ))}
        </>
    );
}

interface JoinedLeaderboardsProps {
    memberships: Membership[];
}

export default observer(JoinedLeaderboards);
