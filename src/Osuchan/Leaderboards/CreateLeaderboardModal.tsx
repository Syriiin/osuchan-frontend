import React, { useContext, useState, useCallback, useEffect } from "react";
import { observer } from "mobx-react-lite";
import styled from "styled-components";

import { SimpleModal, SimpleModalTitle, TextInput, TextField, FormLabel, FormControl, Button, Switch, ScoreFilterForm, Select } from "../../components";
import { StoreContext } from "../../store";
import { LeaderboardAccessType } from "../../store/models/leaderboards/enums";
import { Gamemode } from "../../store/models/common/enums";
import { ScoreFilter } from "../../store/models/profiles/types";
import { ScoreSet } from "../../store/models/profiles/enums";

const LeaderboardIcon = styled.img`
    max-width: 128px;
    max-height: 128px;
    border-radius: 5px;
`;

const CreateLeaderboardModal = observer((props: CreateLeaderboardModalProps) => {
    const store = useContext(StoreContext);
    const listStore = store.leaderboardsStore.listStore;
    const meStore = store.meStore;

    const { user } = meStore;

    const [gamemode, setGamemode] = useState(Gamemode.Standard);
    const [scoreSet, setScoreSet] = useState(ScoreSet.Normal);
    const [accessType, setAccessType] = useState(LeaderboardAccessType.Public);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [iconUrl, setIconUrl] = useState("");
    const [allowPastScores, setAllowPastScores] = useState(true);
    const [scoreFilter, setScoreFilter] = useState<Partial<ScoreFilter>>({});

    // Interval updated icon url so we don't spam preview image requests on every character change
    const [delayedIconUrl, setDelayedIconUrl] = useState(iconUrl);
    useEffect(() => {
        const timeout = setTimeout(() => {
            setDelayedIconUrl(iconUrl);
        }, 1000);

        return () => clearTimeout(timeout);
    }, [setDelayedIconUrl, iconUrl]);

    useEffect(() => {
        setIconUrl(`https://a.ppy.sh/${user?.osuUserId}` || "");
    }, [user])

    const handleCreateLeaderboardSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        listStore.createLeaderboard(gamemode, scoreSet, accessType, name, description, iconUrl, allowPastScores, scoreFilter as ScoreFilter);
    }

    // annoyingly need the useCallback hook here so that we can use the onChange callback as a dependency of useEffect inside ScoreFilterForm without causing an infinite render loop
    const handleScoreFilterChange = useCallback((scoreFilter: ScoreFilter) => setScoreFilter(scoreFilter), []);

    const handleGamemodeChange = (mode: Gamemode) => {
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
                    <Select value={gamemode} onChange={handleGamemodeChange} options={[
                        { value: Gamemode.Standard, label: "osu!" },
                        { value: Gamemode.Taiko, label: "osu!taiko" },
                        { value: Gamemode.Catch, label: "osu!catch" },
                        { value: Gamemode.Mania, label: "osu!mania" },
                    ]} />
                </FormControl>
                <FormLabel>Score Set</FormLabel>
                <FormControl>
                    <Select value={scoreSet} onChange={value => setScoreSet(value)} disabled={gamemode !== Gamemode.Standard} options={[
                        { value: ScoreSet.Normal, label: "Normal" },
                        { value: ScoreSet.NeverChoke, label: "Never Choke" },
                        // { value: ScoreSet.AlwaysFullCombo, label: "Always FC" }
                    ]} />
                </FormControl>
                <FormLabel>Type</FormLabel>
                <FormControl>
                    <Select value={accessType} onChange={value => setAccessType(value)} options={[
                        { value: LeaderboardAccessType.Public, label: "Public" },
                        { value: LeaderboardAccessType.PublicInviteOnly, label: "Public (Invite-only)" },
                        { value: LeaderboardAccessType.Private, label: "Private" }
                    ]} />
                </FormControl>
                <FormLabel>Description</FormLabel>
                <TextField fullWidth value={description} onChange={e => setDescription(e.currentTarget.value)} />
                <FormLabel>Icon URL</FormLabel>
                <TextInput fullWidth placeholder={`https://a.ppy.sh/${user?.osuUserId}`} value={iconUrl} onChange={e => setIconUrl(e.currentTarget.value)} />
                <LeaderboardIcon src={delayedIconUrl} />
                <FormLabel>Allow scores set prior to member joining</FormLabel>
                <FormControl>
                    <Switch
                        mini
                        checked={allowPastScores}
                        onChange={(checked, event, id) => setAllowPastScores(checked)}
                    />
                </FormControl>

                {/* Score filters */}
                <ScoreFilterForm gamemode={gamemode} value={scoreFilter} onChange={handleScoreFilterChange} />

                <Button isLoading={listStore.isCreatingLeaderboard} positive type="submit">Create</Button>
            </form>
        </SimpleModal>
    );
});

interface CreateLeaderboardModalProps {
    open: boolean;
    onClose: () => void;
}

export default CreateLeaderboardModal;
