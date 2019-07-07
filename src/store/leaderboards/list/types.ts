import { Action } from "redux";

// State

export interface LeaderboardsListState {
    leaderboardIds: number[];
    isFetching: boolean;
    isPosting: boolean;
}

// Actions

export enum LeaderboardsListActionType {
    GetRequest = "LEADERBOARDS_LIST_GET_REQUEST",
    GetSuccess = "LEADERBOARDS_LIST_GET_SUCCESS",
    GetFailure = "LEADERBOARDS_LIST_GET_FAILURE",
    PostRequest = "LEADERBOARDS_LIST_POST_REQUEST",
    PostSuccess = "LEADERBOARDS_LIST_POST_SUCCESS",
    PostFailure = "LEADERBOARDS_LIST_POST_FAILURE"
}

export interface LeaderboardsListGetRequest extends Action {
    type: LeaderboardsListActionType.GetRequest;
}

export interface LeaderboardsListGetSuccess extends Action {
    type: LeaderboardsListActionType.GetSuccess;
    leaderboardIds: number[];
}

export interface LeaderboardsListGetFailure extends Action {
    type: LeaderboardsListActionType.GetFailure;
}

export interface LeaderboardsListPostRequest extends Action {
    type: LeaderboardsListActionType.PostRequest;
}

export interface LeaderboardsListPostSuccess extends Action {
    type: LeaderboardsListActionType.PostSuccess;
    leaderboardId: number;
}

export interface LeaderboardsListPostFailure extends Action {
    type: LeaderboardsListActionType.PostFailure;
}

export type LeaderboardsListAction = (
    LeaderboardsListGetRequest | LeaderboardsListGetSuccess | LeaderboardsListGetFailure | 
    LeaderboardsListPostRequest | LeaderboardsListPostSuccess | LeaderboardsListPostFailure
);
