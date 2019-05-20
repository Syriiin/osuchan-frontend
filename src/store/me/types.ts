import { Action } from "redux";

// Models

export interface UserData {
    id: number;
    username: string;
    country: string;
    joinDate: Date;
}

// State

export interface MeState {
    userData: UserData | null;
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
    userData: UserData;
}

export interface MeFailure extends Action {
    type: MeActionType.Failure;
}

export type MeAction = MeRequest | MeSuccess | MeFailure;
