import { Action } from "redux";

import { UserData } from "../me/types";

// Models

export interface ProfileData {
    userData: UserData;
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
    beatmap: Beatmap;
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

export interface ProfileState {
    profileData: ProfileData | null;
    scores: Score[];
    isFetching: boolean;
}

// Actions

export enum ProfileActionType {
    Request = "PROFILE_REQUEST",
    Success = "PROFILE_SUCCESS",
    Failure = "PROFILE_FAILURE"
}

export interface ProfileRequest extends Action {
    type: ProfileActionType.Request;
}

export interface ProfileSuccess extends Action {
    type: ProfileActionType.Success;
    profileData: ProfileData;
    scores: Score[];
}

export interface ProfileFailure extends Action {
    type: ProfileActionType.Failure;
}

export type ProfileAction = ProfileRequest | ProfileSuccess | ProfileFailure;
