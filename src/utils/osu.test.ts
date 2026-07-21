import { Gamemode } from "../store/models/common/enums";
import {
    gamemodeIdFromName,
    bitmodsFromJsonMods,
    modsJsonFromModAcronyms,
    modAcronymsFromJsonMods,
    calculateClassicAccuracy,
    calculateBpm,
    calculateLength,
    calculateCircleSize,
    calculateApproachRate,
    calculateOverallDifficulty,
} from "./osu";

describe("gamemodeIdFromName", () => {
    test('"osu" returns Standard', () => {
        expect(gamemodeIdFromName("osu")).toBe(Gamemode.Standard);
    });

    test('"taiko" returns Taiko', () => {
        expect(gamemodeIdFromName("taiko")).toBe(Gamemode.Taiko);
    });

    test('"catch" returns Catch', () => {
        expect(gamemodeIdFromName("catch")).toBe(Gamemode.Catch);
    });

    test('"fruits" returns Catch', () => {
        expect(gamemodeIdFromName("fruits")).toBe(Gamemode.Catch);
    });

    test('"mania" returns Mania', () => {
        expect(gamemodeIdFromName("mania")).toBe(Gamemode.Mania);
    });

    test("undefined returns Standard", () => {
        expect(gamemodeIdFromName(undefined)).toBe(Gamemode.Standard);
    });
});

describe("bitmodsFromJsonMods", () => {
    test("no mods returns 0", () => {
        expect(bitmodsFromJsonMods({})).toBe(0);
    });

    test("HD returns 8", () => {
        expect(bitmodsFromJsonMods({ HD: {} })).toBe(8);
    });

    test("HDDT returns 72", () => {
        expect(bitmodsFromJsonMods({ HD: {}, DT: {} })).toBe(72);
    });
});

describe("modsJsonFromModAcronyms", () => {
    test("converts acronyms to mods JSON", () => {
        expect(modsJsonFromModAcronyms(["HD", "DT"])).toEqual({
            HD: {},
            DT: {},
        });
    });

    test("empty array returns empty object", () => {
        expect(modsJsonFromModAcronyms([])).toEqual({});
    });
});

describe("modAcronymsFromJsonMods", () => {
    test("converts mods JSON to sorted acronyms", () => {
        expect(modAcronymsFromJsonMods({ DT: {}, HD: {} })).toEqual(["HD", "DT"]);
    });
});

describe("calculateClassicAccuracy", () => {
    test("calculates standard accuracy", () => {
        const stats = { great: 100, ok: 0, meh: 0, miss: 0 };
        expect(calculateClassicAccuracy(stats, Gamemode.Standard)).toBe(100);
    });

    test("calculates standard accuracy with misses", () => {
        const stats = { great: 90, ok: 5, meh: 3, miss: 2 };
        // max = 300 * 100 = 30000, points = 50*3 + 100*5 + 300*90 = 150 + 500 + 27000 = 27650
        // expected = 100 * 27650 / 30000 = 92.166...
        expect(calculateClassicAccuracy(stats, Gamemode.Standard)).toBeCloseTo(92.166, 2);
    });

    test("calculates taiko accuracy", () => {
        const stats = { great: 80, ok: 20, miss: 0 };
        // max = 300 * 100 = 30000, points = 300 * (0.5*20 + 80) = 300 * 90 = 27000
        // expected = 100 * 27000 / 30000 = 90
        expect(calculateClassicAccuracy(stats, Gamemode.Taiko)).toBeCloseTo(90, 1);
    });

    test("calculates catch accuracy", () => {
        const stats = {
            great: 100,
            large_tick_hit: 20,
            small_tick_hit: 50,
            miss: 0,
            small_tick_miss: 5,
        };
        // max = 100 + 20 + 50 + 0 + 5 = 175, points = 100 + 20 + 50 = 170
        // expected = 100 * 170 / 175 = 97.14...
        expect(calculateClassicAccuracy(stats, Gamemode.Catch)).toBeCloseTo(97.14, 1);
    });

    test("calculates mania accuracy", () => {
        const stats = {
            perfect: 50,
            great: 30,
            good: 10,
            ok: 5,
            meh: 3,
            miss: 2,
        };
        // max = 300 * (3+5+10+30+50+2) = 300 * 100 = 30000
        // points = 50*3 + 100*5 + 200*10 + 300*30 + 300*50 = 150 + 500 + 2000 + 9000 + 15000 = 26650
        // expected = 100 * 26650 / 30000 = 88.83...
        expect(calculateClassicAccuracy(stats, Gamemode.Mania)).toBeCloseTo(88.83, 1);
    });
});

describe("calculateBpm", () => {
    test("no mods returns original BPM", () => {
        expect(calculateBpm(120, {})).toBe(120);
    });

    test("DT multiplies by 1.5", () => {
        expect(calculateBpm(120, { DT: {} })).toBe(180);
    });

    test("HT multiplies by 0.75", () => {
        expect(calculateBpm(120, { HT: {} })).toBe(90);
    });
});

describe("calculateLength", () => {
    test("no mods returns original length", () => {
        expect(calculateLength(120, {})).toBe(120);
    });

    test("DT divides by 1.5", () => {
        expect(calculateLength(120, { DT: {} })).toBe(80);
    });

    test("HT divides by 0.75", () => {
        expect(calculateLength(120, { HT: {} })).toBe(160);
    });
});

describe("calculateCircleSize", () => {
    test("no mods returns original CS", () => {
        expect(calculateCircleSize(5, {}, Gamemode.Standard)).toBe(5);
    });

    test("HR multiplies by 1.3", () => {
        expect(calculateCircleSize(5, { HR: {} }, Gamemode.Standard)).toBe(6.5);
    });

    test("EZ multiplies by 0.5", () => {
        expect(calculateCircleSize(5, { EZ: {} }, Gamemode.Standard)).toBe(2.5);
    });

    test("returns key count for mania key mods", () => {
        expect(calculateCircleSize(5, { "7K": {} }, Gamemode.Mania)).toBe(7);
    });

    test("returns original CS for unknown mania key mods", () => {
        expect(calculateCircleSize(5, {}, Gamemode.Mania)).toBe(5);
    });
});

describe("calculateApproachRate", () => {
    test("no mods returns original AR", () => {
        expect(calculateApproachRate(9, {})).toBe(9);
    });

    test("HR multiplies by 1.4", () => {
        expect(calculateApproachRate(5, { HR: {} })).toBe(7);
    });

    test("caps at 10", () => {
        expect(calculateApproachRate(8, { HR: {} })).toBe(10);
    });

    test("EZ multiplies by 0.5", () => {
        expect(calculateApproachRate(5, { EZ: {} })).toBe(2.5);
    });

    test("DT converts AR through ms", () => {
        // AR 9 in ms: -150*9 + 1950 = 600ms
        // With DT: 600 / 1.5 = 400ms
        // Back to AR: (400 - 1950) / -150 = 10.33
        expect(calculateApproachRate(9, { DT: {} })).toBeCloseTo(10.33, 2);
    });
});

describe("calculateOverallDifficulty", () => {
    test("no mods returns original OD", () => {
        expect(calculateOverallDifficulty(9, {})).toBe(9);
    });

    test("HR multiplies by 1.4", () => {
        expect(calculateOverallDifficulty(5, { HR: {} })).toBe(7);
    });

    test("caps at 10", () => {
        expect(calculateOverallDifficulty(8, { HR: {} })).toBe(10);
    });

    test("EZ multiplies by 0.5", () => {
        expect(calculateOverallDifficulty(5, { EZ: {} })).toBe(2.5);
    });
});
