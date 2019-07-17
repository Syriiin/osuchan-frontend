import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Switch, Route, Redirect } from "react-router-dom";
import Container from "@material-ui/core/Container";

import { meGetThunk } from "../store/me/actions";

import Navbar from "./Navbar";
import Footer from "./Footer";
import Home from "./Home/Home";
import Profiles from "./Profiles/Profiles";
import Leaderboards from "./Leaderboards/Leaderboards";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) => createStyles({
    root: {
        display: "flex"
    },
    content: {
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        flexGrow: 1,
        padding: theme.spacing(3)
    },
    toolbar: theme.mixins.toolbar
}));

function Osuchan(props: OsuchanProps) {
    const classes = useStyles();
    
    // call fetch me action on mount
    const { meGetThunk } = props;
    useEffect(() => {
        meGetThunk();
    }, [meGetThunk]);

    return (
        <div className={classes.root}>
            <Navbar />
            <main className={classes.content}>
                <div className={classes.toolbar} />
                <Container maxWidth="lg">
                    <Switch>
                        <Route path="/" exact component={Home} />
                        <Route path="/users" component={Profiles} />
                        <Route path="/leaderboards" component={Leaderboards} />
                        <Redirect to="/" />
                    </Switch>
                </Container>
                <Footer />
            </main>
        </div>
    );
}

interface OsuchanProps {
    meGetThunk: () => void;
}

const mapDispatchToProps = {
    meGetThunk
}

export default connect(null, mapDispatchToProps)(Osuchan);
