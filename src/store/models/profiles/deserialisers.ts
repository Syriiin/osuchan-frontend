import { OsuUser, UserStats, Beatmap, Score } from "./types";

export function osuUserFromJson(osuUserData: any): OsuUser {
    return {
        id: osuUserData["id"],
        username: osuUserData["username"],
        country: osuUserData["country"],
        joinDate: new Date(osuUserData["join_date"])
    }
}

export function userStatsFromJson(userStatsData: any): UserStats {
    return {
        id: userStatsData["id"],
        osuUser: typeof userStatsData["user"] === "object" ? osuUserFromJson(userStatsData["user"]) : userStatsData["user"],
        gamemode: userStatsData["gamemode"],
        playcount: userStatsData["playcount"],
        playtime: userStatsData["playtime"],
        level: userStatsData["level"],
        rank: userStatsData["rank"],
        countryRank: userStatsData["country_rank"],
        pp: userStatsData["pp"],
        accuracy: userStatsData["accuracy"],
        nochokePp: userStatsData["nochoke_pp"],
        scoreStyleAccuracy: userStatsData["score_style_accuracy"],
        scoreStyleBpm: userStatsData["score_style_bpm"],
        scoreStyleCs: userStatsData["score_style_cs"],
        scoreStyleAr: userStatsData["score_style_ar"],
        scoreStyleOd: userStatsData["score_style_od"],
        scoreStyleLength: userStatsData["score_style_length"]
    }
}

export function beatmapFromJson(beatmapData: any): Beatmap {
    return {
        id: beatmapData["id"],
        setId: beatmapData["set_id"],
        artist: beatmapData["artist"],
        title: beatmapData["title"],
        difficultyName: beatmapData["difficulty_name"],
        gamemode: beatmapData["gamemode"],
        status: beatmapData["status"],
        creatorName: beatmapData["creator_name"],
        creator: typeof beatmapData["creator"] === "object" ? osuUserFromJson(beatmapData["creator"]) : beatmapData["creator"],
        bpm: beatmapData["bpm"],
        drainTime: beatmapData["drain_time"],
        totalTime: beatmapData["total_time"],
        maxCombo: beatmapData["max_combo"],
        circleSize: beatmapData["circle_size"],
        overallDifficulty: beatmapData["overall_difficulty"],
        approachRate: beatmapData["approach_rate"],
        healthDrain: beatmapData["health_drain"],
        starRating: beatmapData["star_rating"],
        lastUpdated: new Date(beatmapData["last_updated"])
    }
}

export function scoreFromJson(scoreData: any): Score {
    return {
        id: scoreData["id"],
        beatmap: typeof scoreData["beatmap"] === "object" ? beatmapFromJson(scoreData["beatmap"]) : scoreData["beatmap"],
        userStats: typeof scoreData["user_stats"] === "object" ? userStatsFromJson(scoreData["user_stats"]) : scoreData["user_stats"],
        score: scoreData["score"],
        count300: scoreData["count_300"],
        count100: scoreData["count_100"],
        count50: scoreData["count_50"],
        countMiss: scoreData["count_miss"],
        countGeki: scoreData["count_geki"],
        countKatu: scoreData["count_katu"],
        bestCombo: scoreData["best_combo"],
        mods: scoreData["mods"],
        rank: scoreData["rank"],
        pp: scoreData["pp"],
        date: new Date(scoreData["date"]),
        accuracy: scoreData["accuracy"],
        bpm: scoreData["bpm"],
        length: scoreData["length"],
        circleSize: scoreData["circle_size"],
        approachRate: scoreData["approach_rate"],
        overallDifficulty: scoreData["overall_difficulty"],
        nochokePp: scoreData["nochoke_pp"],
        starRating: scoreData["star_rating"],
        result: scoreData["result"]
    }
}

