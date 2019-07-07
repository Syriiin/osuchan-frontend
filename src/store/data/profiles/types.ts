import { Action } from "redux";

// Models

export interface OsuUser {
    id: number;
    username: string;
    country: string;
    joinDate: Date;
}

export interface UserStats {
    id: number;
    osuUserId: number;
    gamemode: number;
    playcount: number;
    playtime: number;
    level: number;
    rank: number;
    countryRank: number;
    pp: number;
    accuracy: number;
    nochokePp: number;
    scoreStyleAccuracy: number;
    scoreStyleBpm: number;
    scoreStyleCs: number;
    scoreStyleAr: number;
    scoreStyleOd: number;
    scoreStyleLength: number;
}

export interface Beatmap {
    id: number;
    setId: number;
    artist: string;
    title: string;
    difficultyName: string;
    gamemode: number;
    status: number;
    creatorName: string;
    createId: number;
    bpm: number;
    drainTime: number;
    totalTime: number;
    maxCombo: number;
    circleSize: number;
    overallDifficulty: number;
    approachRate: number;
    healthDrain: number;
    starRating: number;
    lastUpdated: Date;
}

export interface Score {
    id: number;
    beatmapId: number;
    userStatsId: number;
    score: number;
    count300: number;
    count100: number;
    count50: number;
    countMiss: number;
    countGeki: number;
    countKatu: number;
    bestCombo: number;
    mods: number;
    rank: string;
    pp: number;
    date: Date;
    accuracy: number;
    bpm: number;
    length: number;
    circleSize: number;
    approachRate: number;
    overallDifficulty: number;
    nochokePp: number;
    starRating: number;
    result: number;
}

// State

export interface ProfilesDataState {
    osuUsers: { [id: number]: OsuUser };
    userStats: { [id: number]: UserStats };
    beatmaps: { [id: number]: Beatmap };
    scores: { [id: number]: Score };
}

// Actions

export enum ProfilesActionType {
    AddOsuUsers = "ADD_OSUUSERS",
    AddUserStats = "ADD_USERSTATS",
    AddBeatmaps = "ADD_BEATMAPS",
    AddScores = "ADD_SCORES",
}

export interface ProfilesAddOsuUsers extends Action {
    type: ProfilesActionType.AddOsuUsers;
    osuUsers: OsuUser[];
}

export interface ProfilesAddUserStats extends Action {
    type: ProfilesActionType.AddUserStats;
    userStats: UserStats[];
}

export interface ProfilesAddBeatmaps extends Action {
    type: ProfilesActionType.AddBeatmaps;
    beatmaps: Beatmap[];
}

export interface ProfilesAddScores extends Action {
    type: ProfilesActionType.AddScores;
    scores: Score[];
}

export type ProfilesAction = ProfilesAddOsuUsers | ProfilesAddUserStats | ProfilesAddBeatmaps | ProfilesAddScores;
