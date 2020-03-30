import React, { useContext, useState, useCallback } from "react";
import { ThemeProps, DefaultTheme, withTheme } from "styled-components";

import { SimpleModal, SimpleModalTitle, TextInput, TextField, FormLabel, FormControl, Button, Switch, ScoreFilterForm } from "../../components";
import { StoreContext } from "../../store";
import { LeaderboardAccessType } from "../../store/models/leaderboards/enums";
import { Gamemode } from "../../store/models/common/enums";
import { ScoreFilter } from "../../store/models/profiles/types";

function CreateLeaderboardModal(props: CreateLeaderboardModalProps) {
    const store = useContext(StoreContext);
    const listStore = store.leaderboardsStore.listStore;

    const [gamemode, setGamemode] = useState(Gamemode.Standard);
    const [accessType, setAccessType] = useState(LeaderboardAccessType.Public);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [allowPastScores, setAllowPastScores] = useState(true);
    const [scoreFilter, setScoreFilter] = useState<ScoreFilter | null>(null);

    const handleCreateLeaderboardSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        listStore.createLeaderboard(gamemode, accessType, name, description, allowPastScores, scoreFilter);

        props.onClose();
        clearInputs();
    }
    
    const clearInputs = () => {
        setGamemode(Gamemode.Standard);
        setAccessType(LeaderboardAccessType.Public);
        setName("");
        setDescription("");
        setAllowPastScores(true);
        setScoreFilter(null);

        props.onClose();
    }

    // annoyingly need the useCallback hook here so that we can use the onChange callback as a dependency of useEffect inside ScoreFilterForm without causing an infinite render loop
    const handleScoreFilterChange = useCallback((scoreFilter: ScoreFilter | null) => setScoreFilter(scoreFilter), []);

    return (
        <SimpleModal open={props.open} onClose={() => props.onClose()}>
            <SimpleModalTitle>Create Leaderboard</SimpleModalTitle>
            <form onSubmit={handleCreateLeaderboardSubmit}>
                {/* Basic details */}
                <FormLabel>Name</FormLabel>
                <TextInput fullWidth required value={name} onChange={e => setName(e.currentTarget.value)} />
                <FormLabel>Gamemode</FormLabel>
                <FormControl>
                    <select value={gamemode} onChange={e => setGamemode(parseInt(e.target.value))}>
                        <option value={Gamemode.Standard}>osu!</option>
                        <option value={Gamemode.Taiko}>osu!taiko</option>
                        <option value={Gamemode.Catch}>osu!catch</option>
                        <option value={Gamemode.Mania}>osu!mania</option>
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
