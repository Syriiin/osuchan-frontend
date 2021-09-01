import React, { useState } from "react";

import { Score } from "../../../store/models/profiles/types";
import {
    SimpleModal,
    SimpleModalTitle,
    FormLabel,
    TextInput,
    FormControl,
    Button,
    ModsSelect,
} from "../../../components";
import { Gamemode } from "../../../store/models/common/enums";
import { observer } from "mobx-react-lite";
import { useAutorun, useStore } from "../../../utils/hooks";

const ScoreEditModal = observer((props: ScoreEditModalProps) => {
    const store = useStore();
    const usersStore = store.usersStore;

    const score = props.score;
    const beatmap = score.beatmap!;

    const [mods, setMods] = useState(score.mods);
    const [combo, setCombo] = useState(score.bestCombo.toString());
    const [count100, setCount100] = useState(score.count100.toString());
    const [count50, setCount50] = useState(score.count50.toString());
    const [countMiss, setCountMiss] = useState(score.countMiss.toString());

    // use effect to initialise default state values
    useAutorun(() => {
        setMods(score.mods);
        setCombo(score.bestCombo.toString());
        setCount100(score.count100.toString());
        setCount50(score.count50.toString());
        setCountMiss(score.countMiss.toString());
    });

    const handleApply = (e: React.FormEvent) => {
        e.preventDefault();

        usersStore.updateSandboxScore(
            score,
            mods,
            parseInt(combo),
            parseInt(count100),
            parseInt(count50),
            parseInt(countMiss)
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
                        onChange={(e) => setCombo(e.currentTarget.value)}
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
                        placeholder={score.count100.toString()}
                        value={count100}
                        onChange={(e) => setCount100(e.currentTarget.value)}
                        min={0}
                    />
                </FormControl>
                <FormLabel>50s</FormLabel>
                <FormControl>
                    <TextInput
                        fullWidth
                        type="number"
                        required
                        placeholder={score.count50.toString()}
                        value={count50}
                        onChange={(e) => setCount50(e.currentTarget.value)}
                        min={0}
                    />
                </FormControl>
                <FormLabel>Misses</FormLabel>
                <FormControl>
                    <TextInput
                        fullWidth
                        type="number"
                        required
                        placeholder={score.countMiss.toString()}
                        value={countMiss}
                        onChange={(e) => setCountMiss(e.currentTarget.value)}
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
