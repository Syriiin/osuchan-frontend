import { modsAsArray } from "./osu";
import { ScoreResult } from "../store/models/profiles/enums";
import { Gamemode, Mods } from "../store/models/common/enums";

export function formatTime(seconds: number) {
    // convert seconds to MM:SS format
    seconds = Math.round(seconds);
    const minutesString = String(Math.floor(seconds / 60));
    const secondsString = String(seconds % 60);
    return `${minutesString}:${("00" + secondsString).substring(secondsString.length)}`;
}

export function formatMods(bitwiseMods: Mods) {
    // convert bitwise mods to mod string (eg. 72 -> "HD, DT")
    const mods = modsAsArray(bitwiseMods).map(mod => formatModNameShort(mod));
    
    return mods.length > 0 ? mods.join(", ") : "";
}

export function formatModName(bitwiseMods: Mods) {
    switch (bitwiseMods) {
        case Mods.None: return "None";
        case Mods.NoFail: return "No Fail";
        case Mods.Easy: return "Easy";
        case Mods.TouchDevice: return "Touch Device";
        case Mods.Hidden: return "Hidden";
        case Mods.HardRock: return "Hard Rock";
        case Mods.SuddenDeath: return "Sudden Death";
        case Mods.DoubleTime: return "Double Time";
        case Mods.Relax: return "Relax";
        case Mods.HalfTime: return "Half Time";
        case Mods.Nightcore: return "Nightcore";
        case Mods.Flashlight: return "Flashlight";
        case Mods.Auto: return "Auto";
        case Mods.SpunOut: return "Spun Out";
        case Mods.Autopilot: return "Autopilot";
        case Mods.Perfect: return "Perfect";
        case Mods.Key4: return "4 Key";
        case Mods.Key5: return "5 Key";
        case Mods.Key6: return "6 Key";
        case Mods.Key7: return "7 Key";
        case Mods.Key8: return "8 Key";
        case Mods.FadeIn: return "Fade In";
        case Mods.Random: return "Random";
        case Mods.Cinema: return "Cinema";
        case Mods.TargetPractice: return "Target Practice";
        case Mods.Key9: return "9 Key";
        case Mods.KeyCoop: return "Coop Key";
        case Mods.Key1: return "1 Key";
        case Mods.Key2: return "2 Key";
        case Mods.Key3: return "3 Key";
        case Mods.ScoreV2: return "Score V2";
        case Mods.Mirror: return "Mirror";
    }
}

export function formatModNameShort(bitwiseMods: Mods) {
    switch (bitwiseMods) {
        case Mods.None: return "NONE";
        case Mods.NoFail: return "NF";
        case Mods.Easy: return "EZ";
        case Mods.TouchDevice: return "TD";
        case Mods.Hidden: return "HD";
        case Mods.HardRock: return "HR";
        case Mods.SuddenDeath: return "SD";
        case Mods.DoubleTime: return "DT";
        case Mods.Relax: return "RX";
        case Mods.HalfTime: return "HT";
        case Mods.Nightcore: return "NC";
        case Mods.Flashlight: return "FL";
        case Mods.Auto: return "AUTO";
        case Mods.SpunOut: return "SO";
        case Mods.Autopilot: return "AP";
        case Mods.Perfect: return "PF";
        case Mods.Key4: return "4K";
        case Mods.Key5: return "5K";
        case Mods.Key6: return "6K";
        case Mods.Key7: return "7K";
        case Mods.Key8: return "8K";
        case Mods.FadeIn: return "FI";
        case Mods.Random: return "RN";
        case Mods.Cinema: return "CN";
        case Mods.TargetPractice: return "TP";
        case Mods.Key9: return "9K";
        case Mods.KeyCoop: return "COOP";
        case Mods.Key1: return "1K";
        case Mods.Key2: return "2K";
        case Mods.Key3: return "3K";
        case Mods.ScoreV2: return "V2";
        case Mods.Mirror: return "MI";
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
