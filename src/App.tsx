import { configure } from "mobx";
import { Route, Routes, unstable_HistoryRouter as Router } from "react-router-dom";
import { ThemeProvider as StyledThemeProvider, createGlobalStyle } from "styled-components";

import "react-datepicker/dist/react-datepicker.css";

import history from "./history";
import { NotificationContainer } from "./notifications";
import { osuchanTheme } from "./osuchanTheme";

import Osuchan from "./Osuchan/Osuchan";
import LeaderboardDashboard from "./pages/LeaderboardDashboard";
import { RootStore, StoreContext } from "./store";
import PPRaceDashboard from "./pages/PPRaceDashboard";
import COEPPRaceDashboard from "./pages/COEPPRaceDashboard";

configure({
    enforceActions: "always",
    computedRequiresReaction: true,
    reactionRequiresObservable: true,
    observableRequiresReaction: true,
});

const GlobalStyle = createGlobalStyle`
    * {
        box-sizing: border-box;
    }

    a {
        color: ${(props) => props.theme.colours.mango};
        text-decoration: none;

        &:hover {
            text-decoration: underline;
        }
    }

    body {
        margin: 0;
        background-color: ${(props) => props.theme.colours.background};
        color: #fff;
        line-height: 1.3;
        font-family: "Exo 2", sans-serif;
    }
`;

const AppWithContext = () => (
    <Routes>
        <Route
            path="/leaderboards/:leaderboardType/:gamemode/:leaderboardId/dashboard"
            element={<LeaderboardDashboard />}
        />
        <Route path="/ppraces/:ppraceId/dashboard" element={<PPRaceDashboard />} />
        <Route path="/ppraces/:ppraceId/coe-dashboard" element={<COEPPRaceDashboard />} />
        <Route path="*" element={<Osuchan />} />
    </Routes>
);

const App = () => (
    <StoreContext.Provider value={new RootStore()}>
        <StyledThemeProvider theme={osuchanTheme}>
            <Router history={history as any}>
                <GlobalStyle />
                <NotificationContainer hideProgressBar />
                <AppWithContext />
            </Router>
        </StyledThemeProvider>
    </StoreContext.Provider>
);

export default App;
