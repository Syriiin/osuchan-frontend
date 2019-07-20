import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { RouteComponentProps } from "react-router";
import { Link } from "react-router-dom";
import { Typography, Paper, Chip, Avatar, makeStyles, Theme, createStyles, Grid, CircularProgress, Table, TableHead, TableRow, TableCell, TableBody, Button, Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions, Tooltip, Link as UILink } from "@material-ui/core";
import { red } from "@material-ui/core/colors";

import { StoreState } from "../../../store/reducers";
import { ProfilesDataState } from "../../../store/data/profiles/types";
import { LeaderboardsDataState } from "../../../store/data/leaderboards/types";
import { LeaderboardsDetailState } from "../../../store/leaderboards/detail/types";
import { leaderboardsDetailGetThunk, leaderboardsDetailDeleteThunk, leaderboardsDetailPostInviteThunk } from "../../../store/leaderboards/detail/actions";
import { formatGamemodeName, formatMods } from "../../../utils/formatting";
import { MeState } from "../../../store/me/types";
import { meJoinLeaderboardPostThunk, meLeaveLeaderboardDeleteThunk } from "../../../store/me/actions";

const useStyles = makeStyles((theme: Theme) => createStyles({
    loader: {
        textAlign: "center",
        marginTop: 150
    },
    detailsPaper: {
        padding: theme.spacing(2)
    },
    chip: {
        marginRight: theme.spacing(1)
    },
    leaveButton: {
        color: red[300],
        width: theme.spacing(21)
    },
    joinButton: {
        width: theme.spacing(20)
    },
    deleteButton: {
        color: red[300],
        width: theme.spacing(22)
    },
    inviteButton: {
        width: theme.spacing(15)
    },
    myProfileButton: {
        margin: theme.spacing(2)
    },
    paperHeader: {
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

function LeaderboardHome(props: LeaderboardHomeProps) {
    const classes = useStyles();

    // use effect to fetch leaderboards data
    const leaderboardId = parseInt(props.match.params.leaderboardId);
    const { leaderboardsDetailGetThunk: leaderboardsDetailThunkFetch } = props;
    useEffect(() => {
        leaderboardsDetailThunkFetch(leaderboardId);
    }, [leaderboardsDetailThunkFetch, leaderboardId]);

    const leaderboard = props.leaderboardsDetail.leaderboardId ? props.leaderboardsData.leaderboards[props.leaderboardsDetail.leaderboardId] : null;

    // use effect to update title
    const { isFetching } = props.leaderboardsDetail;
    useEffect(() => {
        if (isFetching) {
            document.title = "Loading...";
        } else if (leaderboard) {
            document.title = `${leaderboard.name} - osu!chan`;
        } else {
            document.title = "Leaderboard not found - osu!chan";
        }
    }, [isFetching, leaderboard]);

    const handleDelete = () => props.leaderboardsDetailDeleteThunk(leaderboard!.id);
    const handleJoin = () => props.meJoinLeaderboardPostThunk(leaderboard!.id);
    const handleLeave = () => props.meLeaveLeaderboardDeleteThunk(leaderboard!.id);
    
    const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
    const [inviteUserUrl, setInviteUserUrl] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const userUrlRe = new RegExp(/osu.ppy.sh\/users\/(\d+)/, "g");
        let match;
        const userIds = [];
        while ((match = userUrlRe.exec(inviteUserUrl)) !== null) {
            userIds.push(parseInt(match[1]));
        }

        if (userIds.length > 0) {
            props.leaderboardsDetailPostInviteThunk(leaderboard!.id, userIds);
            setInviteDialogOpen(false);
        }
    }
    const handleClose = () => {
        setInviteUserUrl("");
        setInviteDialogOpen(false);
    }

    return (
        <>
            {props.leaderboardsDetail.isFetching && (
                <div className={classes.loader}>
                    <CircularProgress color="inherit" size={70} />
                    <Typography variant="h4" align="center">Loading</Typography>
                </div>
            )}
            {leaderboard && (
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Paper className={classes.detailsPaper}>
                            <Typography variant="h4" gutterBottom>
                                {leaderboard.name}
                            </Typography>
                            {leaderboard.description && (
                                <Typography variant="subtitle1" paragraph>
                                    {leaderboard.description}
                                </Typography>
                            )}
                            <Chip className={classes.chip} label={formatGamemodeName(leaderboard.gamemode)} />
                            {leaderboard.accessType === 0 ? (
                                <Chip className={classes.chip} label="GLOBAL" />
                                ) : (
                                <>
                                    <Chip className={classes.chip} label={props.profilesData.osuUsers[leaderboard.ownerId!].username} avatar={<Avatar src={`https://a.ppy.sh/${leaderboard.ownerId}`} />} />
                                    {leaderboard.accessType === 2 && (
                                        <Chip className={classes.chip} label="INVITE-ONLY" />
                                    )}
                                    {leaderboard.accessType === 3 && (
                                        <Chip className={classes.chip} label="PRIVATE" />
                                    )}
                                </>
                            )}
                            
                            <ul>
                                {/* Allow past scores */}
                                {!leaderboard.allowPastScores && (
                                    <li>Scores must be made after joining leaderboard</li>
                                )}
                                {/* Mods */}
                                {leaderboard.requiredMods !== 0 && (
                                    <li>Required Mods: {formatMods(leaderboard.requiredMods)}</li>
                                )}
                                {leaderboard.disqualifiedMods !== 0 && (
                                    <li>Disqualified Mods: {formatMods(leaderboard.disqualifiedMods)}</li>
                                )}
                                {/* Beatmap status */}
                                {leaderboard.allowedBeatmapStatus === 0 && (
                                    <li>Beatmap Status: Ranked or Loved</li>
                                )}
                                {leaderboard.allowedBeatmapStatus === 2 && (
                                    <li>Beatmap Status: Loved</li>
                                )}
                                {/* Beatmap date */}
                                {leaderboard.oldestBeatmapDate !== null && (
                                    <li>Oldest Beatmap Date: {leaderboard.oldestBeatmapDate.toLocaleDateString()}</li>
                                )}
                                {leaderboard.newestBeatmapDate !== null && (
                                    <li>Newest Beatmap Date: {leaderboard.newestBeatmapDate.toLocaleDateString()}</li>
                                )}
                                {/* Accuracy */}
                                {leaderboard.lowestAccuracy !== null && (
                                    <li>Min Accuracy: {leaderboard.lowestAccuracy}</li>
                                )}
                                {leaderboard.highestAccuracy !== null && (
                                    <li>Max Accuracy: {leaderboard.highestAccuracy}</li>
                                )}
                                {/* CS */}
                                {leaderboard.lowestCs !== null && (
                                    <li>Min {leaderboard.gamemode === 3 ? "Keys" : "CS"}: {leaderboard.lowestCs}</li>
                                )}
                                {leaderboard.highestCs !== null && (
                                    <li>Max {leaderboard.gamemode === 3 ? "Keys" : "CS"}: {leaderboard.highestCs}</li>
                                )}
                                {/* AR */}
                                {leaderboard.lowestAr !== null && (
                                    <li>Min AR: {leaderboard.lowestAr}</li>
                                )}
                                {leaderboard.highestAr !== null && (
                                    <li>Max AR: {leaderboard.highestAr}</li>
                                )}
                                {/* OD */}
                                {leaderboard.lowestOd !== null && (
                                    <li>Min OD: {leaderboard.lowestOd}</li>
                                )}
                                {leaderboard.highestOd !== null && (
                                    <li>Max OD: {leaderboard.highestOd}</li>
                                )}
                            </ul>
                            
                            {/* If not global leaderboard */}
                            {leaderboard.accessType !== 0 && props.me.osuUserId && (
                                <>
                                    {/* If owner */}
                                    {leaderboard.ownerId === props.me.osuUserId && (
                                        <>
                                            {/* Delete button */}
                                            {props.leaderboardsDetail.isDeleting ? (
                                                <Button disabled className={classes.deleteButton}>
                                                    <CircularProgress size={22} color="inherit" />
                                                </Button>
                                            ) : (
                                                <Button className={classes.deleteButton} onClick={handleDelete}>Delete Leaderboard</Button>
                                            )}

                                            {/* Invite button if either private or public invite-only */}
                                            {(leaderboard.accessType === 2 || leaderboard.accessType === 3) && (
                                                <>
                                                    {props.leaderboardsDetail.isPostingInvite ? (
                                                        <Button className={classes.inviteButton} disabled>
                                                            <CircularProgress size={22} color="inherit" />
                                                        </Button>
                                                    ) : (
                                                        <Button className={classes.inviteButton} onClick={() => setInviteDialogOpen(true)}>Invite Player</Button>
                                                    )}
                                                    <Dialog open={inviteDialogOpen} onClose={handleClose}>
                                                        <form onSubmit={handleSubmit}>
                                                            <DialogTitle>Invite player</DialogTitle>
                                                            <DialogContent>
                                                                <DialogContentText>
                                                                    Enter osu! profile URLs to invite players.
                                                                    <br />
                                                                    URLs must be from the new site so they matches the format below.
                                                                </DialogContentText>
                                                                <TextField
                                                                    autoFocus
                                                                    margin="dense"
                                                                    label="osu! profile URL(s)"
                                                                    placeholder="https://osu.ppy.sh/users/5701575"
                                                                    fullWidth
                                                                    multiline
                                                                    required
                                                                    onChange={e => setInviteUserUrl(e.currentTarget.value)}
                                                                />
                                                            </DialogContent>
                                                            <DialogActions>
                                                                <Button onClick={handleClose}>
                                                                    Cancel
                                                                </Button>
                                                                <Button type="submit">
                                                                    Invite
                                                                </Button>
                                                            </DialogActions>
                                                        </form>
                                                    </Dialog>
                                                </>
                                            )}
                                        </>
                                    )}
                                    
                                    {/* Join button if public or pending invite, and not member */}
                                    {(leaderboard.accessType === 1 || props.me.inviteIds.find(i => props.leaderboardsData.invites[i].leaderboardId === leaderboard.id) !== undefined) && !props.me.leaderboardIds.includes(leaderboard.id) && (
                                        <>
                                            {props.me.isPosting ? (
                                                <Button disabled className={classes.joinButton}>
                                                    <CircularProgress size={22} color="inherit" />
                                                </Button>
                                            ) : (
                                                <Button className={classes.joinButton} onClick={handleJoin}>Join Leaderboard</Button>
                                            )}
                                        </>
                                    )}

                                    {/* Leave button if member and not owner */}
                                    {leaderboard.ownerId !== props.me.osuUserId && props.me.leaderboardIds.includes(leaderboard.id) && (
                                        <>
                                            {props.me.isDeleting ? (
                                                <Button disabled className={classes.leaveButton}>
                                                    <CircularProgress size={22} color="inherit" />
                                                </Button>
                                            ) : (
                                                <Button className={classes.leaveButton} onClick={handleLeave}>Leave Leaderboard</Button>
                                            )}
                                        </>
                                    )}
                                </>
                            )}
                        </Paper>
                    </Grid>
                    <Grid item xs={12}>
                        <Paper>
                            <Typography className={classes.paperHeader} variant="h5" align="center">
                                Rankings
                            </Typography>
                            {props.me.osuUserId && (
                                <UILink component={Link} to={`/leaderboards/${leaderboardId}/users/${props.me.osuUserId}`}>
                                    <Button color="secondary" variant="contained" className={classes.myProfileButton}>My scores</Button>
                                </UILink>
                            )}
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell></TableCell>
                                        <TableCell>Player</TableCell>
                                        <TableCell align="center">Score Count</TableCell>
                                        <TableCell align="center">Performance</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {props.leaderboardsDetail.rankingIds.map((membershipId, i) => {
                                        const membership = props.leaderboardsData.memberships[membershipId];
                                        const osuUser = props.profilesData.osuUsers[membership.osuUserId];

                                        return (
                                            <TableRow hover>
                                                <TableCell>{i+1}</TableCell>
                                                <TableCell><Link className={classes.tableLink} to={`/leaderboards/${leaderboardId}/users/${osuUser.id}`}>{osuUser.username}</Link></TableCell>
                                                <TableCell align="center">{membership.scoreCount}</TableCell>
                                                <TableCell align="center">
                                                    <Tooltip title={`${membership.pp.toFixed(2)}pp`}>
                                                        <Typography>{membership.pp.toFixed(0)}pp</Typography>
                                                    </Tooltip>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </Paper>
                    </Grid>
                </Grid>
            )}
            {!isFetching && !leaderboard && (
                <div className={classes.loader}>
                    <Typography variant="h3" align="center">
                        Leaderboard not found!
                    </Typography>
                </div>
            )}
        </>
    );
}

interface RouteParams {
    leaderboardId: string;
}

interface LeaderboardHomeProps extends RouteComponentProps<RouteParams> {
    leaderboardsDetailGetThunk: (leaderboardId: number) => void;
    leaderboardsDetailDeleteThunk: (leaderboardId: number) => void;
    leaderboardsDetailPostInviteThunk: (leaderboardId: number, userIds: number[]) => void;
    meJoinLeaderboardPostThunk: (leaderboardId: number) => void;
    meLeaveLeaderboardDeleteThunk: (leaderboardId: number) => void;
    leaderboardsDetail: LeaderboardsDetailState;
    leaderboardsData: LeaderboardsDataState;
    profilesData: ProfilesDataState;
    me: MeState;
}

function mapStateToProps(state: StoreState) {
    return {
        leaderboardsDetail: state.leaderboards.detail,
        leaderboardsData: state.data.leaderboards,
        profilesData: state.data.profiles,
        me: state.me
    }
}

const mapDispatchToProps = {
    leaderboardsDetailGetThunk,
    leaderboardsDetailDeleteThunk,
    leaderboardsDetailPostInviteThunk,
    meJoinLeaderboardPostThunk,
    meLeaveLeaderboardDeleteThunk
}

export default connect(mapStateToProps, mapDispatchToProps)(LeaderboardHome);
