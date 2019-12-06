import { modsShortFromBitwise } from "./osu";

export function formatTime(seconds: number) {
    // convert seconds to MM:SS format
    seconds = Math.round(seconds);
    const minutesString = String(Math.floor(seconds / 60));
    const secondsString = String(seconds % 60);
    return `${minutesString}:${("00" + secondsString).substring(secondsString.length)}`;
}

export function formatMods(bitwiseMods: number) {
    // convert bitwise mods to mod string (eg. 72 -> "HD, DT")
    const mods = modsShortFromBitwise(bitwiseMods);
    
    return mods.length > 0 ? mods.join(", ") : "";
}

export function formatScoreResult(result: number) {
    // convert score result id to string representation
    switch (result) {
        case 1:     // Perfect
        case 2:     // No break
            return "Full Combo";
        case 4:     // Sliderbreak
        case 8:     // One miss
        case 16:    // End choke
            return "Choke";
        case 32:    // Clear
            return "Clear";
        default:
            return "Error";
    }
}

export function formatGamemodeName(gamemodeId: number) {
    switch (gamemodeId) {
        case 0:
            return "osu!";
        case 1:
            return "osu!taiko";
        case 2:
            return "osu!catch";
        case 3:
            return "osu!mania";
        default:
            return "Unknown";
    }
}
