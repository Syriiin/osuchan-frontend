import React, { useState, useEffect, useContext, useCallback } from "react";
import styled from "styled-components";
import { observer } from "mobx-react-lite";
import { AllowedBeatmapStatus } from "../../store/models/profiles/enums";
import { Gamemode, Mods } from "../../store/models/common/enums";
import { FormLabel } from "./FormLabel";
import { FormControl } from "./FormControl";
import { TextInput } from "./TextInput";
import { ModsSelect } from "./ModsSelect";
import { ScoreFilter } from "../../store/models/profiles/types";
import { StoreContext } from "../../store";
import { ScoreFilterPreset } from "../../store/models/users/types";
import { Button } from "./Button";
import { LoadingSpinner } from "../layout/Loading";

function formatDate(date: Date) {
    return date.toISOString().split("T")[0];
}

const SaveNewButton = styled(Button)`

`;

const SaveButton = styled(Button)`
    margin-left: 5px;
`;

const DeleteButton = styled(Button)`
    margin-left: 5px;
`;

export const ScoreFilterForm = observer((props: ScoreFilterFormProps) => {
    const store = useContext(StoreContext);
    const meStore = store.meStore;

    const presets = meStore.scoreFilterPresets;
    const gamemode = props.gamemode;
    const onChange = props.onChange;
    const value = props.value;

    const [preset, setPreset] = useState<ScoreFilterPreset | null>(null);
    const [presetName, setPresetName] = useState("");

    const [allowedBeatmapStatus, setAllowedBeatmapStatus] = useState(AllowedBeatmapStatus.RankedOnly);
    const [oldestBeatmapDate, setOldestBeatmapDate] = useState("");
    const [newestBeatmapDate, setNewestBeatmapDate] = useState("");
    const [oldestScoreDate, setOldestScoreDate] = useState("");
    const [newestScoreDate, setNewestScoreDate] = useState("");
    const [lowestAr, setLowestAr] = useState("");
    const [highestAr, setHighestAr] = useState("");
    const [lowestOd, setLowestOd] = useState("");
    const [highestOd, setHighestOd] = useState("");
    const [lowestCs, setLowestCs] = useState("");
    const [highestCs, setHighestCs] = useState("");
    const [requiredMods, setRequiredMods] = useState(Mods.None);
    const [disqualifiedMods, setDisqualifiedMods] = useState(Mods.None);
    const [lowestAccuracy, setLowestAccuracy] = useState("");
    const [highestAccuracy, setHighestAccuracy] = useState("");

    const getScoreFilter = useCallback(() => ({
        allowedBeatmapStatus,
        oldestBeatmapDate: oldestBeatmapDate !== "" ? new Date(oldestBeatmapDate) : null,
        newestBeatmapDate: newestBeatmapDate !== "" ? new Date(newestBeatmapDate) : null,
        oldestScoreDate: oldestScoreDate !== "" ? new Date(oldestScoreDate) : null,
        newestScoreDate: newestScoreDate !== "" ? new Date(newestScoreDate) : null,
        lowestAr: parseFloat(lowestAr) || null,
        highestAr: parseFloat(highestAr) || null,
        lowestOd: parseFloat(lowestOd) || null,
        highestOd: parseFloat(highestOd) || null,
        lowestCs: parseFloat(lowestCs) || null,
        highestCs: parseFloat(highestCs) || null,
        requiredMods,
        disqualifiedMods,
        lowestAccuracy: parseFloat(lowestAccuracy) || null,
        highestAccuracy: parseFloat(highestAccuracy) || null
    }), [
        allowedBeatmapStatus,
        oldestBeatmapDate,
        newestBeatmapDate,
        oldestScoreDate,
        newestScoreDate,
        lowestAr,
        highestAr,
        lowestOd,
        highestOd,
        lowestCs,
        highestCs,
        requiredMods,
        disqualifiedMods,
        lowestAccuracy,
        highestAccuracy
    ]);

    // Call onChange if the score filters update
    useEffect(() => onChange(getScoreFilter()), [onChange, getScoreFilter]);

    // Set preset to latest in preset list if preset creation flag changes, or none if no presets exist
    useEffect(() => {
        if (!meStore.isCreatingScoreFilterPreset) {
            loadPreset(presets[presets.length - 1] ?? null);
        }
    }, [presets, meStore.isCreatingScoreFilterPreset]);

    // Set preset to none if preset deletion flag changes
    useEffect(() => {
        if (!meStore.isDeletingScoreFilterPreset) {
            loadPreset(null);
        }
    }, [presets, meStore.isDeletingScoreFilterPreset]);

    const loadPreset = (preset: ScoreFilterPreset | null) => {
        setPreset(preset);
        setPresetName(preset?.name ?? "");

        setAllowedBeatmapStatus(preset?.scoreFilter?.allowedBeatmapStatus ?? AllowedBeatmapStatus.RankedOnly);
        setOldestBeatmapDate(preset?.scoreFilter?.oldestBeatmapDate?.toString() ?? "");
        setNewestBeatmapDate(preset?.scoreFilter?.newestBeatmapDate?.toString() ?? "");
        setOldestScoreDate(preset?.scoreFilter?.oldestScoreDate?.toString() ?? "");
        setNewestScoreDate(preset?.scoreFilter?.newestScoreDate?.toString() ?? "");
        setLowestAr(preset?.scoreFilter?.lowestAr?.toString() ?? "");
        setHighestAr(preset?.scoreFilter?.highestAr?.toString() ?? "");
        setLowestOd(preset?.scoreFilter?.lowestOd?.toString() ?? "");
        setHighestOd(preset?.scoreFilter?.highestOd?.toString() ?? "");
        setLowestCs(preset?.scoreFilter?.lowestCs?.toString() ?? "");
        setHighestCs(preset?.scoreFilter?.highestCs?.toString() ?? "");
        setRequiredMods(preset?.scoreFilter?.requiredMods ?? Mods.None);
        setDisqualifiedMods(preset?.scoreFilter?.disqualifiedMods ?? Mods.None);
        setLowestAccuracy(preset?.scoreFilter?.lowestAccuracy?.toString() ?? "");
        setHighestAccuracy(preset?.scoreFilter?.highestAccuracy?.toString() ?? "");
    }

    const handleSavePreset = () => meStore.createScoreFilterPreset(presetName || "New Preset", getScoreFilter());
    const handleUpdatePreset = () => meStore.updateScoreFilterPreset(preset!.id, presetName || preset!.name, getScoreFilter());
    const handleDeletePreset = () => meStore.deleteScoreFilterPreset(preset!.id);

    return (
        <>
            {/* Score filters */}
            <h3>Score filters</h3>

            {/* Presets */}
            <FormLabel>Preset</FormLabel>
            <FormControl>
                <select value={preset?.id ?? 0} onChange={e => loadPreset(presets.find(preset => preset.id === parseInt(e.target.value)) ?? null)}>
                    <option value={0}>None</option>
                    {presets.map(preset => (
                        <option value={preset.id}>{preset.name}</option>
                    ))}
                </select>
            </FormControl>

            <FormControl>
                <TextInput placeholder="Preset Name" value={presetName} onChange={e => setPresetName(e.currentTarget.value)} />
            </FormControl>
            <SaveNewButton type="button" onClick={handleSavePreset}>
                {meStore.isCreatingScoreFilterPreset ? <LoadingSpinner scale={0.15} /> : "Save New Preset"}
            </SaveNewButton>
            {preset !== null && (
                <>
                    <SaveButton type="button" onClick={handleUpdatePreset}>
                        {meStore.isUpdatingScoreFilterPreset ? <LoadingSpinner scale={0.15} /> : "Save Preset"}
                    </SaveButton>
                    <DeleteButton type="button" onClick={handleDeletePreset}>
                        {meStore.isDeletingScoreFilterPreset ? <LoadingSpinner scale={0.15} /> : "Delete Preset"}
                    </DeleteButton>
                </>
            )}

            {/* Beatmap status */}
            <FormLabel>Allowed Beatmap Status</FormLabel>
            <FormControl>
                <select value={value.allowedBeatmapStatus} onChange={e => setAllowedBeatmapStatus(parseInt(e.target.value))}>
                    <option value={AllowedBeatmapStatus.Any}>Ranked or Loved</option>
                    <option value={AllowedBeatmapStatus.RankedOnly}>Ranked only</option>
                    <option value={AllowedBeatmapStatus.LovedOnly}>Loved only</option>
                </select>
            </FormControl>
            
            {/* Dates */}
            <FormLabel>Oldest Beatmap Date</FormLabel>
            <FormControl>
                <input type="date" value={value.oldestBeatmapDate ? formatDate(value.oldestBeatmapDate) : ""} onChange={e => setOldestBeatmapDate(e.currentTarget.value)} />
            </FormControl>
            <FormLabel>Newest Beatmap Date</FormLabel>
            <FormControl>
                <input type="date" value={value.newestBeatmapDate ? formatDate(value.newestBeatmapDate) : ""} onChange={e => setNewestBeatmapDate(e.currentTarget.value)} />
            </FormControl>
            <FormLabel>Oldest Score Date</FormLabel>
            <FormControl>
                <input type="date" value={value.oldestScoreDate ? formatDate(value.oldestScoreDate) : ""} onChange={e => setOldestScoreDate(e.currentTarget.value)} />
            </FormControl>
            <FormLabel>Newest Score Date</FormLabel>
            <FormControl>
                <input type="date" value={value.newestScoreDate ? formatDate(value.newestScoreDate) : ""} onChange={e => setNewestScoreDate(e.currentTarget.value)} />
            </FormControl>
            
            {/* Mods */}
            <FormLabel>Required Mods</FormLabel>
            <FormControl>
                <ModsSelect gamemode={gamemode} value={value.requiredMods || Mods.None} onChange={mods => setRequiredMods(mods)} />
            </FormControl>
            <FormLabel>Disqualified mods</FormLabel>
            <FormControl>
                <ModsSelect gamemode={gamemode} value={value.disqualifiedMods || Mods.None} onChange={mods => setDisqualifiedMods(mods)} />
            </FormControl>
            
            {/* Ranges */}
            {[Gamemode.Standard, Gamemode.Catch, Gamemode.Mania].includes(gamemode) && (
                <>
                    <FormLabel>Min {gamemode === Gamemode.Mania ? "Keys" : "CS"}</FormLabel>
                    <FormControl>
                        <TextInput type="number" step={gamemode === Gamemode.Mania ? "1" : "0.1"} min={gamemode === Gamemode.Mania ? "1" : "0"} max={gamemode === Gamemode.Mania ? "10" : "11"} value={value.lowestCs || ""} onChange={e => setLowestCs(e.currentTarget.value)} />
                    </FormControl>
                    <FormLabel>Max {gamemode === Gamemode.Mania ? "Keys" : "CS"}</FormLabel>
                    <FormControl>
                        <TextInput type="number" step={gamemode === Gamemode.Mania ? "1" : "0.1"} min={gamemode === Gamemode.Mania ? "1" : "0"} max={gamemode === Gamemode.Mania ? "10" : "11"} value={value.highestCs || ""} onChange={e => setHighestCs(e.currentTarget.value)} />
                    </FormControl>
                </>
            )}
            {[Gamemode.Standard, Gamemode.Catch].includes(gamemode) && (
                <>
                    <FormLabel>Min AR</FormLabel>
                    <FormControl>
                        <TextInput type="number" step="0.1" min="-5" max="13" value={value.lowestAr || ""} onChange={e => setLowestAr(e.currentTarget.value)} />
                    </FormControl>
                    <FormLabel>Max AR</FormLabel>
                    <FormControl>
                        <TextInput type="number" step="0.1" min="-5" max="13" value={value.highestAr || ""} onChange={e => setHighestAr(e.currentTarget.value)} />
                    </FormControl>
                </>
            )}
            <FormLabel>Min OD</FormLabel>
            <FormControl>
                <TextInput type="number" step="0.1" min="-4.5" max="13.5" value={value.lowestOd || ""} onChange={e => setLowestOd(e.currentTarget.value)} />
            </FormControl>
            <FormLabel>Max OD</FormLabel>
            <FormControl>
                <TextInput type="number" step="0.1" min="-4.5" max="13.5" value={value.highestOd || ""} onChange={e => setHighestOd(e.currentTarget.value)} />
            </FormControl>
            <FormLabel>Min Accuracy (%)</FormLabel>
            <FormControl>
                <TextInput type="number" step="0.1" min="0" max="100" value={value.lowestAccuracy || ""} onChange={e => setLowestAccuracy(e.currentTarget.value)} />
            </FormControl>
            <FormLabel>Max Accuracy (%)</FormLabel>
            <FormControl>
                <TextInput type="number" step="0.1" min="0" max="100" value={value.highestAccuracy || ""} onChange={e => setHighestAccuracy(e.currentTarget.value)} />
            </FormControl>
        </>
    );
});

interface ScoreFilterFormProps {
    gamemode: Gamemode;
    value: Partial<ScoreFilter>;
    onChange: (scoreFilter: ScoreFilter) => void;
}