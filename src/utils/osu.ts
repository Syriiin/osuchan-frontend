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

export function calculateAccuracy(gamemode: Gamemode, count300: number, count100: number, count50: number, countMiss: number, countKatu?: number, countGeki?: number) {
    let totalHits;
    let points;

    switch (gamemode) {
        case Gamemode.Standard:
            totalHits = count300 + count100 + count50 + countMiss;
            points = (count50 * 50) + (count100 * 100) + (count300 * 300);
            return (points / (totalHits * 300)) * 100;
        case Gamemode.Taiko:
            totalHits = count300 + count100 + countMiss;
            points = ((count100 * 0.5) + (count300 * 1)) * 300;
            return (points / (totalHits * 300)) * 100;
        case Gamemode.Catch:
            let countDropMiss = countKatu as number;
            totalHits = count300 + count100 + count50 + countMiss + countDropMiss;
            let caught = count300 + count100 + count50;
            return (caught / totalHits) * 100;
        case Gamemode.Mania:
            let countMax = countGeki as number;
            let count200 = countKatu as number;
            totalHits = count50 + count100 + count200 + count300 + countMax + countMiss;
            points = (count50 * 50) + (count100 * 100) + (count200 * 200) + (count300 * 300) + (countMax * 300);
            return (points / (totalHits * 300)) * 100;
    }
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

export function calculateCircleSize(circleSize: number, mods: Mods, gamemode: Gamemode) {
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
    const arToMs = (ar: number) => ar <= 5 ? -120 * ar + 1800 : -150 * ar + 1950;
    const msToAr = (ms: number) => ms >= 1200 ? (ms - 1800) / -120 : (ms - 1950) / -150;

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

    return approachRate
}

export function calculateOverallDifficulty(overallDifficulty: number, mods: Mods) {
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

export function getScoreResult(countMiss: number, bestCombo: number, maxCombo: number) {
    if (countMiss === 1) {
        return ScoreResult.OneMiss;
    }

    const percentCombo = bestCombo / maxCombo

    if (percentCombo === 1) {
        return ScoreResult.Perfect;
    } else if (percentCombo > 0.98 && countMiss === 0) {
        return ScoreResult.NoBreak;
    } else if (percentCombo > 0.95) {
        return ScoreResult.EndChoke;
    } else if (countMiss === 0) {
        return ScoreResult.SliderBreak;
    } else {
        return ScoreResult.Clear;
    }
}
