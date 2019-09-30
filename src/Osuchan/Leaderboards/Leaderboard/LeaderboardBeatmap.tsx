import React, { useEffect, useContext } from "react";
import { RouteComponentProps } from "react-router";
import { Link } from "react-router-dom";
import { observer } from "mobx-react-lite";

import { formatTime, formatMods, formatScoreResult } from "../../../utils/formatting";
import { makeStyles, Theme, createStyles, CircularProgress, Typography, Grid, Paper, Table, TableHead, TableRow, TableCell, TableBody, Tooltip, Link as UILink } from "@material-ui/core";
import { StoreContext } from "../../../store";
import { UserStats, OsuUser } from "../../../store/models/profiles/types";

const useStyles = makeStyles((theme: Theme) => createStyles({
    loader: {
        textAlign: "center",
        marginTop: 150
    },
    paperHeader: {
        padding: theme.spacing(2)
    },
    beatmapStats: {
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

function LeaderboardBeatmap(props: LeaderboardBeatmapProps) {
    const store = useContext(StoreContext);
    const beatmapStore = store.leaderboardsStore.beatmapStore;

    const classes = useStyles();

    // use effect to fetch leaderboards data
    const leaderboardId = parseInt(props.match.params.leaderboardId);
    const beatmapId = parseInt(props.match.params.beatmapId);
    const { loadBeatmap } = beatmapStore;
    useEffect(() => {
        loadBeatmap(leaderboardId, beatmapId);
    }, [loadBeatmap, leaderboardId, beatmapId]);

    const beatmap = beatmapStore.beatmap;

    // use effect to update title
    const { isLoading } = beatmapStore;
    useEffect(() => {
        if (isLoading) {
            document.title = "Loading...";
        } else if (beatmap) {
            document.title = `${beatmap.title} - osu!chan`;
        } else {
            document.title = "Beatmap not found - osu!chan";
        }
    }, [isLoading, beatmap]);

    return (
        <>
            {beatmapStore.isLoading && (
                <div className={classes.loader}>
                    <CircularProgress color="inherit" size={70} />
                    <Typography variant="h4" align="center">Loading</Typography>
                </div>
            )}
            {beatmap && (
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Paper>
                            <Typography className={classes.paperHeader} variant="h4" align="center">
                                <UILink color="inherit" href={`https://osu.ppy.sh/b/${beatmapId}`}>
                                    {beatmap.artist} - {beatmap.title} [{beatmap.difficultyName}]
                                    <Typography variant="subtitle1" color="textSecondary" align="center">
                                        by {beatmap.creatorName}
                                    </Typography>
                                </UILink>
                            </Typography>
                            <div className={classes.beatmapStats}>
                                <Grid container justify="center">
                                    <Grid item xs={6} sm={4} lg={2}>
                                        <Typography variant="h6" noWrap align="center">
                                            {beatmap.gamemode === 3 ? "Keys" : "Circle Size"}
                                        </Typography>
                                        <Typography variant="h4" align="center">
                                            {beatmap.circleSize.toFixed(beatmap.gamemode === 3 ? 0 : 1)}
                                        </Typography>
                                    </Grid>
                                    {(beatmap.gamemode === 0 || beatmap.gamemode === 2) && (
                                        <Grid item xs={6} sm={4} lg={2}>
                                            <Typography variant="h6" noWrap align="center">
                                                Approach Rate
                                            </Typography>
                                            <Typography variant="h4" align="center">
                                                {beatmap.approachRate.toFixed(1)}
                                            </Typography>
                                        </Grid>
                                    )}
                                    <Grid item xs={6} sm={4} lg={2}>
                                        <Typography variant="h6" noWrap align="center">
                                            Overall Difficulty
                                        </Typography>
                                        <Typography variant="h4" align="center">
                                            {beatmap.overallDifficulty.toFixed(1)}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6} sm={4} lg={2}>
                                        <Typography variant="h6" noWrap align="center">
                                            Star Rating
                                        </Typography>
                                        <Typography variant="h4" align="center">
                                            {beatmap.starRating.toFixed(2)}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6} sm={4} lg={2}>
                                        <Typography variant="h6" noWrap align="center">
                                            BPM
                                        </Typography>
                                        <Typography variant="h4" align="center">
                                            {beatmap.bpm.toFixed(0)}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6} sm={4} lg={2}>
                                        <Typography variant="h6" noWrap align="center">
                                            Length
                                        </Typography>
                                        <Typography variant="h4" align="center">
                                            {formatTime(beatmap.drainTime)}
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
                                        <TableCell>Player</TableCell>
                                        <TableCell align="center">Mods</TableCell>
                                        <TableCell align="center">Accuracy</TableCell>
                                        <TableCell align="center">PP</TableCell>
                                        <TableCell align="center">Result</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {beatmapStore.scores.map((score, i) => {
                                        const userStats = score.userStats as UserStats;
                                        const osuUser = userStats.osuUser as OsuUser;

                                        return (
                                            <TableRow hover>
                                                <TableCell>{i+1}</TableCell>
                                                <TableCell><Link className={classes.tableLink} to={`/leaderboards/${leaderboardId}/users/${osuUser.id}`}>{osuUser.username}</Link></TableCell>
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
            {!beatmapStore.isLoading && !beatmap && (
                <div className={classes.loader}>
                    <Typography variant="h3" align="center">
                        Leaderboard beatmap not found!
                    </Typography>
                </div>
            )}
        </>
    );
}

interface RouteParams {
    beatmapId: string;
    leaderboardId: string;
}

interface LeaderboardBeatmapProps extends RouteComponentProps<RouteParams> {}

export default observer(LeaderboardBeatmap);
