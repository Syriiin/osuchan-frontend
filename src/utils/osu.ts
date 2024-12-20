import { Gamemode, Mods } from "../store/models/common/enums";

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
    const allMods: { [name: string]: Mods } = {
        NONE: Mods.None,
        NF: Mods.NoFail,
        EZ: Mods.Easy,
        TD: Mods.TouchDevice,
        HD: Mods.Hidden,
        HR: Mods.HardRock,
        SD: Mods.SuddenDeath,
        DT: Mods.DoubleTime,
        RX: Mods.Relax,
        HT: Mods.HalfTime,
        NC: Mods.Nightcore,
        FL: Mods.Flashlight,
        AUTO: Mods.Auto,
        SO: Mods.SpunOut,
        AP: Mods.Autopilot,
        PF: Mods.Perfect,
        "4K": Mods.Key4,
        "5K": Mods.Key5,
        "6K": Mods.Key6,
        "7K": Mods.Key7,
        "8K": Mods.Key8,
        FI: Mods.FadeIn,
        RN: Mods.Random,
        CN: Mods.Cinema,
        TP: Mods.TargetPractice,
        "9K": Mods.Key9,
        COOP: Mods.KeyCoop,
        "1K": Mods.Key1,
        "2K": Mods.Key2,
        "3K": Mods.Key3,
        V2: Mods.ScoreV2,
        MI: Mods.Mirror,
    };

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

export function modsAsArray(bitwiseMods: Mods) {
    const allMods: Mods[] = [
        Mods.NoFail,
        Mods.Easy,
        Mods.TouchDevice,
        Mods.Hidden,
        Mods.HardRock,
        Mods.SuddenDeath,
        Mods.DoubleTime,
        Mods.Relax,
        Mods.HalfTime,
        Mods.Nightcore,
        Mods.Flashlight,
        Mods.Auto,
        Mods.SpunOut,
        Mods.Autopilot,
        Mods.Perfect,
        Mods.Key4,
        Mods.Key5,
        Mods.Key6,
        Mods.Key7,
        Mods.Key8,
        Mods.FadeIn,
        Mods.Random,
        Mods.Cinema,
        Mods.TargetPractice,
        Mods.Key9,
        Mods.KeyCoop,
        Mods.Key1,
        Mods.Key2,
        Mods.Key3,
        Mods.ScoreV2,
        Mods.Mirror,
    ];

    const mods: Mods[] = [];

    for (const mod of allMods) {
        if (mod & bitwiseMods) {
            mods.push(mod);
        }
    }

    if (mods.includes(Mods.Nightcore) && mods.includes(Mods.DoubleTime)) {
        mods.splice(mods.indexOf(Mods.DoubleTime), 1);
    }
    if (mods.includes(Mods.Perfect) && mods.includes(Mods.SuddenDeath)) {
        mods.splice(mods.indexOf(Mods.SuddenDeath), 1);
    }

    return mods;
}

export function calculateClassicAccuracy(statistics: Record<string, number>, gamemode: Gamemode): number {
    let maxPoints: number;
    let points: number;

    const great = statistics["great"] ?? 0;
    const ok = statistics["ok"] ?? 0;
    const meh = statistics["meh"] ?? 0;
    const miss = statistics["miss"] ?? 0;
    const largeTickHit = statistics["large_tick_hit"] ?? 0;
    const smallTickHit = statistics["small_tick_hit"] ?? 0;
    const smallTickMiss = statistics["small_tick_miss"] ?? 0;
    const perfect = statistics["perfect"] ?? 0;
    const good = statistics["good"] ?? 0;

    switch (gamemode) {
        case Gamemode.Standard:
            maxPoints = 300 * (great + ok + meh + miss);
            points = (50 * meh) + (100 * ok) + (300 * great);
            break;

        case Gamemode.Taiko:
            maxPoints = 300 * (great + ok + miss);
            points = 300 * ((0.5 * ok) + great);
            break;

        case Gamemode.Catch:
            maxPoints = great + largeTickHit + smallTickHit + miss + smallTickMiss;
            points = great + largeTickHit + smallTickHit;
            break;

        case Gamemode.Mania:
            maxPoints = 300 * (meh + ok + good + great + perfect + miss);
            points = (50 * meh) + (100 * ok) + (200 * good) + (300 * great) + (300 * perfect);
            break;

        default:
            throw new Error(`${gamemode} is not a valid gamemode`);
    }

    return 100 * (points / maxPoints);
}

export function calculateBpm(bpm: number, mods: Mods) {
    if (mods & Mods.DoubleTime) {
        return bpm * 1.5;
    } else if (mods & Mods.HalfTime) {
        return bpm * (3 / 4);
    }

    return bpm;
}

export function calculateLength(length: number, mods: Mods) {
    if (mods & Mods.DoubleTime) {
        return length / 1.5;
    } else if (mods & Mods.HalfTime) {
        return length / (3 / 4);
    }

    return length;
}

export function calculateCircleSize(
    circleSize: number,
    mods: Mods,
    gamemode: Gamemode
) {
    if (gamemode & Gamemode.Mania) {
        if (mods & Mods.KeyMod) {
            switch (mods) {
                case Mods.Key1:
                    return 1;
                case Mods.Key2:
                    return 2;
                case Mods.Key3:
                    return 3;
                case Mods.Key4:
                    return 4;
                case Mods.Key5:
                    return 5;
                case Mods.Key6:
                    return 6;
                case Mods.Key7:
                    return 7;
                case Mods.Key8:
                    return 8;
                case Mods.Key9:
                    return 9;
            }
        }
        return circleSize;
    }

    if (mods & Mods.HardRock) {
        return circleSize * 1.3;
    } else if (mods & Mods.Easy) {
        return circleSize * 0.5;
    }
    return circleSize;
}

export function calculateApproachRate(approachRate: number, mods: Mods) {
    const arToMs = (ar: number) =>
        ar <= 5 ? -120 * ar + 1800 : -150 * ar + 1950;
    const msToAr = (ms: number) =>
        ms >= 1200 ? (ms - 1800) / -120 : (ms - 1950) / -150;

    if (mods & Mods.HardRock) {
        approachRate *= 1.4;
    } else if (mods & Mods.Easy) {
        approachRate *= 0.5;
    }

    if (approachRate > 10) {
        approachRate = 10;
    }

    if (mods & Mods.DoubleTime) {
        let ms = arToMs(approachRate) / 1.5;
        approachRate = msToAr(ms);
    } else if (mods & Mods.HalfTime) {
        let ms = arToMs(approachRate) / (3 / 4);
        approachRate = msToAr(ms);
    }

    return approachRate;
}

export function calculateOverallDifficulty(
    overallDifficulty: number,
    mods: Mods
) {
    const odToMs = (od: number) => -6 * od + 79.5;
    const msToOd = (ms: number) => (ms - 79.5) / -6;

    if (mods & Mods.HardRock) {
        overallDifficulty *= 1.4;
    } else if (mods & Mods.Easy) {
        overallDifficulty *= 0.5;
    }

    if (overallDifficulty > 10) {
        overallDifficulty = 10;
    }

    if (mods & Mods.DoubleTime) {
        let ms = odToMs(overallDifficulty) / 1.5;
        overallDifficulty = msToOd(ms);
    } else if (mods & Mods.HalfTime) {
        let ms = odToMs(overallDifficulty) / (3 / 4);
        overallDifficulty = msToOd(ms);
    }

    return overallDifficulty;
}
