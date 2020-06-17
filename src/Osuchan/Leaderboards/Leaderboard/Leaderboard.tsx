import React from "react";
import { Switch, Route, Redirect } from "react-router";

import LeaderboardHome from "./LeaderboardHome";
import LeaderboardInvites from "./LeaderboardInvites";
import LeaderboardMember from "./LeaderboardMember/LeaderboardMember";

const Leaderboard = () => {
    return (
        <Switch>
            <Route exact path="/leaderboards/:leaderboardId" component={LeaderboardHome} />
            <Route exact path="/leaderboards/:leaderboardId/invites" component={LeaderboardInvites} />
            <Route exact path="/leaderboards/:leaderboardId/users/:userId" component={LeaderboardMember} />
            <Redirect to="/leaderboards/:leaderboardId" />
        </Switch>
    );
}

export default Leaderboard;
