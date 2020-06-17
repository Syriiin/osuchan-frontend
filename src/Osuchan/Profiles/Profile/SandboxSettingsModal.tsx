import React, { useContext, useState, useCallback } from "react";

import { ScoreSet } from "../../../store/models/profiles/enums";
import { StoreContext } from "../../../store";
import { SimpleModal, SimpleModalTitle, FormLabel, FormControl, Button, ScoreFilterForm, Select } from "../../../components";
import { Gamemode } from "../../../store/models/common/enums";
import { ScoreFilter } from "../../../store/models/profiles/types";

const SandboxSettingsModal = (props: SandboxSettingsModalProps) => {
    const store = useContext(StoreContext);
    const usersStore = store.usersStore;

    const [scoreSet, setScoreSet] = useState(ScoreSet.Normal);
    const [scoreFilter, setScoreFilter] = useState<Partial<ScoreFilter>>({});

    const handleSandboxSettingsSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        usersStore.loadSandboxScores(scoreSet, scoreFilter as ScoreFilter);

        props.onClose();
    }

    const handleScoreFilterChange = useCallback((scoreFilter: ScoreFilter) => setScoreFilter(scoreFilter), []);

    return (
        <SimpleModal open={props.open} onClose={() => props.onClose()}>
            <SimpleModalTitle>Sandbox Settings</SimpleModalTitle>
            <form onSubmit={handleSandboxSettingsSubmit}>
                <FormLabel>Score Set</FormLabel>
                <FormControl>
                    <Select value={scoreSet} onChange={value => setScoreSet(value)} disabled={props.gamemode !== Gamemode.Standard} options={[
                        { value: ScoreSet.Normal, label: "Normal" },
                        { value: ScoreSet.NeverChoke, label: "Never Choke" },
                        // { value: ScoreSet.AlwaysFullCombo, label: "Always FC" }
                    ]} />
                </FormControl>
                <ScoreFilterForm gamemode={props.gamemode} value={scoreFilter} onChange={handleScoreFilterChange} />
                <Button positive type="submit">Load scores</Button>
            </form>
        </SimpleModal>
    );
}

interface SandboxSettingsModalProps {
    gamemode: Gamemode;
    open: boolean;
    onClose: () => void;
}

export default SandboxSettingsModal;
