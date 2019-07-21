import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { makeStyles, Theme, createStyles, Typography, CircularProgress, Paper, Grid, CardContent, Card, Divider, List, ListItem, ListItemText, Chip, Avatar, Button, Dialog, DialogTitle, DialogContent, TextField, DialogActions, Select, MenuItem, InputLabel, FormControl, FormControlLabel, Checkbox } from "@material-ui/core";

import { StoreState } from "../../store/reducers";
import { LeaderboardsListState } from "../../store/leaderboards/list/types";
import { leaderboardsListGetThunk, leaderboardsListPostThunk } from "../../store/leaderboards/list/actions"
import { LeaderboardsDataState } from "../../store/data/leaderboards/types";
import { ProfilesDataState } from "../../store/data/profiles/types";
import { MeState } from "../../store/me/types";

const useStyles = makeStyles((theme: Theme) => createStyles({
    loader: {
        textAlign: "center",
        marginTop: 150
    },
    cardLink: {
        color: "inherit",
        textDecoration: "none"
    },
    globalLeaderboardsPaper: {
        padding: theme.spacing(2)
    },
    globalLeaderboardDetails: {
        display: "flex"
    },
    globalLeaderboardText: {
        flexGrow: 1
    },
    globalLeaderboardImage: {
        alignSelf: "center"
    },
    createButton: {
        margin: theme.spacing(2),
        width: theme.spacing(32)
    },
    formHeading: {
        marginTop: theme.spacing(2)
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 200
    },
    communityLeaderboardImage: {
        margin: theme.spacing(1)
    },
    communityLeaderboardChip: {
        marginRight: theme.spacing(1)
    }
}));

function LeaderboardList(props: LeaderboardListProps) {
    const classes = useStyles();

    // use effect to fetch leaderboards data
    const { leaderboardsListGetThunk } = props;
    useEffect(() => {
        leaderboardsListGetThunk();
    }, [leaderboardsListGetThunk]);

    // use effect to update title
    const { isFetching } = props.leaderboardsList;
    useEffect(() => {
        if (isFetching) {
            document.title = "Loading...";
        } else {
            document.title = "Leaderboards - osu!chan";
        }
    }, [isFetching]);

    const [gamemode, setGamemode] = useState(0);
    const [accessType, setAccessType] = useState(1);
    const [name, setName] = useState();
    const [description, setDescription] = useState();
    const [allowPastScores, setAllowPastScores] = useState(true);
    const [allowedBeatmapStatus, setAllowedBeatmapStatus] = useState(1);
    const [oldestBeatmapDate, setOldestBeatmapDate] = useState();
    const [newestBeatmapDate, setNewestBeatmapDate] = useState();
    const [oldestScoreDate, setOldestScoreDate] = useState();
    const [newestScoreDate, setNewestScoreDate] = useState();
    const [lowestAr, setLowestAr] = useState();
    const [highestAr, setHighestAr] = useState();
    const [lowestOd, setLowestOd] = useState();
    const [highestOd, setHighestOd] = useState();
    const [lowestCs, setLowestCs] = useState();
    const [highestCs, setHighestCs] = useState();
    const [requiredMods, setRequiredMods] = useState<number[]>([]);
    const [disqualifiedMods, setDisqualifiedMods] = useState<number[]>([]);
    const [lowestAccuracy, setLowestAccuracy] = useState();
    const [highestAccuracy, setHighestAccuracy] = useState();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // dispatch create action
        props.leaderboardsListPostThunk(
            gamemode,
            accessType,
            name,
            description || "",
            allowPastScores,
            allowedBeatmapStatus,
            oldestBeatmapDate ? new Date(oldestBeatmapDate) : null,
            newestBeatmapDate ? new Date(newestBeatmapDate) : null,
            oldestScoreDate ? new Date(oldestScoreDate) : null,
            newestScoreDate ? new Date(newestScoreDate) : null,
            lowestAr ? parseFloat(lowestAr) : null,
            highestAr ? parseFloat(highestAr) : null,
            lowestOd ? parseFloat(lowestOd) : null,
            highestOd ? parseFloat(highestOd) : null,
            lowestCs ? parseFloat(lowestCs) : null,
            highestCs ? parseFloat(highestCs) : null,
            requiredMods.reduce((total, value) => total | value, 0),
            disqualifiedMods.reduce((total, value) => total | value, 0),
            lowestAccuracy ? parseFloat(lowestAccuracy) : null,
            highestAccuracy ? parseFloat(highestAccuracy) : null
        )

        setCreateDialogOpen(false);
        clearInputs();
    }
    const clearInputs = () => {
        setGamemode(0);
        setAccessType(1);
        setName(null);
        setDescription(null);
        setAllowPastScores(true);
        setAllowedBeatmapStatus(1);
        setOldestBeatmapDate(null);
        setNewestBeatmapDate(null);
        setOldestScoreDate(null);
        setNewestScoreDate(null);
        setLowestAr(null);
        setHighestAr(null);
        setLowestOd(null);
        setHighestOd(null);
        setLowestCs(null);
        setHighestCs(null);
        setRequiredMods([]);
        setDisqualifiedMods([]);
        setLowestAccuracy(null);
        setHighestAccuracy(null);

        setCreateDialogOpen(false);
    }

    const [createDialogOpen, setCreateDialogOpen] = useState(false);

    const leaderboards = props.leaderboardsList.leaderboardIds.map(id => props.leaderboardsData.leaderboards[id]);

    return (
        <>
        {props.leaderboardsList.isFetching ? (
            <div className={classes.loader}>
                <CircularProgress color="inherit" size={70} />
                <Typography variant="h4" align="center">Loading</Typography>
            </div>
        ) : (
            <>
                <Typography variant="h4" align="center" gutterBottom>
                    Global Leaderboards
                </Typography>
                <Grid container spacing={2} justify="center">
                    {leaderboards.filter(leaderboard => leaderboard.accessType === 0).map((leaderboard) => (
                        <Grid item xs={12} md={6} lg={4}>
                            <Card>
                                <Link className={classes.cardLink} to={`/leaderboards/${leaderboard.id}`}>
                                    <CardContent>
                                        <div className={classes.globalLeaderboardDetails}>
                                            <div className={classes.globalLeaderboardText}>
                                                <Typography variant="h5">
                                                    {leaderboard.name}
                                                </Typography>
                                                <Typography variant="subtitle1" color="textSecondary" paragraph>
                                                    {leaderboard.description}
                                                </Typography>
                                            </div>
                                            <img className={classes.globalLeaderboardImage} src={leaderboard.iconUrl} alt="Leaderboard" />
                                        </div>
                                    </CardContent>
                                </Link>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                <br />
                
                <Typography variant="h4" align="center" gutterBottom>
                    Community Leaderboards
                </Typography>

                <Paper>
                    {props.me.osuUserId && (
                        <>
                            {props.leaderboardsList.isPosting ? (
                                <Button color="primary" disabled className={classes.createButton} variant="contained" size="large">
                                    <CircularProgress size={26} color="inherit" />
                                </Button>
                            ) : (
                                <Button color="primary" className={classes.createButton} variant="contained" size="large" onClick={() => setCreateDialogOpen(true)}>
                                    Create new leaderboard
                                </Button>
                            )}
                            <Dialog fullWidth open={createDialogOpen} onClose={clearInputs}>
                                <form onSubmit={handleSubmit}>
                                    <DialogTitle>Create new leaderboard</DialogTitle>
                                    <DialogContent>
                                        {/* Basic details */}
                                        <TextField className={classes.formControl} onChange={e => setName(e.currentTarget.value)} margin="dense" fullWidth required label="Name" />
                                        <FormControl className={classes.formControl}>
                                            <InputLabel htmlFor="gamemode_select">Gamemode</InputLabel>
                                            <Select inputProps={{ id: "gamemode_select" }} value={gamemode} onChange={e => setGamemode(parseInt(e.target.value as string))}>
                                                <MenuItem value={0}>osu!</MenuItem>
                                                <MenuItem value={1}>osu!taiko</MenuItem>
                                                <MenuItem value={2}>osu!catch</MenuItem>
                                                <MenuItem value={3}>osu!mania</MenuItem>
                                            </Select>
                                        </FormControl>
                                        <FormControl className={classes.formControl}>
                                            <InputLabel htmlFor="access_type_select">Type</InputLabel>
                                            <Select inputProps={{ id: "access_type_select" }} value={accessType} onChange={e => setAccessType(parseInt(e.target.value as string))}>
                                                <MenuItem value={1}>Public</MenuItem>
                                                <MenuItem value={2}>Public (Invite-only)</MenuItem>
                                                <MenuItem value={3}>Private</MenuItem>
                                            </Select>
                                        </FormControl>
                                        <TextField className={classes.formControl} multiline onChange={e => setDescription(e.currentTarget.value)} margin="dense" fullWidth label="Description" />
                                    
                                        {/* Score filters */}
                                        <Typography className={classes.formHeading} variant="h6">Score filters</Typography>
                                        {/* Past scores */}
                                        <FormControlLabel className={classes.formControl} label="Allow scores prior to member joining" control={
                                            <Checkbox checked={allowPastScores} value="checkedAllowPastScores" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAllowPastScores(e.target.checked)} />
                                        } />
                                        <br />
                                        {/* Beatmap status */}
                                        <FormControl className={classes.formControl}>
                                            <InputLabel htmlFor="allowed_beatmap_status_select">Allowed Beatmap Status</InputLabel>
                                            <Select inputProps={{ id: "allowed_beatmap_status_select" }} value={allowedBeatmapStatus} onChange={e => setAllowedBeatmapStatus(parseInt(e.target.value as string))}>
                                                <MenuItem value={0}>Ranked or Loved</MenuItem>
                                                <MenuItem value={1}>Ranked only</MenuItem>
                                                <MenuItem value={2}>Loved only</MenuItem>
                                            </Select>
                                        </FormControl>
                                        <br />
                                        {/* Dates */}
                                        <TextField className={classes.formControl} inputProps={{ "pattern": "\\d{4}-\\d{2}-\\d{2}( \\d{2}:\\d{2}( GMT\\+\\d{4})?)?"}} value={oldestBeatmapDate} onChange={e => setOldestBeatmapDate(e.currentTarget.value)} margin="dense" label="Oldest Beatmap Date" placeholder="YYYY-MM-DD" />
                                        <TextField className={classes.formControl} inputProps={{ "pattern": "\\d{4}-\\d{2}-\\d{2}( \\d{2}:\\d{2}( GMT\\+\\d{4})?)?"}} value={newestBeatmapDate} onChange={e => setNewestBeatmapDate(e.currentTarget.value)} margin="dense" label="Newest Beatmap Date" placeholder="YYYY-MM-DD" />
                                        <TextField className={classes.formControl} inputProps={{ "pattern": "\\d{4}-\\d{2}-\\d{2}( \\d{2}:\\d{2}( GMT\\+\\d{4})?)?"}} value={oldestScoreDate} onChange={e => setOldestScoreDate(e.currentTarget.value)} margin="dense" label="Oldest Score Date" placeholder="YYYY-MM-DD" />
                                        <TextField className={classes.formControl} inputProps={{ "pattern": "\\d{4}-\\d{2}-\\d{2}( \\d{2}:\\d{2}( GMT\\+\\d{4})?)?"}} value={newestScoreDate} onChange={e => setNewestScoreDate(e.currentTarget.value)} margin="dense" label="Newest Score Date" placeholder="YYYY-MM-DD" />
                                        <br />
                                        {/* Mods */}
                                        <FormControl className={classes.formControl}>
                                            <InputLabel htmlFor="required_mods_select">Required mods</InputLabel>
                                            <Select inputProps={{ id: "required_mods_select" }} multiple value={requiredMods} onChange={e => setRequiredMods(e.target.value as number[])}>
                                                {/* Common mods */}
                                                {gamemode === 3 && <MenuItem value={1048576}>FI</MenuItem>}
                                                <MenuItem value={8}>HD</MenuItem>
                                                {gamemode !== 3 && <MenuItem value={16}>HR</MenuItem>}
                                                <MenuItem value={64}>DT</MenuItem>
                                                <MenuItem value={512}>NC</MenuItem>
                                                <MenuItem value={1024}>FL</MenuItem>
                                                <MenuItem value={2}>EZ</MenuItem>
                                                <MenuItem value={256}>HT</MenuItem>
                                                {/* Special mods */}
                                                <MenuItem value={1}>NF</MenuItem>
                                                <MenuItem value={32}>SD</MenuItem>
                                                <MenuItem value={16384}>PF</MenuItem>
                                                {gamemode === 0 && <MenuItem value={4096}>SO</MenuItem>}
                                                {gamemode === 0 && <MenuItem value={4}>TD</MenuItem>}
                                            </Select>
                                        </FormControl>
                                        <FormControl className={classes.formControl}>
                                            <InputLabel htmlFor="disqualified_mods_select">Disqualified mods</InputLabel>
                                            <Select inputProps={{ id: "disqualified_mods_select" }} multiple value={disqualifiedMods} onChange={e => setDisqualifiedMods(e.target.value as number[])}>
                                                {/* Common mods */}
                                                {gamemode === 3 && <MenuItem value={1048576}>FI</MenuItem>}
                                                <MenuItem value={8}>HD</MenuItem>
                                                {gamemode !== 3 && <MenuItem value={16}>HR</MenuItem>}
                                                <MenuItem value={64}>DT</MenuItem>
                                                <MenuItem value={512}>NC</MenuItem>
                                                <MenuItem value={1024}>FL</MenuItem>
                                                <MenuItem value={2}>EZ</MenuItem>
                                                <MenuItem value={256}>HT</MenuItem>
                                                {/* Special mods */}
                                                <MenuItem value={1}>NF</MenuItem>
                                                <MenuItem value={32}>SD</MenuItem>
                                                <MenuItem value={16384}>PF</MenuItem>
                                                {gamemode === 0 && <MenuItem value={4096}>SO</MenuItem>}
                                                {gamemode === 0 && <MenuItem value={4}>TD</MenuItem>}
                                            </Select>
                                        </FormControl>
                                        {/* Ranges */}
                                        {(gamemode === 0 || gamemode === 2) && (
                                            <>
                                                <TextField className={classes.formControl} onChange={e => setLowestAr(e.currentTarget.value)} margin="dense" label="Min AR" />
                                                <TextField className={classes.formControl} onChange={e => setHighestAr(e.currentTarget.value)} margin="dense" label="Max AR" />
                                            </>
                                        )}
                                        <TextField className={classes.formControl} onChange={e => setLowestOd(e.currentTarget.value)} margin="dense" label="Min OD" />
                                        <TextField className={classes.formControl} onChange={e => setHighestOd(e.currentTarget.value)} margin="dense" label="Max OD" />
                                        <TextField className={classes.formControl} onChange={e => setLowestCs(e.currentTarget.value)} margin="dense" label={gamemode === 3 ? "Min Keys" : "Min CS"} />
                                        <TextField className={classes.formControl} onChange={e => setHighestCs(e.currentTarget.value)} margin="dense" label={gamemode === 3 ? "Max Keys" : "Max CS"} />
                                        <TextField className={classes.formControl} onChange={e => setLowestAccuracy(e.currentTarget.value)} margin="dense" label="Min Accuracy (%)" />
                                        <TextField className={classes.formControl} onChange={e => setHighestAccuracy(e.currentTarget.value)} margin="dense" label="Max Accuracy (%)" />
                                    </DialogContent>
                                    <DialogActions>
                                        <Button onClick={clearInputs}>
                                            Cancel
                                        </Button>
                                        <Button type="submit">
                                            Create
                                        </Button>
                                    </DialogActions>
                                </form>
                            </Dialog>
                            <Divider />
                        </>
                    )}
                    <List>
                        {props.leaderboardsList.leaderboardIds.map(id => props.leaderboardsData.leaderboards[id]).filter(leaderboard => leaderboard.accessType !== 0).map((leaderboard) => {
                            const owner = props.profilesData.osuUsers[leaderboard.ownerId!];

                            return (
                                <ListItem button component={Link} to={`/leaderboards/${leaderboard.id}`}>
                                    <img className={classes.communityLeaderboardImage} src={leaderboard.iconUrl || "https://osu.ppy.sh/images/badges/mods/mod_coop@2x.png"} alt="Leaderboard icon" />
                                    <ListItemText
                                        primary={leaderboard.name}
                                        primaryTypographyProps={{
                                            variant: "h6"
                                        }}
                                        secondary={
                                            <>
                                                <Chip className={classes.communityLeaderboardChip} size="small" label={owner.username} avatar={<Avatar src={`https://a.ppy.sh/${owner.id}`} />} />
                                                {leaderboard.accessType === 2 && (
                                                    <Chip className={classes.communityLeaderboardChip} size="small" label="INVITE-ONLY" />
                                                )}
                                                {leaderboard.accessType === 3 && (
                                                    <Chip className={classes.communityLeaderboardChip} size="small" label="PRIVATE" />
                                                )}
                                            </>
                                        }
                                    />
                                </ListItem>
                            );
                        })}
                    </List>
                </Paper>
            </>
        )}
        </>
    );
}

interface LeaderboardListProps {
    leaderboardsListGetThunk: () => void;
    leaderboardsListPostThunk: (
        gamemode: number,
        accessType: number,
        name: string,
        description: string,
        allowPastScores: boolean | null,
        allowedBeatmapStatus: number,
        oldestBeatmapDate: Date | null,
        newestBeatmapDate: Date | null,
        oldestScoreDate: Date | null,
        newestScoreDate: Date | null,
        lowestAr: number | null,
        highestAr: number | null,
        lowestOd: number | null,
        highestOd: number | null,
        lowestCs: number | null,
        highestCs: number | null,
        requiredMods: number,
        disqualifiedMods: number,
        lowestAccuracy: number | null,
        highestAccuracy: number | null
    ) => void;
    leaderboardsList: LeaderboardsListState;
    leaderboardsData: LeaderboardsDataState;
    profilesData: ProfilesDataState;
    me: MeState;
}

function mapStateToProps(state: StoreState) {
    return {
        leaderboardsList: state.leaderboards.list,
        leaderboardsData: state.data.leaderboards,
        profilesData: state.data.profiles,
        me: state.me
    }
}

const mapDispatchToProps = {
    leaderboardsListGetThunk,
    leaderboardsListPostThunk
}

export default connect(mapStateToProps, mapDispatchToProps)(LeaderboardList);
