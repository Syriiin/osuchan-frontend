import { ScoreResult, AllowedBeatmapStatus } from "./enums";
import { BeatmapStatus, Gamemode, Mods } from "../common/enums";

export interface OsuUser {
    id: number;
    username: string;
    country: string;
    joinDate: Date;
}

export interface UserStats {
    id: number;
    osuUser: OsuUser | null;
    osuUserId: number;
    gamemode: Gamemode;
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
    gamemode: Gamemode;
    status: BeatmapStatus;
    creatorName: string;
    creator: OsuUser | null;
    creatorId: number;
    bpm: number;
    drainTime: number;
    totalTime: number;
    maxCombo: number;
    circleSize: number;
    overallDifficulty: number;
    approachRate: number;
    healthDrain: number;
    starRating: number;
    submissionDate: Date;
    approvalDate: Date;
    lastUpdated: Date;
}

export interface Score {
    id: number;
    beatmap: Beatmap | null;
    beatmapId: number;
    userStats: UserStats | null;
    userStatsId: number;
    score: number;
    count300: number;
    count100: number;
    count50: number;
    countMiss: number;
    countGeki: number;
    countKatu: number;
    bestCombo: number;
    mods: Mods;
    rank: string;
    pp: number;
    date: Date;
    gamemode: Gamemode;
    accuracy: number;
    bpm: number;
    length: number;
    circleSize: number;
    approachRate: number;
    overallDifficulty: number;
    nochokePp: number;
    starRating: number;
    result: ScoreResult;
}

export interface ScoreFilter {
    allowedBeatmapStatus: AllowedBeatmapStatus;
    oldestBeatmapDate: Date | null;
    newestBeatmapDate: Date | null;
    oldestScoreDate: Date | null;
    newestScoreDate: Date | null;
    lowestAr: number | null;
    highestAr: number | null;
    lowestOd: number | null;
    highestOd: number | null;
    lowestCs: number | null;
    highestCs: number | null;
    requiredMods: Mods;
    disqualifiedMods: Mods;
    lowestAccuracy: number | null;
    highestAccuracy: number | null;
}
