import React, { useEffect } from "react";
import { connect } from "react-redux";
import { RouteComponentProps } from "react-router";
import { Link } from "react-router-dom";
import { Paper, CircularProgress, Typography, Grid, Tabs, Tab, Theme, createStyles, makeStyles, Table, TableHead, TableRow, TableCell, TableBody, List, ListItem, ListItemText, Chip, Avatar, Tooltip } from "@material-ui/core";
import { CalendarToday as CalendarTodayIcon } from "@material-ui/icons";
import countries from "i18n-iso-countries";

import { formatTime, formatMods, formatScoreResult } from "../../utils/formatting";
import { gamemodeIdFromName } from "../../utils/osu";
import { StoreState } from "../../store/reducers";
import { UsersState } from "../../store/users/types";
import { usersThunkFetch } from "../../store/users/actions";
import { ProfilesDataState } from "../../store/data/profiles/types";
import { LeaderboardsDataState } from "../../store/data/leaderboards/types";

countries.registerLocale(require("i18n-iso-countries/langs/en.json"));

const useStyles = makeStyles((theme: Theme) => createStyles({
    loader: {
        textAlign: "center",
        marginTop: 150
    },
    userPaper: {
        height: theme.spacing(20),
        padding: theme.spacing(2),
        display: "flex",
        flexDirection: "row"
    },
    userAvatar: {
        width: 128,
        height: 128,
        borderRadius: theme.shape.borderRadius
    },
    userDetails: {
        flexGrow: 1,
        display: "flex",
        flexDirection: "column"
    },
    userDetailsLine: {
        flexGrow: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    },
    userFlag: {
        width: 30,
        marginRight: theme.spacing(1)
    },
    countryName: {
        maxWidth: theme.spacing(17)
    },
    calendarIcon: {
        marginRight: theme.spacing(1)
    },
    statsPaper: {
        [theme.breakpoints.up("lg")]: {
            height: theme.spacing(20)
        }
    },
    modeTab: {
        textTransform: "none"
    },
    statsDetails: {
        padding: theme.spacing(2)
    },
    paperHeader: {
        padding: theme.spacing(2)
    },
    scoreStyle: {
        padding: theme.spacing(2)
    },
    leaderboardImage: {
        margin: theme.spacing(1)
    },
    leaderboardChip: {
        marginRight: theme.spacing(1)
    }
}));

function Profile(props: ProfileProps) {
    const classes = useStyles();

    // use effect to fetch profile data
    const { usersThunkFetch } = props;
    const { userString } = props.match.params;
    const gamemodeId = gamemodeIdFromName(props.match.params.gamemodeName);
    useEffect(() => {
        usersThunkFetch(userString, gamemodeId);
    }, [usersThunkFetch, userString, gamemodeId]);

    const userStats = props.users.currentUserStatsId ? props.profilesData.userStats[props.users.currentUserStatsId] : null;
    const osuUser = userStats ? props.profilesData.osuUsers[userStats.osuUserId] : null;

    // use effect to update title
    const { isFetching } = props.users;
    useEffect(() => {
        if (isFetching) {
            document.title = "Loading...";
        } else if (osuUser) {
            document.title = `${osuUser.username} - osu!chan`;
        } else {
            document.title = "User not found - osu!chan";
        }
    }, [isFetching, osuUser]);

    // TODO: split into smaller components
    return (
        <>
            {props.users.isFetching && (
                <div className={classes.loader}>
                    <CircularProgress color="inherit" size={70} />
                    <Typography variant="h4" align="center">Loading</Typography>
                </div>
            )}
            {userStats && osuUser && (
                <>
                    <Grid container spacing={2}>
                        <Grid item xs={12} lg={4}>
                            <Paper className={classes.userPaper}>
                                <img className={classes.userAvatar} src={`https://a.ppy.sh/${osuUser.id}`} alt="Avatar" />
                                <div className={classes.userDetails}>
                                    <div className={classes.userDetailsLine}>
                                        <Typography variant="h4" align="center">
                                            {osuUser.username}
                                        </Typography>
                                    </div>
                                    <div className={classes.userDetailsLine}>
                                        <img className={classes.userFlag} src={`https://osu.ppy.sh/images/flags/${osuUser.country}.png`} alt="Flag" />
                                        <Typography className={classes.countryName} variant="h6" align="center">
                                            {countries.getName(osuUser.country, "en")}
                                        </Typography>
                                    </div>
                                    <div className={classes.userDetailsLine}>
                                        <CalendarTodayIcon className={classes.calendarIcon} />
                                        <Typography variant="h6" align="center">
                                            {osuUser.joinDate.toDateString()}
                                        </Typography>
                                    </div>
                                </div>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} lg={8}>
                            <Paper className={classes.statsPaper}>
                                <Tabs
                                    value={gamemodeId}
                                    indicatorColor="primary"
                                    textColor="white"
                                    variant="fullWidth"
                                >
                                    <Tab label="osu!" className={classes.modeTab} component={Link} to={`/users/${props.match.params.userString}/osu`} />
                                    <Tab label="osu!taiko" className={classes.modeTab} component={Link} to={`/users/${props.match.params.userString}/taiko`} />
                                    <Tab label="osu!catch" className={classes.modeTab} component={Link} to={`/users/${props.match.params.userString}/catch`} />
                                    <Tab label="osu!mania" className={classes.modeTab} component={Link} to={`/users/${props.match.params.userString}/mania`} />
                                </Tabs>
                                <div className={classes.statsDetails}>
                                    <Grid container>
                                        <Grid item xs={6} sm={3}>
                                            <Typography variant="h6" noWrap align="center">
                                                Performance
                                            </Typography>
                                            <Tooltip title={`${userStats.pp.toFixed(2)}pp`}>
                                                <Typography variant="h4" align="center">
                                                    {userStats.pp.toFixed(0)}pp
                                                </Typography>
                                            </Tooltip>
                                        </Grid>
                                        <Grid item xs={6} sm={3}>
                                            <Typography variant="h6" noWrap align="center">
                                                No-choke Perf.
                                            </Typography>
                                            <Tooltip title={userStats.gamemode === 0 ? `${userStats.nochokePp.toFixed(2)}pp` : "-"}>
                                                <Typography variant="h4" align="center">
                                                    {userStats.gamemode === 0 ? `${userStats.nochokePp.toFixed(0)}pp` : "-"}
                                                </Typography>
                                            </Tooltip>
                                        </Grid>
                                        <Grid item xs={6} sm={3}>
                                            <Typography variant="h6" noWrap align="center">
                                                Rank
                                            </Typography>
                                            <Typography variant="h4" align="center">
                                                #{userStats.rank}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6} sm={3}>
                                            <Typography variant="h6" noWrap align="center">
                                                Country Rank
                                            </Typography>
                                            <Typography variant="h4" align="center">
                                                #{userStats.countryRank} {osuUser.country}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </div>
                            </Paper>
                        </Grid>
                        <Grid item xs={12}>
                            <Paper>
                                <Typography className={classes.paperHeader} variant="h5" align="center">
                                    Scores
                                </Typography>
                                <div className={classes.scoreStyle}>
                                    <Grid container>
                                        <Grid item xs={6} sm={4} lg={2}>
                                            <Typography variant="h6" noWrap align="center">
                                                Circle Size
                                            </Typography>
                                            <Tooltip title={`CS ${userStats.scoreStyleCs.toFixed(2)}`}>
                                                <Typography variant="h4" align="center">
                                                    {userStats.scoreStyleCs.toFixed(1)}
                                                </Typography>
                                            </Tooltip>
                                        </Grid>
                                        <Grid item xs={6} sm={4} lg={2}>
                                            <Typography variant="h6" noWrap align="center">
                                                Approach Rate
                                            </Typography>
                                            <Tooltip title={`AR ${userStats.scoreStyleAr.toFixed(2)}`}>
                                                <Typography variant="h4" align="center">
                                                    {userStats.scoreStyleAr.toFixed(1)}
                                                </Typography>
                                            </Tooltip>
                                        </Grid>
                                        <Grid item xs={6} sm={4} lg={2}>
                                            <Typography variant="h6" noWrap align="center">
                                                Overall Difficulty
                                            </Typography>
                                            <Tooltip title={`OD ${userStats.scoreStyleOd.toFixed(2)}`}>
                                                <Typography variant="h4" align="center">
                                                    {userStats.scoreStyleOd.toFixed(1)}
                                                </Typography>
                                            </Tooltip>
                                        </Grid>
                                        <Grid item xs={6} sm={4} lg={2}>
                                            <Typography variant="h6" noWrap align="center">
                                                BPM
                                            </Typography>
                                            <Tooltip title={`${userStats.scoreStyleBpm.toFixed(2)} BPM`}>
                                                <Typography variant="h4" align="center">
                                                    {userStats.scoreStyleBpm.toFixed(0)}
                                                </Typography>
                                            </Tooltip>
                                        </Grid>
                                        <Grid item xs={6} sm={4} lg={2}>
                                            <Typography variant="h6" noWrap align="center">
                                                Length
                                            </Typography>
                                            <Typography variant="h4" align="center">
                                                {formatTime(userStats.scoreStyleLength)}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6} sm={4} lg={2}>
                                            <Typography variant="h6" noWrap align="center">
                                                Accuracy
                                            </Typography>
                                            <Typography variant="h4" align="center">
                                                {userStats.scoreStyleAccuracy.toFixed(2)}%
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </div>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell></TableCell>
                                            <TableCell>Beatmap</TableCell>
                                            <TableCell align="center">Mods</TableCell>
                                            <TableCell align="center">Accuracy</TableCell>
                                            <TableCell align="center">PP</TableCell>
                                            <TableCell align="center">Result</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {props.users.scoreIds.map((scoreId, i) => {
                                            const score = props.profilesData.scores[scoreId];
                                            const beatmap = props.profilesData.beatmaps[score.beatmapId];
                                            return (
                                                <TableRow hover>
                                                    <TableCell>{i+1}</TableCell>
                                                    <TableCell>{beatmap.artist} - {beatmap.title} [{beatmap.difficultyName}]</TableCell>
                                                    <TableCell align="center">{formatMods(score.mods)}</TableCell>
                                                    <TableCell align="center">{score.accuracy.toFixed(2)}%</TableCell>
                                                    <TableCell align="center">
                                                        <Tooltip title={`${score.pp.toFixed(2)}pp`}>
                                                            <Typography>{score.pp.toFixed(0)}pp</Typography>
                                                        </Tooltip>
                                                    </TableCell>
                                                    <TableCell align="center">{formatScoreResult(score.result)}</TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </Paper>
                        </Grid>
                        <Grid item xs={12}>
                            <Paper>
                                <Typography className={classes.paperHeader} variant="h5" align="center">
                                    Community Leaderboards
                                </Typography>
                                <List>
                                    {props.users.leaderboardIds.map(id => props.leaderboardsData.leaderboards[id]).filter(leaderboard => leaderboard.accessType !== 0).map((leaderboard) => {
                                        const owner = props.profilesData.osuUsers[leaderboard.ownerId!];

                                        return (
                                            <ListItem button component={Link} to={`/leaderboards/${leaderboard.id}`}>
                                                <img className={classes.leaderboardImage} src={leaderboard.iconUrl || "https://osu.ppy.sh/images/badges/mods/mod_coop@2x.png"} alt="Leaderboard icon" />
                                                <ListItemText
                                                    primary={leaderboard.name}
                                                    primaryTypographyProps={{
                                                        variant: "h6"
                                                    }}
                                                    secondary={
                                                        <>
                                                            <Chip className={classes.leaderboardChip} size="small" label={owner.username} avatar={<Avatar src={`https://a.ppy.sh/${owner.id}`} />} />
                                                            {leaderboard.accessType === 2 && (
                                                                <Chip className={classes.leaderboardChip} size="small" label="INVITE-ONLY" />
                                                            )}
                                                            {leaderboard.accessType === 3 && (
                                                                <Chip className={classes.leaderboardChip} size="small" label="PRIVATE" />
                                                            )}
                                                        </>
                                                    }
                                                />
                                            </ListItem>
                                        );
                                    })}
                                </List>
                            </Paper>
                        </Grid>
                    </Grid>
                </>
            )}
            {!isFetching && !osuUser && (
                <div className={classes.loader}>
                    <Typography variant="h3" align="center">
                        User not found!
                    </Typography>
                </div>
            )}
        </>
    );
}

interface RouteParams {
    userString: string;
    gamemodeName?: string;
}

interface ProfileProps extends RouteComponentProps<RouteParams> {
    usersThunkFetch: (userString: string, gamemode: number) => void;
    users: UsersState;
    profilesData: ProfilesDataState;
    leaderboardsData: LeaderboardsDataState;
}

function mapStateToProps(state: StoreState) {
    return {
        users: state.users,
        profilesData: state.data.profiles,
        leaderboardsData: state.data.leaderboards
    }
}

const mapDispatchToProps = {
    usersThunkFetch
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
