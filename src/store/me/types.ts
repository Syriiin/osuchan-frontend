import { Action } from "redux";

// State

export interface MeState {
    osuUserId: number | null;
    isFetching: boolean;
}

// Actions

export enum MeActionType {
    Request = "ME_REQUEST",
    Success = "ME_SUCCESS",
    Failure = "ME_FAILURE"
}

export interface MeRequest extends Action {
    type: MeActionType.Request;
}

export interface MeSuccess extends Action {
    type: MeActionType.Success;
    osuUserId: number;
}

export interface MeFailure extends Action {
    type: MeActionType.Failure;
}

export type MeAction = MeRequest | MeSuccess | MeFailure;
