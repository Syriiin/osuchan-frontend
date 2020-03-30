import React, { useState, useEffect } from "react";
import { AllowedBeatmapStatus } from "../../store/models/profiles/enums";
import { Gamemode } from "../../store/models/common/enums";
import { FormLabel } from "./FormLabel";
import { FormControl } from "./FormControl";
import { TextInput } from "./TextInput";
import { ModsSelect } from "./ModsSelect";
import { ScoreFilter } from "../../store/models/profiles/types";

export function ScoreFilterForm(props: ScoreFilterFormProps) {
    const gamemode = props.gamemode;
    const onChange = props.onChange;

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
    const [requiredMods, setRequiredMods] = useState(0);
    const [disqualifiedMods, setDisqualifiedMods] = useState(0);
    const [lowestAccuracy, setLowestAccuracy] = useState("");
    const [highestAccuracy, setHighestAccuracy] = useState("");

    useEffect(() => onChange({
        allowedBeatmapStatus,
        oldestBeatmapDate: new Date(oldestBeatmapDate),
        newestBeatmapDate: new Date(newestBeatmapDate),
        oldestScoreDate: new Date(oldestScoreDate),
        newestScoreDate: new Date(newestScoreDate),
        lowestAr: parseFloat(lowestAr),
        highestAr: parseFloat(highestAr),
        lowestOd: parseFloat(lowestOd),
        highestOd: parseFloat(highestOd),
        lowestCs: parseFloat(lowestCs),
        highestCs: parseFloat(highestCs),
        requiredMods,
        disqualifiedMods,
        lowestAccuracy: parseFloat(lowestAccuracy),
        highestAccuracy: parseFloat(highestAccuracy)
    }), [
        onChange,
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

    return (
        <>
            {/* Score filters */}
            <h3>Score filters</h3>
            
            {/* Beatmap status */}
            <FormLabel>Allowed Beatmap Status</FormLabel>
            <FormControl>
                <select value={allowedBeatmapStatus} onChange={e => setAllowedBeatmapStatus(parseInt(e.target.value))}>
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
        </>
    );
}

interface ScoreFilterFormProps {
    gamemode: Gamemode;
    value: ScoreFilter | null;
    onChange: (scoreFilter: ScoreFilter | null) => void;
}
