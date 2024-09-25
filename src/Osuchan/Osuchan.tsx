import { useEffect } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import styled from "styled-components";

import { useStore } from "../utils/hooks";
import About from "./About/About";
import Footer from "./Footer";
import Home from "./Home/Home";
import LeaderboardsRoot from "./Leaderboards";
import Me from "./Me/Me";
import Navbar from "./Navbar";
import Profiles from "./Profiles/Profiles";

const OsuchanWrapper = styled.div`
    display: flex;
    flex-direction: column;
    min-height: 100vh;
`;

const ContentWrapper = styled.main`
    flex-grow: 1;
    margin: 20px 50px;
`;

const Osuchan = () => {
    const store = useStore();
    const meStore = store.meStore;

    // call fetch me action on mount
    useEffect(() => {
        meStore.loadMe();
    }, [meStore]);

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
                    <Route path="/about">
                        <About />
                    </Route>
                    <Redirect to="/" />
                </Switch>
            </ContentWrapper>
            <Footer />
        </OsuchanWrapper>
    );
};

export default Osuchan;
