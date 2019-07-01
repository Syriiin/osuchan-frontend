import { ProfilesAddOsuUsers, ProfilesActionType, ProfilesAddUserStats, ProfilesAddBeatmaps, ProfilesAddScores, OsuUser, UserStats, Score, Beatmap } from "./types";

// Actions

export function addOsuUsers(...osuUsers: OsuUser[]): ProfilesAddOsuUsers {
    return {
        type: ProfilesActionType.AddOsuUsers,
        osuUsers
    }
}

export function addUserStats(...userStats: UserStats[]): ProfilesAddUserStats {
    return {
        type: ProfilesActionType.AddUserStats,
        userStats
    }
}

export function addBeatmaps(...beatmaps: Beatmap[]): ProfilesAddBeatmaps {
    return {
        type: ProfilesActionType.AddBeatmaps,
        beatmaps
    }
}

export function addScores(...scores: Score[]): ProfilesAddScores {
    return {
        type: ProfilesActionType.AddScores,
        scores
    }
}
