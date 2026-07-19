import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import styled from "styled-components";

import { useStore } from "../utils/hooks";
import Footer from "./Footer";
import Home from "./Home/Home";
import LeaderboardsRoot from "./Leaderboards";
import Me from "./Me/Me";
import Navbar from "./Navbar";
import Profiles from "./Profiles/Profiles";
import EventsRoot from "./Events";

const OsuchanWrapper = styled.div`
    display: flex;
    flex-direction: column;
    min-height: 100vh;
`;

const ContentWrapper = styled.main`
    flex-grow: 1;
    margin: 20px 50px;
    display: flex;
    flex-direction: column;
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
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/me/*" element={<Me />} />
                    <Route path="/users/*" element={<Profiles />} />
                    <Route path="/leaderboards/*" element={<LeaderboardsRoot />} />
                    <Route path="/events/*" element={<EventsRoot />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </ContentWrapper>
            <Footer />
        </OsuchanWrapper>
    );
};

export default Osuchan;
