import { Gamemode, Mods } from "../store/models/common/enums";
import { ScoreResult } from "../store/models/profiles/enums";

export function gamemodeIdFromName(gamemodeName: string | undefined) {
    switch (gamemodeName) {
        case "osu":
        default:
            return Gamemode.Standard;
        case "taiko":
            return Gamemode.Taiko;
        case "catch":
        case "fruits":
            return Gamemode.Catch;
        case "mania":
            return Gamemode.Mania;
    }
}

export function modsShortFromBitwise(bitwiseMods: Mods) {
    const allMods: {[name: string]: Mods} = {
        "NONE": Mods.None,
        "NF": Mods.NoFail,
        "EZ": Mods.Easy,
        "TD": Mods.TouchDevice,
        "HD": Mods.Hidden,
        "HR": Mods.HardRock,
        "SD": Mods.SuddenDeath,
        "DT": Mods.DoubleTime,
        "RX": Mods.Relax,
        "HT": Mods.HalfTime,
        "NC": Mods.Nightcore,
        "FL": Mods.Flashlight,
        "AUTO": Mods.Auto,
        "SO": Mods.SpunOut,
        "AP": Mods.Autopilot,
        "PF": Mods.Perfect,
        "4K": Mods.Key4,
        "5K": Mods.Key5,
        "6K": Mods.Key6,
        "7K": Mods.Key7,
        "8K": Mods.Key8,
        "FI": Mods.FadeIn,
        "RN": Mods.Random,
        "CN": Mods.Cinema,
        "TP": Mods.TargetPractice,
        "9K": Mods.Key9,
        "COOP": Mods.KeyCoop,
        "1K": Mods.Key1,
        "2K": Mods.Key2,
        "3K": Mods.Key3,
        "V2": Mods.ScoreV2,
        "MI": Mods.Mirror
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
