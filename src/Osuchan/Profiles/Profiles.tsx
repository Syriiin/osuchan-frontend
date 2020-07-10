import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";

import Profile from "./Profile/Profile";

const Profiles = () => {
    return (
        <Switch>
            <Route exact path="/users/:userString">
                <Profile />
            </Route>
            <Route path="/users/:userString/:gamemodeName">
                <Profile />
            </Route>
            <Redirect to="/" />
        </Switch>
    );
}

export default Profiles;
