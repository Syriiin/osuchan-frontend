import { useEffect } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import styled from "styled-components";

import Navbar from "./Navbar";
import Footer from "./Footer";
import Home from "./Home/Home";
import Me from "./Me/Me";
import Profiles from "./Profiles/Profiles";
import LeaderboardsRoot from "./Leaderboards";
import { useStore } from "../utils/hooks";

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
                    <Redirect to="/" />
                </Switch>
            </ContentWrapper>
            <Footer />
        </OsuchanWrapper>
    );
};

export default Osuchan;
