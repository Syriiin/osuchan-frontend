import React, { useEffect } from "react";
import { connect } from "react-redux";
import { RouteComponentProps } from "react-router";
import { Link } from "react-router-dom";
import { CircularProgress, Typography, Grid, Paper, Table, TableHead, TableRow, TableCell, TableBody, makeStyles, Theme, createStyles, Tooltip } from "@material-ui/core";

import { StoreState } from "../../../store/reducers";
import { ProfilesDataState } from "../../../store/data/profiles/types";
import { LeaderboardsDataState } from "../../../store/data/leaderboards/types";
import { LeaderboardsUserState } from "../../../store/leaderboards/user/types";
import { leaderboardsUserThunkFetch } from "../../../store/leaderboards/user/actions";
import { formatMods, formatScoreResult } from "../../../utils/formatting";

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
    const classes = useStyles();

    // use effect to fetch leaderboards data
    const leaderboardId = parseInt(props.match.params.leaderboardId);
    const userId = parseInt(props.match.params.userId);
    const { leaderboardsUserThunkFetch } = props;
    useEffect(() => {
        leaderboardsUserThunkFetch(leaderboardId, userId);
    }, [leaderboardsUserThunkFetch, leaderboardId, userId]);

    const membership = props.leaderboardsUser.membershipId ? props.leaderboardsData.memberships[props.leaderboardsUser.membershipId] : null;
    const osuUser = membership ? props.profilesData.osuUsers[membership.osuUserId] : null;

    // use effect to update title
    const { isFetching } = props.leaderboardsUser;
    useEffect(() => {
        if (isFetching) {
            document.title = "Loading...";
        } else if (osuUser) {
            document.title = `${osuUser.username} - osu!chan`;
        } else {
            document.title = "User not found - osu!chan";
        }
    }, [isFetching, osuUser]);

    return (
        <>
            {props.leaderboardsUser.isFetching && (
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
                                {osuUser.username}
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
                                    {props.leaderboardsUser.scoreIds.map((scoreId, i) => {
                                        const score = props.profilesData.scores[scoreId];
                                        const beatmap = props.profilesData.beatmaps[score.beatmapId];
                                        
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
            {!isFetching && !osuUser && (
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

interface LeaderboardUserProps extends RouteComponentProps<RouteParams> {
    leaderboardsUserThunkFetch: (leaderboardId: number, userId: number) => void;
    leaderboardsUser: LeaderboardsUserState;
    leaderboardsData: LeaderboardsDataState;
    profilesData: ProfilesDataState;
}

function mapStateToProps(state: StoreState) {
    return {
        leaderboardsUser: state.leaderboards.user,
        leaderboardsData: state.data.leaderboards,
        profilesData: state.data.profiles
    }
}

const mapDispatchToProps = {
    leaderboardsUserThunkFetch
}

export default connect(mapStateToProps, mapDispatchToProps)(LeaderboardUser);
