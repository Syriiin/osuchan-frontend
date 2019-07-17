import { Action } from "redux";

// State

export interface MeState {
    osuUserId: number | null;
    leaderboardIds: number[];
    inviteIds: number[];
    isFetching: boolean;
    isPosting: boolean;
    isPostingScore: boolean;
    isDeleting: boolean;
}

// Actions

export enum MeActionType {
    GetRequest = "ME_GET_REQUEST",
    GetSuccess = "ME_GET_SUCCESS",
    GetFailure = "ME_GET_FAILURE",
    JoinLeaderboardPostRequest = "ME_JOIN_LEADERBOARD_POST_REQUEST",
    JoinLeaderboardPostSuccess = "ME_JOIN_LEADERBOARD_POST_SUCCESS",
    JoinLeaderboardPostFailure = "ME_JOIN_LEADERBOARD_POST_FAILURE",
    ScorePostRequest = "ME_SCORE_POST_REQUEST",
    ScorePostSuccess = "ME_SCORE_POST_SUCCESS",
    ScorePostFailure = "ME_SCORE_POST_FAILURE",
    LeaveLeaderboardDeleteRequest = "ME_LEAVE_LEADERBOARD_DELETE_REQUEST",
    LeaveLeaderboardDeleteSuccess = "ME_LEAVE_LEADERBOARD_DELETE_SUCCESS",
    LeaveLeaderboardDeleteFailure = "ME_LEAVE_LEADERBOARD_DELETE_FAILURE"
}

export interface MeGetRequest extends Action {
    type: MeActionType.GetRequest;
}

export interface MeGetSuccess extends Action {
    type: MeActionType.GetSuccess;
    osuUserId: number;
    leaderboardIds: number[];
    inviteIds: number[];
}

export interface MeGetFailure extends Action {
    type: MeActionType.GetFailure;
}

export interface MeJoinLeaderboardPostRequest extends Action {
    type: MeActionType.JoinLeaderboardPostRequest;
}

export interface MeJoinLeaderboardPostSuccess extends Action {
    type: MeActionType.JoinLeaderboardPostSuccess;
    leaderboardId: number;
}

export interface MeJoinLeaderboardPostFailure extends Action {
    type: MeActionType.JoinLeaderboardPostFailure;
}

export interface MeScorePostRequest extends Action {
    type: MeActionType.ScorePostRequest;
}

export interface MeScorePostSuccess extends Action {
    type: MeActionType.ScorePostSuccess;
}

export interface MeScorePostFailure extends Action {
    type: MeActionType.ScorePostFailure;
}

export interface MeLeaveLeaderboardDeleteRequest extends Action {
    type: MeActionType.LeaveLeaderboardDeleteRequest;
}

export interface MeLeaveLeaderboardDeleteSuccess extends Action {
    type: MeActionType.LeaveLeaderboardDeleteSuccess;
    leaderboardId: number;
}

export interface MeLeaveLeaderboardDeleteFailure extends Action {
    type: MeActionType.LeaveLeaderboardDeleteFailure;
}

export type MeAction = (
    MeGetRequest | MeGetSuccess | MeGetFailure |
    MeJoinLeaderboardPostRequest | MeJoinLeaderboardPostSuccess | MeJoinLeaderboardPostFailure |
    MeScorePostRequest | MeScorePostSuccess | MeScorePostFailure |
    MeLeaveLeaderboardDeleteRequest | MeLeaveLeaderboardDeleteSuccess | MeLeaveLeaderboardDeleteFailure
);
