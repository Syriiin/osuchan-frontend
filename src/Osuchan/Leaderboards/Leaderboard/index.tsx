import { Switch, Route, Redirect, useRouteMatch } from "react-router-dom";

import LeaderboardHome from "./LeaderboardHome";

const LeaderboardRoot = () => {
    const match = useRouteMatch();

    return (
        <Switch>
            <Route path={match.path}>
                <LeaderboardHome />
            </Route>
            <Redirect to={match.url} />
        </Switch>
    );
};

export default LeaderboardRoot;
