import { Gamemode, ModAcronym } from "../store/models/common/enums";
import { ScoreResult } from "../store/models/profiles/enums";

export function formatTime(seconds: number) {
    // convert seconds to MM:SS format
    seconds = Math.round(seconds);
    const minutesString = String(Math.floor(seconds / 60));
    const secondsString = String(seconds % 60);
    return `${minutesString}:${("00" + secondsString).substring(
        secondsString.length
    )}`;
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
        // lazer mods
        case ModAcronym.Blinds:
            return "Blinds";
        case ModAcronym.AccuracyChallenge:
            return "Accuracy Challenge";
        case ModAcronym.Daycore:
            return "Daycore";
        case ModAcronym.Tracing:
            return "Tracing";
        case ModAcronym.Muted:
            return "Muted";
        case ModAcronym.NoScope:
            return "No Scope";
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
