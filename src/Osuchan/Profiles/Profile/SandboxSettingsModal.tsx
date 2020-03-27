import React, { useContext, useState } from "react";
import { ThemeProps, DefaultTheme, withTheme } from "styled-components";

import { ScoreSet } from "../../../store/models/profiles/enums";
import { StoreContext } from "../../../store";
import { SimpleModal, SimpleModalTitle, FormLabel, FormControl, Switch, Button } from "../../../components";

function SandboxSettingsModal(props: SandboxSettingsModalProps) {
    const store = useContext(StoreContext);
    const usersStore = store.usersStore;

    const [scoreSet, setScoreSet] = useState(ScoreSet.Normal);
    const [allowLoved, setAllowLoved] = useState(false);

    const handleSandboxSettingsSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        usersStore.loadSandboxScores(scoreSet, allowLoved);

        props.onClose();
    }

    return (
        <SimpleModal open={props.open} onClose={() => props.onClose()}>
            <SimpleModalTitle>Sandbox Settings</SimpleModalTitle>
            <form onSubmit={handleSandboxSettingsSubmit}>
                <FormLabel>Score Set</FormLabel>
                <FormControl>
                    <select value={scoreSet} onChange={e => setScoreSet(parseInt(e.target.value))}>
                        <option value={ScoreSet.Normal}>Normal</option>
                        <option value={ScoreSet.NeverChoke}>Never Choke</option>
                        {/* <option value={ScoreSet.AlwaysFullCombo}>Always FC</option> */}
                    </select>
                </FormControl>
                <FormLabel>Allow loved scores</FormLabel>
                <FormControl>
                    <Switch
                        mini
                        checked={allowLoved}
                        onChange={checked => setAllowLoved(checked)}
                        offColor={props.theme.colours.currant}
                        onColor={props.theme.colours.mystic}
                    />
                </FormControl>
                <Button type="submit">Load scores</Button>
            </form>
        </SimpleModal>
    );
}

interface SandboxSettingsModalProps extends ThemeProps<DefaultTheme> {
    open: boolean;
    onClose: () => void;
}

export default withTheme(SandboxSettingsModal);
