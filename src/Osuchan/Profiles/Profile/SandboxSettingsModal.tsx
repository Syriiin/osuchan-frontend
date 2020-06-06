import React, { useContext, useState, useCallback } from "react";
import { ThemeProps, DefaultTheme, withTheme } from "styled-components";

import { ScoreSet } from "../../../store/models/profiles/enums";
import { StoreContext } from "../../../store";
import { SimpleModal, SimpleModalTitle, FormLabel, FormControl, Button, ScoreFilterForm } from "../../../components";
import { Gamemode } from "../../../store/models/common/enums";
import { ScoreFilter } from "../../../store/models/profiles/types";

function SandboxSettingsModal(props: SandboxSettingsModalProps) {
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
                    <select value={scoreSet} onChange={e => setScoreSet(parseInt(e.target.value))} disabled={props.gamemode !== Gamemode.Standard}>
                        <option value={ScoreSet.Normal}>Normal</option>
                        <option value={ScoreSet.NeverChoke}>Never Choke</option>
                        {/* <option value={ScoreSet.AlwaysFullCombo}>Always FC</option> */}
                    </select>
                </FormControl>
                <ScoreFilterForm gamemode={props.gamemode} value={scoreFilter} onChange={handleScoreFilterChange} />
                <Button type="submit">Load scores</Button>
            </form>
        </SimpleModal>
    );
}

interface SandboxSettingsModalProps extends ThemeProps<DefaultTheme> {
    gamemode: Gamemode;
    open: boolean;
    onClose: () => void;
}

export default withTheme(SandboxSettingsModal);
