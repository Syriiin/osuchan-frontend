import React, { useContext, useState, useCallback } from "react";
import { ThemeProps, DefaultTheme, withTheme } from "styled-components";

import { SimpleModal, SimpleModalTitle, TextInput, TextField, FormLabel, FormControl, Button, Switch, ScoreFilterForm } from "../../components";
import { StoreContext } from "../../store";
import { LeaderboardAccessType } from "../../store/models/leaderboards/enums";
import { Gamemode } from "../../store/models/common/enums";
import { ScoreFilter } from "../../store/models/profiles/types";
import { ScoreSet } from "../../store/models/profiles/enums";

const CreateLeaderboardModal = (props: CreateLeaderboardModalProps) => {
    const store = useContext(StoreContext);
    const listStore = store.leaderboardsStore.listStore;

    const [gamemode, setGamemode] = useState(Gamemode.Standard);
    const [scoreSet, setScoreSet] = useState(ScoreSet.Normal);
    const [accessType, setAccessType] = useState(LeaderboardAccessType.Public);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [allowPastScores, setAllowPastScores] = useState(true);
    const [scoreFilter, setScoreFilter] = useState<Partial<ScoreFilter>>({});

    const handleCreateLeaderboardSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        listStore.createLeaderboard(gamemode, scoreSet, accessType, name, description, allowPastScores, scoreFilter as ScoreFilter);

        props.onClose();
        clearInputs();
    }
    
    const clearInputs = () => {
        setGamemode(Gamemode.Standard);
        setAccessType(LeaderboardAccessType.Public);
        setName("");
        setDescription("");
        setAllowPastScores(true);
        setScoreFilter({});

        props.onClose();
    }

    // annoyingly need the useCallback hook here so that we can use the onChange callback as a dependency of useEffect inside ScoreFilterForm without causing an infinite render loop
    const handleScoreFilterChange = useCallback((scoreFilter: ScoreFilter) => setScoreFilter(scoreFilter), []);

    const handleGamemodeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const mode = parseInt(e.target.value)
        setGamemode(mode);
        if (mode !== Gamemode.Standard) {
            // Only normal score set is supported for non-standard gamemodes since other depend on choke support
            setScoreSet(ScoreSet.Normal);
        }
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
                    <select value={gamemode} onChange={handleGamemodeChange}>
                        <option value={Gamemode.Standard}>osu!</option>
                        <option value={Gamemode.Taiko}>osu!taiko</option>
                        <option value={Gamemode.Catch}>osu!catch</option>
                        <option value={Gamemode.Mania}>osu!mania</option>
                    </select>
                </FormControl>
                <FormLabel>Score Set</FormLabel>
                <FormControl>
                    <select value={scoreSet} onChange={e => setScoreSet(parseInt(e.target.value))} disabled={gamemode !== Gamemode.Standard}>
                        <option value={ScoreSet.Normal}>Normal</option>
                        <option value={ScoreSet.NeverChoke}>Never Choke</option>
                        {/* <option value={ScoreSet.AlwaysFullCombo}>Always FC</option> */}
                    </select>
                </FormControl>
                <FormLabel>Type</FormLabel>
                <FormControl>
                    <select value={accessType} onChange={e => setAccessType(parseInt(e.target.value))}>
                        <option value={LeaderboardAccessType.Public}>Public</option>
                        <option value={LeaderboardAccessType.PublicInviteOnly}>Public (Invite-only)</option>
                        <option value={LeaderboardAccessType.Private}>Private</option>
                    </select>
                </FormControl>
                <FormLabel>Description</FormLabel>
                <TextField fullWidth value={description} onChange={e => setDescription(e.currentTarget.value)} />
                <FormLabel>Allow scores set prior to member joining</FormLabel>
                <FormControl>
                    <Switch
                        mini
                        checked={allowPastScores}
                        onChange={(checked, event, id) => setAllowPastScores(checked)}
                        offColor={props.theme.colours.currant}
                        onColor={props.theme.colours.mystic}
                    />
                </FormControl>

                {/* Score filters */}
                <ScoreFilterForm gamemode={gamemode} value={scoreFilter} onChange={handleScoreFilterChange} />

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
