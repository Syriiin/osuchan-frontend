import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";

import Profile from "./Profile";

function Profiles() {
    return (
        <Switch>
            <Route exact path="/users/:userString" component={Profile} />
            <Route path="/users/:userString/:gamemodeName" component={Profile} />
            <Redirect to="/" />
        </Switch>
    );
}

export default Profiles;
