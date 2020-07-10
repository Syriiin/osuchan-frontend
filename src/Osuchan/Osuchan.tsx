import React, { useEffect, useContext } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { observer } from "mobx-react-lite";
import styled from "styled-components";

import Navbar from "./Navbar";
import Footer from "./Footer";
import Home from "./Home/Home";
import Me from "./Me/Me";
import Profiles from "./Profiles/Profiles";
import LeaderboardsRoot from "./Leaderboards";
import { StoreContext } from "../store";

const OsuchanWrapper = styled.div`
    display: flex;
    flex-direction: column;
    min-height: 100vh;
`;

const ContentWrapper = styled.main`
    flex-grow: 1;
    margin: 20px 50px;
`;

const Osuchan = observer(() => {
    const store = useContext(StoreContext);
    const meStore = store.meStore;
    
    // call fetch me action on mount
    const { loadMe } = meStore;
    useEffect(() => {
        loadMe();
    }, [loadMe]);

    return (
        <OsuchanWrapper>
            <Navbar />
            <ContentWrapper>
                <Switch>
                    <Route path="/" exact>
                        <Home />
                    </Route>
                    <Route path="/me">
                        <Me />
                    </Route>
                    <Route path="/users">
                        <Profiles />
                    </Route>
                    <Route path="/leaderboards">
                        <LeaderboardsRoot />
                    </Route>
                    <Redirect to="/" />
                </Switch>
            </ContentWrapper>
            <Footer />
        </OsuchanWrapper>
    );
});

export default Osuchan;
