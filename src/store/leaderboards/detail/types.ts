import { Action } from "redux";

// State

export interface LeaderboardsDetailState {
    leaderboardId: number | null;
    rankingIds: number[];
    topScoreIds: number[];
    isFetching: boolean;
    isDeleting: boolean;
    isPostingInvite: boolean;
}

// Actions

export enum LeaderboardsDetailActionType {
    GetRequest = "LEADERBOARDS_DETAIL_GET_REQUEST",
    GetSuccess = "LEADERBOARDS_DETAIL_GET_SUCCESS",
    GetFailure = "LEADERBOARDS_DETAIL_GET_FAILURE",
    DeleteRequest = "LEADERBOARDS_DETAIL_DELETE_REQUEST",
    DeleteSuccess = "LEADERBOARDS_DETAIL_DELETE_SUCCESS",
    DeleteFailure = "LEADERBOARDS_DETAIL_DELETE_FAILURE",
    PostInviteRequest = "LEADERBOARDS_DETAIL_POST_INVITE_REQUEST",
    PostInviteSuccess = "LEADERBOARDS_DETAIL_POST_INVITE_SUCCESS",
    PostInviteFailure = "LEADERBOARDS_DETAIL_POST_INVITE_FAILURE"
}

export interface LeaderboardsDetailGetRequest extends Action {
    type: LeaderboardsDetailActionType.GetRequest;
}

export interface LeaderboardsDetailGetSuccess extends Action {
    type: LeaderboardsDetailActionType.GetSuccess;
    leaderboardId: number;
    rankingIds: number[];
    topScoreIds: number[];
}

export interface LeaderboardsDetailGetFailure extends Action {
    type: LeaderboardsDetailActionType.GetFailure;
}

export interface LeaderboardsDetailDeleteRequest extends Action {
    type: LeaderboardsDetailActionType.DeleteRequest;
}

export interface LeaderboardsDetailDeleteSuccess extends Action {
    type: LeaderboardsDetailActionType.DeleteSuccess;
    leaderboardId: number;
}

export interface LeaderboardsDetailDeleteFailure extends Action {
    type: LeaderboardsDetailActionType.DeleteFailure;
}

export interface LeaderboardsDetailPostInviteRequest extends Action {
    type: LeaderboardsDetailActionType.PostInviteRequest;
}

export interface LeaderboardsDetailPostInviteSuccess extends Action {
    type: LeaderboardsDetailActionType.PostInviteSuccess;
}

export interface LeaderboardsDetailPostInviteFailure extends Action {
    type: LeaderboardsDetailActionType.PostInviteFailure;
}

export type LeaderboardsDetailAction = (
    LeaderboardsDetailGetRequest | LeaderboardsDetailGetSuccess | LeaderboardsDetailGetFailure | 
    LeaderboardsDetailDeleteRequest | LeaderboardsDetailDeleteSuccess | LeaderboardsDetailDeleteFailure |
    LeaderboardsDetailPostInviteRequest | LeaderboardsDetailPostInviteSuccess | LeaderboardsDetailPostInviteFailure
);
