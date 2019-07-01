import { Action } from "redux";

// State

export interface UsersState {
    currentUserStatsId: number | null;
    scoreIds: number[];
    isFetching: boolean;
}

// Actions

export enum UsersActionType {
    Request = "PROFILE_REQUEST",
    Success = "PROFILE_SUCCESS",
    Failure = "PROFILE_FAILURE"
}

export interface UsersRequest extends Action {
    type: UsersActionType.Request;
}

export interface UsersSuccess extends Action {
    type: UsersActionType.Success;
    userStatsId: number;
    scoreIds: number[];
}

export interface UsersFailure extends Action {
    type: UsersActionType.Failure;
}

export type UsersAction = UsersRequest | UsersSuccess | UsersFailure;
