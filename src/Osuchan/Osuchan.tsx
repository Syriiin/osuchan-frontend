import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Switch, Route, Redirect } from "react-router-dom";
import { Container } from "semantic-ui-react";
import styled from "styled-components";

import { meThunkFetch } from "../store/me/actions";

import Navbar from "./Navbar";
import Footer from "./Footer";
import Home from "./Home/Home";
import Profiles from "./Profiles/Profiles";
import Leaderboards from "./Leaderboards/Leaderboards";

// Flex on container ensures the navbar stays at the top, and footer stays at the bottom
const OsuchanContainer = styled(Container)`
    flex: 1;
`;

function Osuchan(props: OsuchanProps) {
    // call fetch me action on mount
    const { meThunkFetch } = props;
    useEffect(() => {
        meThunkFetch();
    }, [meThunkFetch]);

    return (
        <>
            <Navbar />
            <OsuchanContainer>
                <Switch>
                    <Route path="/" exact component={Home} />
                    <Route path="/users" component={Profiles} />
                    <Route path="/leaderboards" component={Leaderboards} />
                    <Redirect to="/" />
                </Switch>
            </OsuchanContainer>
            <Footer />
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
