import React from "react";
import { Link, matchPath, RouteComponentProps, withRouter } from "react-router-dom";

import { Theme, createStyles, ListItemText, ListItemIcon, Drawer, ListItem, List, Hidden } from "@material-ui/core";
import { Home as HomeIcon, Poll as PollIcon } from "@material-ui/icons";
import { makeStyles } from "@material-ui/styles";

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) => createStyles({
    drawer: {
        [theme.breakpoints.up("md")]: {
            width: drawerWidth,
            flexShrink: 0
        }
    },
    drawerPaper: {
        width: drawerWidth,
        padding: theme.spacing(3)
    },
    toolbar: theme.mixins.toolbar
}));

function Sidebar(props: SidebarProps) {
    const classes = useStyles();
    
    const drawer = (
        <>
            <div className={classes.toolbar} />
            <List>
                <ListItem selected={props.location.pathname === "/"} button component={Link} to="/">
                    <ListItemIcon><HomeIcon /></ListItemIcon>
                    <ListItemText primary="Home" />
                </ListItem>
                <ListItem selected={matchPath(props.location.pathname, {path: "/leaderboards"}) != null} button component={Link} to="/leaderboards">
                    <ListItemIcon><PollIcon /></ListItemIcon>
                    <ListItemText primary="Leaderboards" />
                </ListItem>
            </List>
        </>
    )

    return (
        <nav className={classes.drawer}>
            <Hidden mdUp>
                <Drawer
                    variant="temporary"
                    anchor="left"
                    open={props.mobileSidebarOpen}
                    onClose={props.handleSidebarToggle}
                    classes={{
                        paper: classes.drawerPaper
                    }}
                    ModalProps={{
                        keepMounted: true
                    }}
                >
                    {drawer}
                </Drawer>
            </Hidden>
            <Hidden smDown>
                <Drawer open variant="permanent" classes={{
                    paper: classes.drawerPaper
                }}>
                    {drawer}
                </Drawer>
            </Hidden>
        </nav>
    );
}

interface SidebarProps extends RouteComponentProps {
    mobileSidebarOpen: boolean;
    handleSidebarToggle: () => void;
}

export default withRouter(Sidebar);
