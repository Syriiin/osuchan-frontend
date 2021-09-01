import { useEffect } from "react";
import { Router, useLocation } from "react-router-dom";
import {
    ThemeProvider as StyledThemeProvider,
    createGlobalStyle,
} from "styled-components";
import { configure } from "mobx";
import ReactGA from "react-ga";

import "react-datepicker/dist/react-datepicker.css";
import "react-toastify/dist/ReactToastify.css";

import history from "./history";
import { osuchanTheme } from "./osuchanTheme";
import { NotificationContainer } from "./notifications";

import Osuchan from "./Osuchan/Osuchan";
import { RootStore, StoreContext } from "./store";

if (process.env.NODE_ENV === "production") {
    ReactGA.initialize(process.env.REACT_APP_GA_TRACKING_ID);
}

configure({
    enforceActions: "always",
    computedRequiresReaction: true,
    reactionRequiresObservable: true,
    observableRequiresReaction: true,
});

const GlobalStyle = createGlobalStyle`
    * {
        box-sizing: border-box;
        font-family: "Exo 2", sans-serif;
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
    }
`;

const AppWithContext = () => {
    const location = useLocation();

    useEffect(() => {
        if (process.env.NODE_ENV === "production") {
            ReactGA.pageview(location.pathname + location.search);
        }
    }, [location]);

    return <Osuchan />;
};

const App = () => (
    <StoreContext.Provider value={new RootStore()}>
        <StyledThemeProvider theme={osuchanTheme}>
            <Router history={history}>
                <GlobalStyle />
                <NotificationContainer hideProgressBar />
                <AppWithContext />
            </Router>
        </StyledThemeProvider>
    </StoreContext.Provider>
);

export default App;
