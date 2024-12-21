import React, { useState } from "react";

import { observer } from "mobx-react-lite";
import {
    Button,
    FormControl,
    FormLabel,
    ModsSelect,
    SimpleModal,
    SimpleModalTitle,
    TextInput,
} from "../../../components";
import { Gamemode } from "../../../store/models/common/enums";
import { Score } from "../../../store/models/profiles/types";
import { useAutorun, useStore } from "../../../utils/hooks";

const ScoreEditModal = observer((props: ScoreEditModalProps) => {
    const store = useStore();
    const usersStore = store.usersStore;

    const score = props.score;
    const beatmap = score.beatmap!;

    const [mods, setMods] = useState(score.modsJson);
    const [combo, setCombo] = useState(score.bestCombo);
    const [countOk, setCountOk] = useState(score.statistics["ok"] ?? 0);
    const [countMeh, setCountMeh] = useState(score.statistics["meh"] ?? 0);
    const [countMiss, setCountMiss] = useState(score.statistics["miss"] ?? 0);

    // use effect to initialise default state values
    useAutorun(() => {
        setMods(score.modsJson);
        setCombo(score.bestCombo);
        setCountOk(score.statistics["ok"] ?? 0);
        setCountMeh(score.statistics["meh"] ?? 0);
        setCountMiss(score.statistics["miss"] ?? 0);
    });

    const handleApply = (e: React.FormEvent) => {
        e.preventDefault();

        usersStore.updateSandboxScore(
            score,
            mods,
            combo,
            countOk,
            countMeh,
            countMiss
        );

        props.onClose();
    };

    return (
        <SimpleModal open={props.open} onClose={props.onClose}>
            <SimpleModalTitle>Edit Score</SimpleModalTitle>
            <p>
                Edit you score to see how your profile stats would look if you
                played differently!
            </p>
            <form onSubmit={handleApply}>
                <FormLabel>Mods</FormLabel>
                <FormControl>
                    <ModsSelect
                        gamemode={props.gamemode}
                        value={mods}
                        onChange={(enabledMods) => setMods(enabledMods)}
                    />
                </FormControl>
                <FormLabel>
                    Best Combo <small>(max {beatmap.maxCombo}x)</small>
                </FormLabel>
                <FormControl>
                    <TextInput
                        fullWidth
                        type="number"
                        required
                        placeholder={score.bestCombo.toString()}
                        value={combo}
                        onChange={(e) => setCombo(parseInt(e.currentTarget.value))}
                        min={0}
                        max={beatmap.maxCombo}
                    />
                </FormControl>
                <FormLabel>100s</FormLabel>
                <FormControl>
                    <TextInput
                        fullWidth
                        type="number"
                        required
                        placeholder={(score.statistics["ok"] ?? 0).toString()}
                        value={countOk}
                        onChange={(e) => setCountOk(parseInt(e.currentTarget.value))}
                        min={0}
                    />
                </FormControl>
                <FormLabel>50s</FormLabel>
                <FormControl>
                    <TextInput
                        fullWidth
                        type="number"
                        required
                        placeholder={(score.statistics["meh"] ?? 0).toString()}
                        value={countMeh}
                        onChange={(e) => setCountMeh(parseInt(e.currentTarget.value))}
                        min={0}
                    />
                </FormControl>
                <FormLabel>Misses</FormLabel>
                <FormControl>
                    <TextInput
                        fullWidth
                        type="number"
                        required
                        placeholder={(score.statistics["miss"] ?? 0).toString()}
                        value={countMiss}
                        onChange={(e) => setCountMiss(parseInt(e.currentTarget.value))}
                        min={0}
                    />
                </FormControl>
                <Button positive type="submit">
                    Apply
                </Button>
            </form>
        </SimpleModal>
    );
});

interface ScoreEditModalProps {
    score: Score;
    gamemode: Gamemode;
    open: boolean;
    onClose: () => void;
}

export default ScoreEditModal;
