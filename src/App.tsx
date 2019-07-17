import React, { FunctionComponent } from 'react';
import { Router } from "react-router-dom";
import { Provider } from "react-redux";
import { ThemeProvider as StyledThemeProvider } from "styled-components";
import CssBaseline from "@material-ui/core/CssBaseline";
import { createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from '@material-ui/styles';

import store from "./store";
import history from "./history";
import { osuchanBlueTheme } from "./osuchanTheme";

import Osuchan from "./Osuchan/Osuchan";

const muiTheme = createMuiTheme({
    palette: {
        type: "dark",
        primary: {
            main: "#25408F"
        },
        secondary: {
            main: "#3256C2"
        },
        background: {
            default: "#111E42",
            paper: "#252C42"
        }
    }
});

const App: FunctionComponent = () => {
    return (
        <Provider store={store}>
            <ThemeProvider theme={muiTheme}>
                <StyledThemeProvider theme={osuchanBlueTheme}>
                    <Router history={history}>
                        <CssBaseline />
                        <Osuchan />
                    </Router>
                </StyledThemeProvider>
            </ThemeProvider>
        </Provider>
    );
}

export default App;
