import React, { useEffect, useContext } from "react";
import { RouteComponentProps } from "react-router";
import { Link } from "react-router-dom";
import { CircularProgress, Typography, Grid, Paper, Table, TableHead, TableRow, TableCell, TableBody, makeStyles, Theme, createStyles, Tooltip, Link as UILink } from "@material-ui/core";
import { observer } from "mobx-react-lite";

import { formatMods, formatScoreResult } from "../../../utils/formatting";
import { StoreContext } from "../../../store";
import { Beatmap, OsuUser } from "../../../store/models/profiles/types";

const useStyles = makeStyles((theme: Theme) => createStyles({
    loader: {
        textAlign: "center",
        marginTop: 150
    },
    paperHeader: {
        padding: theme.spacing(2)
    },
    memberStats: {
        padding: theme.spacing(2)
    },
    tableLink: {
        color: "inherit",
        textDecoration: "none",
        "&:hover": {
            textDecoration: "underline"
        }
    }
}));

function LeaderboardUser(props: LeaderboardUserProps) {
    const store = useContext(StoreContext);
    const userStore = store.leaderboardsStore.userStore;

    const classes = useStyles();

    // use effect to fetch leaderboards data
    const leaderboardId = parseInt(props.match.params.leaderboardId);
    const userId = parseInt(props.match.params.userId);
    const { loadUser } = userStore;
    useEffect(() => {
        loadUser(leaderboardId, userId);
    }, [loadUser, leaderboardId, userId]);

    const membership = userStore.membership;
    const osuUser = membership ? membership.osuUser as OsuUser : null;

    // use effect to update title
    const { isLoading } = userStore;
    useEffect(() => {
        if (isLoading) {
            document.title = "Loading...";
        } else if (osuUser) {
            document.title = `${osuUser.username} - osu!chan`;
        } else {
            document.title = "User not found - osu!chan";
        }
    }, [isLoading, osuUser]);

    return (
        <>
            {userStore.isLoading && (
                <div className={classes.loader}>
                    <CircularProgress color="inherit" size={70} />
                    <Typography variant="h4" align="center">Loading</Typography>
                </div>
            )}
            {membership && osuUser && (
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Paper>
                            <Typography className={classes.paperHeader} variant="h4" align="center">
                                <UILink color="inherit" component={Link} to={`/users/${osuUser.username}`}>
                                    {osuUser.username}
                                </UILink>
                            </Typography>
                            <div className={classes.memberStats}>
                                <Grid container>
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="h6" noWrap align="center">
                                            Performance
                                        </Typography>
                                        <Tooltip title={`${membership.pp.toFixed(2)}pp`}>
                                            <Typography variant="h4" align="center">
                                                {membership.pp.toFixed(0)}pp
                                            </Typography>
                                        </Tooltip>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="h6" noWrap align="center">
                                            Score Count
                                        </Typography>
                                        <Typography variant="h4" align="center">
                                            {membership.scoreCount}
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
                                    {userStore.scores.map((score, i) => {
                                        const beatmap = score.beatmap as Beatmap;
                                        
                                        return (
                                            <TableRow hover>
                                                <TableCell>{i+1}</TableCell>
                                                <TableCell><Link className={classes.tableLink} to={`/leaderboards/${leaderboardId}/beatmaps/${beatmap.id}`}>{beatmap.artist} - {beatmap.title} [{beatmap.difficultyName}]</Link></TableCell>
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
                </Grid>
            )}
            {!userStore.isLoading && !osuUser && (
                <div className={classes.loader}>
                    <Typography variant="h3" align="center">
                        Leaderboard user not found!
                    </Typography>
                </div>
            )}
        </>
    );
}

interface RouteParams {
    userId: string;
    leaderboardId: string;
}

interface LeaderboardUserProps extends RouteComponentProps<RouteParams> {}

export default observer(LeaderboardUser);
