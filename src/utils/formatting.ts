import { modsShortFromBitwise } from "./osu";
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
    const mods = modsShortFromBitwise(bitwiseMods);
    
    return mods.length > 0 ? mods.join(", ") : "";
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
