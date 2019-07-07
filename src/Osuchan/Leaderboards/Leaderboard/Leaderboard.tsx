import React from "react";
import { Switch, Route, Redirect } from "react-router";

import LeaderboardHome from "./LeaderboardHome";
import LeaderboardUser from "./LeaderboardUser";
import LeaderboardBeatmap from "./LeaderboardBeatmap";

function Leaderboard() {
    return (
        <Switch>
            <Route exact path="/leaderboards/:leaderboardId" component={LeaderboardHome} />
            <Route exact path="/leaderboards/:leaderboardId/users/:userId" component={LeaderboardUser} />
            <Route exact path="/leaderboards/:leaderboardId/beatmaps/:beatmapId" component={LeaderboardBeatmap} />
            <Redirect to="/leaderboards/:leaderboardId" />
        </Switch>
    );
}

export default Leaderboard;
