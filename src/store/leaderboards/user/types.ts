import { Action } from "redux";

// State

export interface LeaderboardsUserState {
    leaderboardId: number | null;
    membershipId: number | null;
    scoreIds: number[];
    isFetching: boolean;
}

// Actions

export enum LeaderboardsUserActionType {
    Request = "LEADERBOARDS_MEMBER_REQUEST",
    Success = "LEADERBOARDS_MEMBER_SUCCESS",
    Failure = "LEADERBOARDS_MEMBER_FAILURE"
}

export interface LeaderboardsUserRequest extends Action {
    type: LeaderboardsUserActionType.Request;
}

export interface LeaderboardsUserSuccess extends Action {
    type: LeaderboardsUserActionType.Success;
    leaderboardId: number;
    membershipId: number;
    scoreIds: number[];
}

export interface LeaderboardsUserFailure extends Action {
    type: LeaderboardsUserActionType.Failure;
}

export type LeaderboardsUserAction = LeaderboardsUserRequest | LeaderboardsUserSuccess | LeaderboardsUserFailure;
