import React, { useContext, useState } from "react";
import Switch from "react-switch";

import { SimpleModal, SimpleModalTitle, TextInput, ModsSelect, TextField, FormLabel, FormControl, Button } from "../../components";
import { StoreContext } from "../../store";
import { ThemeProps, DefaultTheme, withTheme } from "styled-components";

function CreateLeaderboardModal(props: CreateLeaderboardModalProps) {
    const store = useContext(StoreContext);
    const listStore = store.leaderboardsStore.listStore;

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
    const [requiredMods, setRequiredMods] = useState(0);
    const [disqualifiedMods, setDisqualifiedMods] = useState(0);
    const [lowestAccuracy, setLowestAccuracy] = useState();
    const [highestAccuracy, setHighestAccuracy] = useState();

    const handleCreateLeaderboardSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // dispatch create action
        listStore.createLeaderboard(
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
            requiredMods,
            disqualifiedMods,
            lowestAccuracy ? parseFloat(lowestAccuracy) : null,
            highestAccuracy ? parseFloat(highestAccuracy) : null
        )

        props.onClose();
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
        setRequiredMods(0);
        setDisqualifiedMods(0);
        setLowestAccuracy(null);
        setHighestAccuracy(null);

        props.onClose();
    }

    return (
        <SimpleModal open={props.open} onClose={() => props.onClose()}>
            <SimpleModalTitle>Create Leaderboard</SimpleModalTitle>
            <form onSubmit={handleCreateLeaderboardSubmit}>
                {/* Basic details */}
                <FormLabel>Name</FormLabel>
                <TextInput fullWidth required value={name} onChange={e => setName(e.currentTarget.value)} />
                <FormLabel>Gamemode</FormLabel>
                <FormControl>
                    <select value={gamemode} onChange={e => setGamemode(parseInt(e.target.value as string))}>
                        <option value={0}>osu!</option>
                        <option value={1}>osu!taiko</option>
                        <option value={2}>osu!catch</option>
                        <option value={3}>osu!mania</option>
                    </select>
                </FormControl>
                <FormLabel>Type</FormLabel>
                <FormControl>
                    <select value={accessType} onChange={e => setAccessType(parseInt(e.target.value as string))}>
                        <option value={1}>Public</option>
                        <option value={2}>Public (Invite-only)</option>
                        <option value={3}>Private</option>
                    </select>
                </FormControl>
                <FormLabel>Description</FormLabel>
                <TextField fullWidth value={description} onChange={e => setDescription(e.currentTarget.value)} />

                {/* Score filters */}
                <h3>Score filters</h3>
                
                {/* Past scores */}
                <FormLabel>Allow scores prior to member joining</FormLabel>
                <FormControl>
                    <Switch
                        checked={allowPastScores}
                        onChange={(checked, event, id) => setAllowPastScores(checked)}
                        uncheckedIcon={false}
                        checkedIcon={false}
                        offColor={props.theme.colours.currant}
                        onColor={props.theme.colours.mystic}
                    />
                </FormControl>
                
                {/* Beatmap status */}
                <FormLabel>Allowed Beatmap Status</FormLabel>
                <FormControl>
                    <select value={allowedBeatmapStatus} onChange={e => setAllowedBeatmapStatus(parseInt(e.target.value as string))}>
                        <option value={0}>Ranked or Loved</option>
                        <option value={1}>Ranked only</option>
                        <option value={2}>Loved only</option>
                    </select>
                </FormControl>
                
                {/* Dates */}
                <FormLabel>Oldest Beatmap Date</FormLabel>
                <FormControl>
                    <TextInput pattern="\\d{4}-\\d{2}-\\d{2}( \\d{2}:\\d{2}( GMT\\+\\d{4})?)?" value={oldestBeatmapDate} onChange={e => setOldestBeatmapDate(e.currentTarget.value)} placeholder="YYYY-MM-DD" />
                </FormControl>
                <FormLabel>Newest Beatmap Date</FormLabel>
                <FormControl>
                    <TextInput pattern="\\d{4}-\\d{2}-\\d{2}( \\d{2}:\\d{2}( GMT\\+\\d{4})?)?" value={newestBeatmapDate} onChange={e => setNewestBeatmapDate(e.currentTarget.value)} placeholder="YYYY-MM-DD" />
                </FormControl>
                <FormLabel>Oldest Score Date</FormLabel>
                <FormControl>
                    <TextInput pattern="\\d{4}-\\d{2}-\\d{2}( \\d{2}:\\d{2}( GMT\\+\\d{4})?)?" value={oldestScoreDate} onChange={e => setOldestScoreDate(e.currentTarget.value)} placeholder="YYYY-MM-DD" />
                </FormControl>
                <FormLabel>Newest Score Date</FormLabel>
                <FormControl>
                    <TextInput pattern="\\d{4}-\\d{2}-\\d{2}( \\d{2}:\\d{2}( GMT\\+\\d{4})?)?" value={newestScoreDate} onChange={e => setNewestScoreDate(e.currentTarget.value)} placeholder="YYYY-MM-DD" />
                </FormControl>
                
                {/* Mods */}
                <FormLabel>Required Mods</FormLabel>
                <FormControl>
                    <ModsSelect gamemode={gamemode} value={requiredMods} onChange={mods => setRequiredMods(mods)} />
                </FormControl>
                <FormLabel>Disqualified mods</FormLabel>
                <FormControl>
                    <ModsSelect gamemode={gamemode} value={disqualifiedMods} onChange={mods => setDisqualifiedMods(mods)} />
                </FormControl>
                
                {/* Ranges */}
                {(gamemode === 0 || gamemode === 2) && (
                    <>
                        <FormLabel>Min AR</FormLabel>
                        <FormControl>
                            <TextInput value={lowestAr} onChange={e => setLowestAr(e.currentTarget.value)} />
                        </FormControl>
                        <FormLabel>Max AR</FormLabel>
                        <FormControl>
                            <TextInput value={highestAr} onChange={e => setHighestAr(e.currentTarget.value)} />
                        </FormControl>
                    </>
                )}
                <FormLabel>Min OD</FormLabel>
                <FormControl>
                    <TextInput value={lowestOd} onChange={e => setLowestOd(e.currentTarget.value)} />
                </FormControl>
                <FormLabel>Max OD</FormLabel>
                <FormControl>
                    <TextInput value={highestOd} onChange={e => setHighestOd(e.currentTarget.value)} />
                </FormControl>
                <FormLabel>Min {gamemode === 3 ? "Keys" : "CS"}</FormLabel>
                <FormControl>
                    <TextInput value={lowestCs} onChange={e => setLowestCs(e.currentTarget.value)} />
                </FormControl>
                <FormLabel>Max {gamemode === 3 ? "Keys" : "CS"}</FormLabel>
                <FormControl>
                    <TextInput value={highestCs} onChange={e => setHighestCs(e.currentTarget.value)} />
                </FormControl>
                <FormLabel>Min Accuracy(%)</FormLabel>
                <FormControl>
                    <TextInput value={lowestAccuracy} onChange={e => setLowestAccuracy(e.currentTarget.value)} />
                </FormControl>
                <FormLabel>Max Accuracy (%)</FormLabel>
                <FormControl>
                    <TextInput value={highestAccuracy} onChange={e => setHighestAccuracy(e.currentTarget.value)} />
                </FormControl>
                <Button type="submit">Create</Button>
            </form>
        </SimpleModal>
    );
}

interface CreateLeaderboardModalProps extends ThemeProps<DefaultTheme> {
    open: boolean;
    onClose: () => void;
}

export default withTheme(CreateLeaderboardModal);
