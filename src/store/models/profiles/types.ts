import { BeatmapStatus, Gamemode, Mods } from "../common/enums";
import { AllowedBeatmapStatus, ScoreResult } from "./enums";

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
    date: Date;
    gamemode: Gamemode;
    accuracy: number;
    bpm: number;
    length: number;
    circleSize: number;
    approachRate: number;
    overallDifficulty: number;
    result: ScoreResult;
    performanceTotal: number;
    difficultyTotal: number;
    performanceCalculations: PerformanceCalculation[];
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
    lowestLength: number | null;
    highestLength: number | null;
}

export interface DifficultyCalculation {
    calculatorEngine: string;
    calculatorVersion: string;
    mods: Mods;
    difficultyValues: DifficultyValue[];
}

export interface DifficultyValue {
    name: string;
    value: number;
}

export interface PerformanceCalculation {
    calculatorEngine: string;
    calculatorVersion: string;
    performanceValues: PerformanceValue[];
    difficultyCalculation: DifficultyCalculation;
}

export interface PerformanceValue {
    name: string;
    value: number;
}
