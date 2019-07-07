import { Action } from "redux";
import { ThunkAction } from "redux-thunk";
import axios from "axios";
import Cookies from "js-cookie";

import { StoreState } from "../reducers";
import { OsuUser } from "../data/profiles/types";
import { addOsuUsers } from "../data/profiles/actions";
import { osuUserFromJson } from "../data/profiles/deserialisers";
import { MeActionType, MeGetRequest, MeGetSuccess, MeGetFailure, MeJoinLeaderboardPostRequest, MeJoinLeaderboardPostSuccess, MeJoinLeaderboardPostFailure, MeLeaveLeaderboardDeleteRequest, MeLeaveLeaderboardDeleteSuccess, MeLeaveLeaderboardDeleteFailure } from "./types";
import { Leaderboard, Invite } from "../data/leaderboards/types";
import { leaderboardFromJson, inviteFromJson } from "../data/leaderboards/deserialisers";
import { addLeaderboards, addInvites } from "../data/leaderboards/actions";
import { leaderboardsDetailGetThunk } from "../leaderboards/detail/actions";

// Actions

export function meGetRequest(): MeGetRequest {
    return {
        type: MeActionType.GetRequest
    }
}

export function meGetSuccess(osuUserId: number, leaderboardIds: number[], inviteIds: number[]): MeGetSuccess {
    return {
        type: MeActionType.GetSuccess,
        osuUserId,
        leaderboardIds,
        inviteIds
    }
}

export function meGetFailure(): MeGetFailure {
    return {
        type: MeActionType.GetFailure
    }
}

export function meJoinLeaderboardPostRequest(): MeJoinLeaderboardPostRequest {
    return {
        type: MeActionType.JoinLeaderboardPostRequest
    }
}

export function meJoinLeaderboardPostSuccess(leaderboardId: number): MeJoinLeaderboardPostSuccess {
    return {
        type: MeActionType.JoinLeaderboardPostSuccess,
        leaderboardId
    }
}

export function meJoinLeaderboardPostFailure(): MeJoinLeaderboardPostFailure {
    return {
        type: MeActionType.JoinLeaderboardPostFailure
    }
}

export function meLeaveLeaderboardDeleteRequest(): MeLeaveLeaderboardDeleteRequest {
    return {
        type: MeActionType.LeaveLeaderboardDeleteRequest
    }
}

export function meLeaveLeaderboardDeleteSuccess(leaderboardId: number): MeLeaveLeaderboardDeleteSuccess {
    return {
        type: MeActionType.LeaveLeaderboardDeleteSuccess,
        leaderboardId
    }
}

export function meLeaveLeaderboardDeleteFailure(): MeLeaveLeaderboardDeleteFailure {
    return {
        type: MeActionType.LeaveLeaderboardDeleteFailure
    }
}

// Thunks

export function meGetThunk(): ThunkAction<void, StoreState, null, Action> {
    return async function(dispatch, getState) {
        dispatch(meGetRequest());

        try {
            const meResponse = await axios.get("/osuauth/me");

            const osuUser: OsuUser = osuUserFromJson(meResponse.data);

            const leaderboardsResponse = await axios.get("/api/leaderboards/leaderboards", {
                params: {
                    "user_id": osuUser.id
                }
            });
            
            const leaderboards: Leaderboard[] = leaderboardsResponse.data.map((data: any) => leaderboardFromJson(data));

            const invitesResponse = await axios.get("/api/leaderboards/invites", {
                params: {
                    "user_id": osuUser.id
                }
            });

            const invites: Invite[] = invitesResponse.data.map((data: any) => inviteFromJson(data))
            const inviteLeaderboards: Leaderboard[] = invitesResponse.data.map((data: any) => leaderboardFromJson(data["leaderboard"]))

            dispatch(addOsuUsers(osuUser));
            dispatch(addLeaderboards(...leaderboards, ...inviteLeaderboards));
            dispatch(addInvites(...invites));

            dispatch(meGetSuccess(osuUser.id, leaderboards.map(l => l.id), invites.map(i => i.id)));
        } catch (error) {
            dispatch(meGetFailure());
        }
    }
}

export function meJoinLeaderboardPostThunk(leaderboardId: number): ThunkAction<void, StoreState, null, Action> {
    return async function(dispatch, getState) {
        dispatch(meJoinLeaderboardPostRequest());

        try {
            await axios.post("/api/leaderboards/members", {
                "leaderboard_id": leaderboardId
            }, {
                headers: {
                    "X-CSRFToken": Cookies.get("csrftoken")
                }
            });
            
            dispatch(leaderboardsDetailGetThunk(leaderboardId));
            dispatch(meJoinLeaderboardPostSuccess(leaderboardId));
        } catch (error) {
            dispatch(meJoinLeaderboardPostFailure());
        }
    }
}

export function meLeaveLeaderboardDeleteThunk(leaderboardId: number): ThunkAction<void, StoreState, null, Action> {
    return async function(dispatch, getState) {
        dispatch(meLeaveLeaderboardDeleteRequest());

        const { osuUserId } = getState().me;

        try {
            await axios.delete(`/api/leaderboards/members/${osuUserId}`, {
                params: {
                    "leaderboard_id": leaderboardId
                },
                headers: {
                    "X-CSRFToken": Cookies.get("csrftoken")
                }
            });

            dispatch(leaderboardsDetailGetThunk(leaderboardId));

            dispatch(meLeaveLeaderboardDeleteSuccess(leaderboardId));
        } catch (error) {
            dispatch(meLeaveLeaderboardDeleteFailure());
        }
    }
}
