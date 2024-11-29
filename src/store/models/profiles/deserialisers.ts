import { Gamemode } from "../common/enums";
import { Beatmap, DifficultyCalculation, DifficultyValue, OsuUser, PerformanceCalculation, PerformanceValue, Score, ScoreFilter, UserStats } from "./types";

export function osuUserFromJson(data: any): OsuUser {
    return {
        id: data["id"],
        username: data["username"],
        country: data["country"],
        joinDate: new Date(data["join_date"]),
    };
}

export function userStatsFromJson(data: any): UserStats {
    return {
        id: data["id"],
        osuUser:
            typeof data["user"] === "object"
                ? osuUserFromJson(data["user"])
                : null,
        osuUserId:
            typeof data["user"] === "object"
                ? data["user"]["id"]
                : data["user"],
        gamemode: data["gamemode"],
        playcount: data["playcount"],
        playtime: data["playtime"],
        level: data["level"],
        rank: data["rank"],
        countryRank: data["country_rank"],
        pp: data["pp"],
        accuracy: data["accuracy"],
        nochokePp: data["nochoke_pp"],
        scoreStyleAccuracy: data["score_style_accuracy"],
        scoreStyleBpm: data["score_style_bpm"],
        scoreStyleCs: data["score_style_cs"],
        scoreStyleAr: data["score_style_ar"],
        scoreStyleOd: data["score_style_od"],
        scoreStyleLength: data["score_style_length"],
    };
}

export function beatmapFromJson(data: any): Beatmap {
    return {
        id: data["id"],
        setId: data["set_id"],
        artist: data["artist"],
        title: data["title"],
        difficultyName: data["difficulty_name"],
        gamemode: data["gamemode"],
        status: data["status"],
        creatorName: data["creator_name"],
        creator:
            typeof data["creator"] === "object"
                ? osuUserFromJson(data["creator"])
                : null,
        creatorId:
            typeof data["creator"] === "object"
                ? data["creator"]["id"]
                : data["creator"],
        bpm: data["bpm"],
        drainTime: data["drain_time"],
        totalTime: data["total_time"],
        maxCombo: data["max_combo"],
        circleSize: data["circle_size"],
        overallDifficulty: data["overall_difficulty"],
        approachRate: data["approach_rate"],
        healthDrain: data["health_drain"],
        submissionDate: new Date(data["submission_date"]),
        approvalDate: new Date(data["approval_date"]),
        lastUpdated: new Date(data["last_updated"]),
    };
}

export function scoreFromJson(data: any, defaultEngine: string | null = null, primaryPerformanceValue: string = "total"): Score {
    if (defaultEngine === null) {
        switch (data["gamemode"]) {
            case Gamemode.Standard:
                defaultEngine = "osu.Game.Rulesets.Osu";
                break;
            case Gamemode.Taiko:
                defaultEngine = "osu.Game.Rulesets.Taiko";
                break;
            case Gamemode.Catch:
                defaultEngine = "osu.Game.Rulesets.Catch";
                break;
            case Gamemode.Mania:
                defaultEngine = "osu.Game.Rulesets.Mania";
                break;
        }
    }
    const performanceCalculations: PerformanceCalculation[] = data["performance_calculations"].map(performanceCalculationFromJson);
    performanceCalculations.sort((a, b) => {
        if (a.calculatorEngine === defaultEngine) {
            // If a is the default engine, sort it before b
            return -1;
        } else if (a.calculatorEngine !== defaultEngine) {
            // If b is the default engine, sort it before a
            return 1;
        } else {
            // Otherwise, sort by alphabetical order
            return a.calculatorEngine.localeCompare(b.calculatorEngine);
        }
    });

    return {
        id: data["id"],
        beatmap:
            typeof data["beatmap"] === "object"
                ? beatmapFromJson(data["beatmap"])
                : null,
        beatmapId:
            typeof data["beatmap"] === "object"
                ? data["beatmap"]["id"]
                : data["beatmap"],
        userStats:
            typeof data["user_stats"] === "object"
                ? userStatsFromJson(data["user_stats"])
                : null,
        userStatsId:
            typeof data["user_stats"] === "object"
                ? data["user_stats"]["id"]
                : data["user_stats"],
        score: data["score"],
        statistics: data["statistics"],
        bestCombo: data["best_combo"],
        mods: data["mods"],
        rank: data["rank"],
        date: new Date(data["date"]),
        gamemode: data["gamemode"],
        accuracy: data["accuracy"],
        bpm: data["bpm"],
        length: data["length"],
        circleSize: data["circle_size"],
        approachRate: data["approach_rate"],
        overallDifficulty: data["overall_difficulty"],
        result: data["result"],
        performanceTotal: performanceCalculations.at(0)?.performanceValues.find((value) => value["name"] === primaryPerformanceValue)?.value ?? 0,
        difficultyTotal: performanceCalculations.at(0)?.difficultyCalculation.difficultyValues.find((value) => value["name"] === "total")?.value ?? 0,
        performanceCalculations: performanceCalculations,
    };
}

export function scoreFilterFromJson(data: any): ScoreFilter {
    return {
        allowedBeatmapStatus: data["allowed_beatmap_status"],
        oldestBeatmapDate: data["oldest_beatmap_date"]
            ? new Date(data["oldest_beatmap_date"])
            : null,
        newestBeatmapDate: data["newest_beatmap_date"]
            ? new Date(data["newest_beatmap_date"])
            : null,
        oldestScoreDate: data["oldest_score_date"]
            ? new Date(data["oldest_score_date"])
            : null,
        newestScoreDate: data["newest_score_date"]
            ? new Date(data["newest_score_date"])
            : null,
        lowestAr: data["lowest_ar"],
        highestAr: data["highest_ar"],
        lowestOd: data["lowest_od"],
        highestOd: data["highest_od"],
        lowestCs: data["lowest_cs"],
        highestCs: data["highest_cs"],
        requiredMods: data["required_mods"],
        disqualifiedMods: data["disqualified_mods"],
        lowestAccuracy: data["lowest_accuracy"],
        highestAccuracy: data["highest_accuracy"],
        lowestLength: data["lowest_length"],
        highestLength: data["highest_length"],
    };
}

export function difficultyCalculationFromJson(data: any): DifficultyCalculation {
    return {
        calculatorEngine: data["calculator_engine"],
        calculatorVersion: data["calculator_version"],
        mods: data["mods"],
        difficultyValues: data["difficulty_values"].map(difficultyValueFromJson),
    };
}

export function difficultyValueFromJson(data: any): DifficultyValue {
    return {
        name: data["name"],
        value: data["value"],
    };
}

export function performanceCalculationFromJson(data: any): PerformanceCalculation {
    return {
        calculatorEngine: data["calculator_engine"],
        calculatorVersion: data["calculator_version"],
        performanceValues: data["performance_values"].map(performanceValueFromJson),
        difficultyCalculation: difficultyCalculationFromJson(data["difficulty_calculation"]),
    };
}

export function performanceValueFromJson(data: any): PerformanceValue {
    return {
        name: data["name"],
        value: data["value"],
    };
}
