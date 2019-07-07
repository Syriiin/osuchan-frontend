import { Action } from "redux";

// State

export interface LeaderboardsBeatmapState {
    leaderboardId: number | null;
    beatmapId: number | null;
    scoreIds: number[];
    isFetching: boolean;
}

// Actions

export enum LeaderboardsBeatmapActionType {
    Request = "LEADERBOARDS_BEATMAP_REQUEST",
    Success = "LEADERBOARDS_BEATMAP_SUCCESS",
    Failure = "LEADERBOARDS_BEATMAP_FAILURE"
}

export interface LeaderboardsBeatmapRequest extends Action {
    type: LeaderboardsBeatmapActionType.Request;
}

export interface LeaderboardsBeatmapSuccess extends Action {
    type: LeaderboardsBeatmapActionType.Success;
    leaderboardId: number;
    beatmapId: number;
    scoreIds: number[];
}

export interface LeaderboardsBeatmapFailure extends Action {
    type: LeaderboardsBeatmapActionType.Failure;
}

export type LeaderboardsBeatmapAction = LeaderboardsBeatmapRequest | LeaderboardsBeatmapSuccess | LeaderboardsBeatmapFailure;
