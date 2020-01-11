import React from 'react';
import { Router } from "react-router-dom";
import { ThemeProvider as StyledThemeProvider, createGlobalStyle } from "styled-components";

import "react-vis/dist/style.css";

import history from "./history";
import { osuchanTheme } from "./osuchanTheme";

import Osuchan from "./Osuchan/Osuchan";

const GlobalStyle = createGlobalStyle`
    * {
        box-sizing: border-box;
        font-family: "Exo 2", sans-serif;
    }

    a {
        color: ${props => props.theme.colours.mango};
        text-decoration: none;

        &:hover {
            text-decoration: underline;
        }
    }

    body {
        margin: 0;
        background-color: ${props => props.theme.colours.background};
        color: #fff;
        line-height: 1.3;
    }
`;

function App() {
    return (
        <StyledThemeProvider theme={osuchanTheme}>
            <Router history={history}>
                <GlobalStyle />
                <Osuchan />
            </Router>
        </StyledThemeProvider>
    );
}

export default App;
