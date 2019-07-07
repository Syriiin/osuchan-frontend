export function formatTime(seconds: number) {
    // convert seconds to MM:SS format
    seconds = Math.round(seconds);
    const minutesString = String(Math.floor(seconds / 60));
    const secondsString = String(seconds % 60);
    return `${minutesString}:${("00" + secondsString).substring(secondsString.length)}`;
}

export function formatMods(enabledMods: number) {
    // convert bitwise mods to mod string (eg. 72 -> "+HD, DT")
    const allMods: {[name: string]: number} = {
        "NONE": 0,
        "NF": 1,
        "EZ": 2,
        "TD": 4,
        "HD": 8,
        "HR": 16,
        "SD": 32,
        "DT": 64,
        "RX": 128,
        "HT": 256,
        "NC": 512,
        "FL": 1024,
        "AUTO": 2048,
        "SO": 4096,
        "AP": 8192,
        "PF": 16384,
        "4K": 32768,
        "5K": 65536,
        "6K": 131072,
        "7K": 262144,
        "8K": 524288,
        "FI": 1048576,
        "RN": 2097152,
        "CN": 4194304,
        "TP": 8388608,
        "9K": 16777216,
        "COOP": 33554432,
        "1K": 67108864,
        "2K": 134217728,
        "3K": 268435456,
        "V2": 536870912,
        "LAST_MOD": 1073741824
    }

    const mods = [];

    for (const mod in allMods) {
        if (allMods[mod] & enabledMods) {
            mods.push(mod);
        }
    }

    if (mods.includes("NC")) {
        mods.splice(mods.indexOf("DT"), 1);
    }
    if (mods.includes("PF")) {
        mods.splice(mods.indexOf("SD"), 1);
    }

    mods.sort((a: string, b: string) => allMods[a] - allMods[b]);

    return mods.length > 0 ? mods.join(", ") : "";
}

export function formatScoreResult(result: number) {
    // convert score result id to string representation
    switch (result) {
        case 1:
        case 2:
            return "Full Combo";
        case 4:
        case 8:
        case 16:
            return "Choke";
        case 32:
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
