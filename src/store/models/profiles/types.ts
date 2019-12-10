import { ScoreResult } from "./enums";
import { BeatmapStatus, Gamemode, Mods } from "../common/enums";

export interface OsuUser {
    id: number;
    username: string;
    country: string;
    joinDate: Date;
}

export interface UserStats {
    id: number;
    osuUser: OsuUser | number;
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
    creator: OsuUser | number;
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
    beatmap: Beatmap | number;
    userStats: UserStats | number;
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
