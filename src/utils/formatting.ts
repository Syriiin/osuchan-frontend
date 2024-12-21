import { Gamemode, ModAcronym, Mods } from "../store/models/common/enums";
import { ScoreResult } from "../store/models/profiles/enums";
import { modsAsArray } from "./osu";

export function formatTime(seconds: number) {
    // convert seconds to MM:SS format
    seconds = Math.round(seconds);
    const minutesString = String(Math.floor(seconds / 60));
    const secondsString = String(seconds % 60);
    return `${minutesString}:${("00" + secondsString).substring(
        secondsString.length
    )}`;
}

export function formatMods(bitwiseMods: Mods) {
    // convert bitwise mods to mod string (eg. 72 -> "HD, DT")
    const mods = modsAsArray(bitwiseMods).map((mod) => formatModNameShort(mod));

    return mods.length > 0 ? mods.join(", ") : "";
}

export function formatModName(modAcronym: string) {
    switch (modAcronym) {
        case ModAcronym.NoFail:
            return "No Fail";
        case ModAcronym.Easy:
            return "Easy";
        case ModAcronym.TouchDevice:
            return "Touch Device";
        case ModAcronym.Hidden:
            return "Hidden";
        case ModAcronym.HardRock:
            return "Hard Rock";
        case ModAcronym.SuddenDeath:
            return "Sudden Death";
        case ModAcronym.DoubleTime:
            return "Double Time";
        case ModAcronym.Relax:
            return "Relax";
        case ModAcronym.HalfTime:
            return "Half Time";
        case ModAcronym.Nightcore:
            return "Nightcore";
        case ModAcronym.Flashlight:
            return "Flashlight";
        case ModAcronym.Auto:
            return "Auto";
        case ModAcronym.SpunOut:
            return "Spun Out";
        case ModAcronym.Autopilot:
            return "Autopilot";
        case ModAcronym.Perfect:
            return "Perfect";
        case ModAcronym.Key4:
            return "4 Key";
        case ModAcronym.Key5:
            return "5 Key";
        case ModAcronym.Key6:
            return "6 Key";
        case ModAcronym.Key7:
            return "7 Key";
        case ModAcronym.Key8:
            return "8 Key";
        case ModAcronym.FadeIn:
            return "Fade In";
        case ModAcronym.Random:
            return "Random";
        case ModAcronym.Cinema:
            return "Cinema";
        case ModAcronym.TargetPractice:
            return "Target Practice";
        case ModAcronym.Key9:
            return "9 Key";
        case ModAcronym.KeyCoop:
            return "Coop Key";
        case ModAcronym.Key1:
            return "1 Key";
        case ModAcronym.Key2:
            return "2 Key";
        case ModAcronym.Key3:
            return "3 Key";
        case ModAcronym.ScoreV2:
            return "Score V2";
        case ModAcronym.Mirror:
            return "Mirror";
        case ModAcronym.Classic:
            return "Classic";
    }
}

export function formatModNameShort(bitwiseMods: Mods) {
    switch (bitwiseMods) {
        case Mods.None:
            return "NONE";
        case Mods.NoFail:
            return "NF";
        case Mods.Easy:
            return "EZ";
        case Mods.TouchDevice:
            return "TD";
        case Mods.Hidden:
            return "HD";
        case Mods.HardRock:
            return "HR";
        case Mods.SuddenDeath:
            return "SD";
        case Mods.DoubleTime:
            return "DT";
        case Mods.Relax:
            return "RX";
        case Mods.HalfTime:
            return "HT";
        case Mods.Nightcore:
            return "NC";
        case Mods.Flashlight:
            return "FL";
        case Mods.Auto:
            return "AUTO";
        case Mods.SpunOut:
            return "SO";
        case Mods.Autopilot:
            return "AP";
        case Mods.Perfect:
            return "PF";
        case Mods.Key4:
            return "4K";
        case Mods.Key5:
            return "5K";
        case Mods.Key6:
            return "6K";
        case Mods.Key7:
            return "7K";
        case Mods.Key8:
            return "8K";
        case Mods.FadeIn:
            return "FI";
        case Mods.Random:
            return "RN";
        case Mods.Cinema:
            return "CN";
        case Mods.TargetPractice:
            return "TP";
        case Mods.Key9:
            return "9K";
        case Mods.KeyCoop:
            return "COOP";
        case Mods.Key1:
            return "1K";
        case Mods.Key2:
            return "2K";
        case Mods.Key3:
            return "3K";
        case Mods.ScoreV2:
            return "V2";
        case Mods.Mirror:
            return "MI";
    }
}

export function formatScoreResult(result: ScoreResult) {
    // convert score result id to string representation
    switch (result) {
        case ScoreResult.Perfect:
        case ScoreResult.NoBreak:
            return "Full Combo";
        case ScoreResult.SliderBreak:
        case ScoreResult.OneMiss:
        case ScoreResult.EndChoke:
            return "Choke";
        case ScoreResult.Clear:
            return "Clear";
    }
}

export function formatGamemodeName(gamemodeId: Gamemode) {
    switch (gamemodeId) {
        case Gamemode.Standard:
            return "osu!";
        case Gamemode.Taiko:
            return "osu!taiko";
        case Gamemode.Catch:
            return "osu!catch";
        case Gamemode.Mania:
            return "osu!mania";
        default:
            return "Unknown";
    }
}

export function formatGamemodeNameShort(gamemodeId: Gamemode) {
    switch (gamemodeId) {
        case Gamemode.Standard:
            return "osu";
        case Gamemode.Taiko:
            return "taiko";
        case Gamemode.Catch:
            return "catch";
        case Gamemode.Mania:
            return "mania";
        default:
            return "Unknown";
    }
}

export function formatCalculatorEngine(calculatorEngine: string) {
    switch (calculatorEngine) {
        case "osu.Game.Rulesets.Osu":
        case "osu.Game.Rulesets.Taiko":
        case "osu.Game.Rulesets.Catch":
        case "osu.Game.Rulesets.Mania":
            return "ppv2";
        case "https://github.com/Syriiin/osu/tree/performanceplus":
            return "PP+";
        default:
            return calculatorEngine;
    }
}

export function formatDiffcalcValueName(name: string) {
    // convert `camelCase` diffcalc value names to `Title Case With Spaces`
    return name // flowAim
        .replace(/([A-Z])/g, " $1") // flow Aim
        .replace(/^./, (str) => str.toUpperCase()); // Flow Aim
}
