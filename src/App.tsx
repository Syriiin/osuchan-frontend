import React, { FunctionComponent } from 'react';
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import { createGlobalStyle, ThemeProvider } from "styled-components";

import store from "./store";
import { osuchanBlueTheme } from "./osuchanTheme";

import Home from "./Osuchan/Osuchan";

const GlobalStyle = createGlobalStyle`
    body {
        background-color: ${props => props.theme.colours.backdrop};
        color: #fff;

        #root {
            display: flex;
            flex-direction: column;
            min-height: 100%;
        }
    }
`;

const App: FunctionComponent = () => {
    return (
        <Provider store={store}>
            <ThemeProvider theme={osuchanBlueTheme}>
                <Router>
                    <GlobalStyle />
                    <Home />
                </Router>
            </ThemeProvider>
        </Provider>
    );
}

export default App;
