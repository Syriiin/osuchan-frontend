import { Gamemode } from "../store/models/common/enums";
import { ScoreResult } from "../store/models/profiles/enums";
import {
    formatTime,
    formatPlayTime,
    formatModName,
    formatScoreResult,
    formatGamemodeName,
    formatGamemodeNameShort,
    formatCalculatorEngine,
    formatDiffcalcValueName,
} from "./formatting";

describe("formatTime", () => {
    test("formats zero seconds", () => {
        expect(formatTime(0)).toBe("0:00");
    });

    test("formats seconds less than a minute", () => {
        expect(formatTime(45)).toBe("0:45");
    });

    test("formats exactly one minute", () => {
        expect(formatTime(60)).toBe("1:00");
    });

    test("formats minutes and seconds", () => {
        expect(formatTime(185)).toBe("3:05");
    });

    test("rounds fractional seconds", () => {
        expect(formatTime(90.7)).toBe("1:31");
    });
});

describe("formatPlayTime", () => {
    test("formats sub-minute seconds", () => {
        expect(formatPlayTime(45)).toBe("45s");
    });

    test("formats minutes and seconds", () => {
        expect(formatPlayTime(185)).toBe("3m 5s");
    });

    test("formats hours and minutes", () => {
        expect(formatPlayTime(15623)).toBe("4h 20m");
    });

    test("rounds fractional seconds", () => {
        expect(formatPlayTime(90.7)).toBe("1m 31s");
    });
});

describe("formatModName", () => {
    test("returns formatted name for NF", () => {
        expect(formatModName("NF")).toBe("No Fail");
    });

    test("returns formatted name for DT", () => {
        expect(formatModName("DT")).toBe("Double Time");
    });

    test("returns formatted name for HDHR", () => {
        expect(formatModName("HD")).toBe("Hidden");
        expect(formatModName("HR")).toBe("Hard Rock");
    });
});

describe("formatScoreResult", () => {
    test("perfect is Full Combo", () => {
        expect(formatScoreResult(ScoreResult.Perfect)).toBe("Full Combo");
    });

    test("no break is Full Combo", () => {
        expect(formatScoreResult(ScoreResult.NoBreak)).toBe("Full Combo");
    });

    test("slider break is Choke", () => {
        expect(formatScoreResult(ScoreResult.SliderBreak)).toBe("Choke");
    });

    test("clear is Clear", () => {
        expect(formatScoreResult(ScoreResult.Clear)).toBe("Clear");
    });
});

describe("formatGamemodeName", () => {
    test("formats standard", () => {
        expect(formatGamemodeName(Gamemode.Standard)).toBe("osu!");
    });

    test("formats taiko", () => {
        expect(formatGamemodeName(Gamemode.Taiko)).toBe("osu!taiko");
    });

    test("formats catch", () => {
        expect(formatGamemodeName(Gamemode.Catch)).toBe("osu!catch");
    });

    test("formats mania", () => {
        expect(formatGamemodeName(Gamemode.Mania)).toBe("osu!mania");
    });
});

describe("formatGamemodeNameShort", () => {
    test("formats standard short", () => {
        expect(formatGamemodeNameShort(Gamemode.Standard)).toBe("osu");
    });

    test("formats mania short", () => {
        expect(formatGamemodeNameShort(Gamemode.Mania)).toBe("mania");
    });
});

describe("formatCalculatorEngine", () => {
    test("formats ppv2 engines", () => {
        expect(formatCalculatorEngine("osu.Game.Rulesets.Osu")).toBe("ppv2");
        expect(formatCalculatorEngine("osu.Game.Rulesets.Taiko")).toBe("ppv2");
        expect(formatCalculatorEngine("osu.Game.Rulesets.Catch")).toBe("ppv2");
        expect(formatCalculatorEngine("osu.Game.Rulesets.Mania")).toBe("ppv2");
    });

    test("formats PP+ engine", () => {
        expect(formatCalculatorEngine("https://github.com/Syriiin/osu/tree/performanceplus")).toBe(
            "PP+",
        );
    });
});

describe("formatDiffcalcValueName", () => {
    test("converts camelCase to Title Case", () => {
        expect(formatDiffcalcValueName("flowAim")).toBe("Flow Aim");
    });

    test("handles single word", () => {
        expect(formatDiffcalcValueName("speed")).toBe("Speed");
    });
});
