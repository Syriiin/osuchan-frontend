import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Switch, Route, Redirect } from "react-router-dom";
import { Container } from "semantic-ui-react";

import { meThunkFetch } from "../store/me/actions";

import Navbar from "./Navbar";
import Home from "./Home/Home";
import Profiles from "./Profiles/Profiles";
import Leaderboards from "./Leaderboards/Leaderboards";

function Osuchan(props: OsuchanProps) {
    // call fetch me action on mount
    const { meThunkFetch } = props;
    useEffect(() => {
        meThunkFetch();
    }, [meThunkFetch]);

    return (
        <>
            <Navbar />
            <Container>
                <Switch>
                    <Route path="/" exact component={Home} />
                    <Route path="/users" component={Profiles} />
                    <Route path="/leaderboards" component={Leaderboards} />
                    <Redirect to="/" />
                </Switch>
            </Container>
        </>
    );
}

interface OsuchanProps {
    meThunkFetch: () => void;
}

const mapDispatchToProps = {
    meThunkFetch
}

export default connect(null, mapDispatchToProps)(Osuchan);
