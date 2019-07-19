import React, { useState } from "react";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import { RouteComponentProps } from "react-router";
import { AppBar, Toolbar, IconButton, Typography, Button, Theme, createStyles, InputBase, Avatar, MenuItem, Menu, Badge, ListItemText, ListItemIcon, CircularProgress, Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions } from "@material-ui/core";
import { Menu as MenuIcon, Search as SearchIcon, Mail as MailIcon } from "@material-ui/icons";
import { makeStyles } from "@material-ui/styles";
import { fade } from "@material-ui/core/styles";

import { MeState } from "../store/me/types";
import { meScorePostThunk } from "../store/me/actions";
import { StoreState } from "../store/reducers";
import { ProfilesDataState } from "../store/data/profiles/types";
import { LeaderboardsDataState } from "../store/data/leaderboards/types";

import Sidebar from "./Sidebar";
import { gamemodeIdFromName } from "../utils/osu";

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) => createStyles({
    appBar: {
        marginLeft: drawerWidth,
        zIndex: theme.zIndex.drawer + 1
    },
    menuButton: {
        marginRight: theme.spacing(2),
        [theme.breakpoints.up("md")]: {
            display: "none"
        }
    },
    title: {
        flexGrow: 1,
        display: "none",
        [theme.breakpoints.up("sm")]: {
            display: "block"
        }
    },
    search: {
        position: "relative",
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.white, 0.15),
        "&:hover": {
            backgroundColor: fade(theme.palette.common.white, 0.25)
        },
        marginLeft: 0,
        width: "100%",
        [theme.breakpoints.up("sm")]: {
            marginLeft: theme.spacing(1),
            width: "auto"
        }
    },
    searchIcon: {
        width: theme.spacing(7),
        height: "100%",
        position: "absolute",
        pointerEvents: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    },
    inputRoot: {
        color: "inherit"
    },
    inputInput: {
        padding: theme.spacing(1, 1, 1, 7),
        transition: theme.transitions.create("width"),
        width: "100%",
        [theme.breakpoints.up("sm")]: {
            width: 120,
            "&:focus": {
                width: 200
            }
        }
    },
    auth: {
        minWidth: theme.spacing(14),
        marginLeft: theme.spacing(2)
    }
}));

function Navbar(props: NavbarProps) {
    const classes = useStyles();
    
    // State hooks
    const [searchValue, setSearchValue] = useState("");
    const [userMenuAnchorEl, setUserMenuAnchorEl] = useState<HTMLElement | null>(null);
    const [inviteMenuAnchorEl, setInviteMenuAnchorEl] = useState<HTMLElement | null>(null);
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
    const [addScoreDialogOpen, setAddScoreDialogOpen] = useState(false);
    const [addScoreUserUrl, setAddScoreUserUrl] = useState("");
    const [addScoreBeatmapUrl, setAddScoreBeatmapUrl] = useState("");
    
    // Handlers
    const handleUserMenuOpen = (event:React.MouseEvent<HTMLElement>) => setUserMenuAnchorEl(event.currentTarget);
    const handleUserMenuClose = () => setUserMenuAnchorEl(null);
    const handleInviteMenuOpen = (event:React.MouseEvent<HTMLElement>) => setInviteMenuAnchorEl(event.currentTarget);
    const handleInviteMenuClose = () => setInviteMenuAnchorEl(null);
    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => setSearchValue(event.target.value);
    const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        if (searchValue.length >= 2) {
            props.history.push(`/users/${searchValue}`);
            setSearchValue("");
        }
        event.preventDefault();
    }
    const handleSidebarToggle = () => setMobileSidebarOpen(!mobileSidebarOpen);
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const userUrlRe = /osu.ppy.sh\/users\/(\d+)/;
        const userUrlMatch = addScoreUserUrl.match(userUrlRe);
        const beatmapUrlRe = new RegExp(/osu.ppy.sh\/beatmapsets\/\d+#(osu|taiko|fruits|mania)\/(\d+)/, "g");
        
        let match;
        let gamemode;
        const beatmapIds = [];
        while ((match = beatmapUrlRe.exec(addScoreBeatmapUrl)) !== null) {
            gamemode = match[1];
            beatmapIds.push(parseInt(match[2]));
        }

        if (userUrlMatch !== null && beatmapIds.length > 0) {
            const userId = parseInt(userUrlMatch[1]);
            const gamemodeId = gamemodeIdFromName(gamemode);
            props.meScorePostThunk(userId, beatmapIds, gamemodeId);
            setAddScoreDialogOpen(false);
        }
    }
    const handleCloseAddScoreDialog = () => setAddScoreDialogOpen(false);

    // Variables
    const osuUser = props.me.osuUserId ? props.profilesData.osuUsers[props.me.osuUserId] : null;
    
    return (
        <>
            <AppBar position="fixed" className={classes.appBar}>
                <Toolbar>
                    <IconButton edge="start" color="inherit" onClick={handleSidebarToggle} className={classes.menuButton}>
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" className={classes.title}>
                        osu!chan <strong>Beta</strong>
                    </Typography>
                    <div className={classes.search}>
                        <div className={classes.searchIcon}>
                            <SearchIcon />
                        </div>
                        <form onSubmit={handleSearchSubmit}>
                            <InputBase placeholder="osu! username" onChange={handleSearchChange} value={searchValue} classes={{
                                root: classes.inputRoot,
                                input: classes.inputInput
                            }} />
                        </form>
                    </div>
                    <div className={classes.auth}>
                        {osuUser ? (
                            <>
                                <IconButton onClick={handleInviteMenuOpen} color="inherit">
                                    <Badge badgeContent={props.me.inviteIds.length} color="secondary">
                                        <MailIcon />
                                    </Badge>
                                </IconButton>
                                <Menu
                                    id="invite-menu"
                                    anchorEl={inviteMenuAnchorEl}
                                    getContentAnchorEl={null}
                                    anchorOrigin={{
                                        vertical: "bottom",
                                        horizontal: "center"
                                    }}
                                    keepMounted
                                    transformOrigin={{
                                        vertical: "top",
                                        horizontal: "center"
                                    }}
                                    open={inviteMenuAnchorEl !== null}
                                    onClose={handleInviteMenuClose}
                                >
                                    {props.me.inviteIds.length > 0 ? props.me.inviteIds.map(inviteId => {
                                        const invite = props.leaderboardsData.invites[inviteId];
                                        const leaderboard = props.leaderboardsData.leaderboards[invite.leaderboardId];
                                        
                                        return (
                                            <MenuItem component={Link} to={`/leaderboards/${leaderboard.id}`}>
                                                <ListItemIcon>
                                                    <Avatar src={`https://a.ppy.sh/${leaderboard.ownerId}`} />
                                                </ListItemIcon>
                                                <ListItemText primary={leaderboard.name} />
                                            </MenuItem>
                                        )
                                    }) : (
                                        <MenuItem disabled>No pending invites</MenuItem>
                                    )}
                                </Menu>
                                <IconButton onClick={handleUserMenuOpen}>
                                    <Avatar src={`https://a.ppy.sh/${osuUser.id}`} />
                                </IconButton>
                                <Menu
                                    id="user-menu"
                                    anchorEl={userMenuAnchorEl}
                                    getContentAnchorEl={null}
                                    anchorOrigin={{
                                        vertical: "bottom",
                                        horizontal: "center"
                                    }}
                                    keepMounted
                                    transformOrigin={{
                                        vertical: "top",
                                        horizontal: "center"
                                    }}
                                    open={userMenuAnchorEl !== null}
                                    onClose={handleUserMenuClose}
                                >
                                    <MenuItem component={Link} to={`/users/${osuUser.username}`}>Profile</MenuItem>
                                    <MenuItem component="a" href="/osuauth/logout">Logout</MenuItem>
                                    <MenuItem disabled></MenuItem>
                                    {props.me.isPostingScore ? (
                                        <MenuItem disabled>
                                            <CircularProgress size={22} color="inherit" />
                                        </MenuItem>
                                    ) : (
                                        <MenuItem onClick={() => setAddScoreDialogOpen(true)}>Add scores</MenuItem>
                                    )}
                                    <Dialog open={addScoreDialogOpen} onClose={handleCloseAddScoreDialog}>
                                        <form onSubmit={handleSubmit}>
                                            <DialogTitle>Add scores</DialogTitle>
                                            <DialogContent>
                                                <DialogContentText>
                                                    Enter a player's osu! profile URL and beatmap URL(s) to add scores from those beatmaps.
                                                    <br />
                                                    URLs must be from the new site so they match the format below.
                                                </DialogContentText>
                                                <TextField
                                                    autoFocus
                                                    margin="dense"
                                                    label="osu! profile URL"
                                                    placeholder="https://osu.ppy.sh/users/5701575"
                                                    required
                                                    fullWidth
                                                    onChange={e => setAddScoreUserUrl(e.currentTarget.value)}
                                                />
                                                <TextField
                                                    margin="dense"
                                                    label="Beatmap URL(s)"
                                                    placeholder="https://osu.ppy.sh/beatmapsets/235836#osu/546514"
                                                    required
                                                    fullWidth
                                                    multiline
                                                    onChange={e => setAddScoreBeatmapUrl(e.currentTarget.value)}
                                                />
                                            </DialogContent>
                                            <DialogActions>
                                                <Button onClick={handleCloseAddScoreDialog}>
                                                    Cancel
                                                </Button>
                                                <Button type="submit">
                                                    Add scores
                                                </Button>
                                            </DialogActions>
                                        </form>
                                    </Dialog>
                                </Menu>
                            </>
                        ) : (
                            <Button href="/osuauth/login">Login</Button>
                        )}
                    </div>
                </Toolbar>
            </AppBar>
            <Sidebar mobileSidebarOpen={mobileSidebarOpen} handleSidebarToggle={handleSidebarToggle} />
        </>
    );
}

interface NavbarProps extends RouteComponentProps {
    me: MeState,
    profilesData: ProfilesDataState,
    leaderboardsData: LeaderboardsDataState,
    meScorePostThunk: (userId: number, beatmapIds: number[], gamemodeId: number) => void
}

function mapStateToProps(state: StoreState) {
    return {
        me: state.me,
        profilesData: state.data.profiles,
        leaderboardsData: state.data.leaderboards
    }
}

const mapDispatchToProps = {
    meScorePostThunk
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Navbar));
