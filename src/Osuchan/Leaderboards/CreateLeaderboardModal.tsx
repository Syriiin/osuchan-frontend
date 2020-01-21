import React, { useContext, useState } from "react";
import { ThemeProps, DefaultTheme, withTheme } from "styled-components";

import { SimpleModal, SimpleModalTitle, TextInput, ModsSelect, TextField, FormLabel, FormControl, Button, Switch } from "../../components";
import { StoreContext } from "../../store";
import { AllowedBeatmapStatus, LeaderboardAccessType } from "../../store/models/leaderboards/enums";
import { Gamemode, Mods } from "../../store/models/common/enums";

function CreateLeaderboardModal(props: CreateLeaderboardModalProps) {
    const store = useContext(StoreContext);
    const listStore = store.leaderboardsStore.listStore;

    const [gamemode, setGamemode] = useState(Gamemode.Standard);
    const [accessType, setAccessType] = useState(LeaderboardAccessType.Public);
    const [name, setName] = useState();
    const [description, setDescription] = useState();
    const [allowPastScores, setAllowPastScores] = useState(true);
    const [allowedBeatmapStatus, setAllowedBeatmapStatus] = useState(AllowedBeatmapStatus.RankedOnly);
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

        listStore.createLeaderboard({
            gamemode,
            accessType,
            name,
            description: description || "",
            allowPastScores,
            allowedBeatmapStatus,
            oldestBeatmapDate: oldestBeatmapDate ? new Date(oldestBeatmapDate) : null,
            newestBeatmapDate: newestBeatmapDate ? new Date(newestBeatmapDate) : null,
            oldestScoreDate: oldestScoreDate ? new Date(oldestScoreDate) : null,
            newestScoreDate: newestScoreDate ? new Date(newestScoreDate) : null,
            lowestAr: lowestAr ? parseFloat(lowestAr) : null,
            highestAr: highestAr ? parseFloat(highestAr) : null,
            lowestOd: lowestOd ? parseFloat(lowestOd) : null,
            highestOd: highestOd ? parseFloat(highestOd) : null,
            lowestCs: lowestCs ? parseFloat(lowestCs) : null,
            highestCs: highestCs ? parseFloat(highestCs) : null,
            requiredMods,
            disqualifiedMods,
            lowestAccuracy: lowestAccuracy ? parseFloat(lowestAccuracy) : null,
            highestAccuracy: highestAccuracy ? parseFloat(highestAccuracy) : null
        })

        props.onClose();
        clearInputs();
    }
    
    const clearInputs = () => {
        setGamemode(Gamemode.Standard);
        setAccessType(LeaderboardAccessType.Public);
        setName(null);
        setDescription(null);
        setAllowPastScores(true);
        setAllowedBeatmapStatus(AllowedBeatmapStatus.RankedOnly);
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
        setRequiredMods(Mods.None);
        setDisqualifiedMods(Mods.None);
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
                        <option value={Gamemode.Standard}>osu!</option>
                        <option value={Gamemode.Taiko}>osu!taiko</option>
                        <option value={Gamemode.Catch}>osu!catch</option>
                        <option value={Gamemode.Mania}>osu!mania</option>
                    </select>
                </FormControl>
                <FormLabel>Type</FormLabel>
                <FormControl>
                    <select value={accessType} onChange={e => setAccessType(parseInt(e.target.value as string))}>
                        <option value={LeaderboardAccessType.Public}>Public</option>
                        <option value={LeaderboardAccessType.PublicInviteOnly}>Public (Invite-only)</option>
                        <option value={LeaderboardAccessType.Private}>Private</option>
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
                        mini
                        checked={allowPastScores}
                        onChange={(checked, event, id) => setAllowPastScores(checked)}
                        offColor={props.theme.colours.currant}
                        onColor={props.theme.colours.mystic}
                    />
                </FormControl>
                
                {/* Beatmap status */}
                <FormLabel>Allowed Beatmap Status</FormLabel>
                <FormControl>
                    <select value={allowedBeatmapStatus} onChange={e => setAllowedBeatmapStatus(parseInt(e.target.value as string))}>
                        <option value={AllowedBeatmapStatus.Any}>Ranked or Loved</option>
                        <option value={AllowedBeatmapStatus.RankedOnly}>Ranked only</option>
                        <option value={AllowedBeatmapStatus.LovedOnly}>Loved only</option>
                    </select>
                </FormControl>
                
                {/* Dates */}
                <FormLabel>Oldest Beatmap Date</FormLabel>
                <FormControl>
                    <TextInput pattern="\d{4}-\d{2}-\d{2}( \d{2}:\d{2}( GMT\\+\d{4})?)?" value={oldestBeatmapDate} onChange={e => setOldestBeatmapDate(e.currentTarget.value)} placeholder="YYYY-MM-DD" />
                </FormControl>
                <FormLabel>Newest Beatmap Date</FormLabel>
                <FormControl>
                    <TextInput pattern="\d{4}-\d{2}-\d{2}( \d{2}:\d{2}( GMT\\+\d{4})?)?" value={newestBeatmapDate} onChange={e => setNewestBeatmapDate(e.currentTarget.value)} placeholder="YYYY-MM-DD" />
                </FormControl>
                <FormLabel>Oldest Score Date</FormLabel>
                <FormControl>
                    <TextInput pattern="\d{4}-\d{2}-\d{2}( \d{2}:\d{2}( GMT\\+\d{4})?)?" value={oldestScoreDate} onChange={e => setOldestScoreDate(e.currentTarget.value)} placeholder="YYYY-MM-DD" />
                </FormControl>
                <FormLabel>Newest Score Date</FormLabel>
                <FormControl>
                    <TextInput pattern="\d{4}-\d{2}-\d{2}( \d{2}:\d{2}( GMT\\+\d{4})?)?" value={newestScoreDate} onChange={e => setNewestScoreDate(e.currentTarget.value)} placeholder="YYYY-MM-DD" />
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
                {[Gamemode.Standard, Gamemode.Catch, Gamemode.Mania].includes(gamemode) && (
                    <>
                        <FormLabel>Min {gamemode === Gamemode.Mania ? "Keys" : "CS"}</FormLabel>
                        <FormControl>
                            <TextInput value={lowestCs} onChange={e => setLowestCs(e.currentTarget.value)} />
                        </FormControl>
                        <FormLabel>Max {gamemode === Gamemode.Mania ? "Keys" : "CS"}</FormLabel>
                        <FormControl>
                            <TextInput value={highestCs} onChange={e => setHighestCs(e.currentTarget.value)} />
                        </FormControl>
                    </>
                )}
                {[Gamemode.Standard, Gamemode.Catch].includes(gamemode) && (
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
                <FormLabel>Min Accuracy (%)</FormLabel>
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
