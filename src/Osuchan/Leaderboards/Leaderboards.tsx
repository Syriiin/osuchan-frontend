import React from "react";
import { Switch, Route, Redirect } from "react-router";

import LeaderboardList from "./LeaderboardList";
import Leaderboard from "./Leaderboard/Leaderboard";

function Leaderboards() {
    return (
        <Switch>
            <Route exact path="/leaderboards" component={LeaderboardList} />
            <Route path="/leaderboards/:leaderboardId" component={Leaderboard} />
            <Redirect to="/leaderboards" />
        </Switch>
    );
}

export default Leaderboards;
