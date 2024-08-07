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

export function scoreFromJson(data: any): Score {
    const performanceCalculations: PerformanceCalculation[] = data["performance_calculations"].map(performanceCalculationFromJson);
    const defaultPerformanceCalculation = performanceCalculations.find(calc => [
        "rosu-pp-py",
        "osu.Game.Rulesets.Taiko",
        "osu.Game.Rulesets.Catch",
        "osu.Game.Rulesets.Mania"
    ].includes(calc["calculatorEngine"])) ?? performanceCalculations.at(0);
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
        count300: data["count_300"],
        count100: data["count_100"],
        count50: data["count_50"],
        countMiss: data["count_miss"],
        countGeki: data["count_geki"],
        countKatu: data["count_katu"],
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
        performanceTotal: defaultPerformanceCalculation?.performanceValues.find((value) => value["name"] === "total")?.value ?? 0,
        difficultyTotal: defaultPerformanceCalculation?.difficultyCalculation.difficultyValues.find((value) => value["name"] === "total")?.value ?? 0,
        performanceCalculations: data["performance_calculations"].map(performanceCalculationFromJson),
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
