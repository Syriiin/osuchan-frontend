import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";

import Invites from "./Invites";

const Me = () => {
    return (
        <Switch>
            <Route exact path="/me/invites" >
                <Invites />
            </Route>
            <Redirect to="/" />
        </Switch>
    );
}

export default Me;
