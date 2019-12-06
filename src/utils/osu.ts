export function gamemodeIdFromName(gamemodeName: string | undefined) {
    switch (gamemodeName) {
        case "osu":
        default:
            return 0;
        case "taiko":
            return 1;
        case "catch":
        case "fruits":
            return 2;
        case "mania":
            return 3;
    }
}

export function modsShortFromBitwise(bitwiseMods: number) {
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
        "MI": 1073741824
    }

    const mods = [];

    for (const mod in allMods) {
        if (allMods[mod] & bitwiseMods) {
            mods.push(mod);
        }
    }

    if (mods.includes("NC") && mods.includes("DT")) {
        mods.splice(mods.indexOf("DT"), 1);
    }
    if (mods.includes("PF") && mods.includes("SD")) {
        mods.splice(mods.indexOf("SD"), 1);
    }

    mods.sort((a: string, b: string) => allMods[a] - allMods[b]);

    return mods;
}
