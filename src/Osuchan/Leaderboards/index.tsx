import React from "react";
import { Switch, Route, Redirect, useRouteMatch } from "react-router";

import LeaderboardList from "./LeaderboardList";
import LeaderboardRoot from "./Leaderboard";

const Leaderboards = () => {
    const match = useRouteMatch();

    return (
        <Switch>
            <Route exact path={match.path}>
                <LeaderboardList />
            </Route>
            <Route path={`${match.path}/:leaderboardId(\\d+)`}>
                <LeaderboardRoot />
            </Route>
        </Switch>
    );
}

const LeaderboardsRoot = () => {
    const match = useRouteMatch();

    return (
        <Switch>
            <Route path={`${match.path}/:leaderboardType(global|community)/:gamemode(osu|taiko|catch|mania)`}>
                <Leaderboards />
            </Route>
            <Redirect to={`${match.url}/global/osu`} />
        </Switch>
    );
}

export default LeaderboardsRoot;
