import { Action } from "redux";
import { ThunkAction } from "redux-thunk";
import axios from "axios";
import Cookies from "js-cookie";

import { StoreState } from "../../reducers";
import { LeaderboardsDetailActionType, LeaderboardsDetailGetRequest, LeaderboardsDetailGetSuccess, LeaderboardsDetailGetFailure, LeaderboardsDetailDeleteRequest, LeaderboardsDetailDeleteSuccess, LeaderboardsDetailDeleteFailure, LeaderboardsDetailPostInviteRequest, LeaderboardsDetailPostInviteSuccess, LeaderboardsDetailPostInviteFailure } from "./types";
import { leaderboardFromJson, membershipFromJson } from "../../data/leaderboards/deserialisers";
import { Leaderboard, Membership } from "../../data/leaderboards/types";
import { addLeaderboards, addMemberships } from "../../data/leaderboards/actions";
import { OsuUser } from "../../data/profiles/types";
import { osuUserFromJson } from "../../data/profiles/deserialisers";
import { addOsuUsers } from "../../data/profiles/actions";

// Actions

export function leaderboardsDetailGetRequest(): LeaderboardsDetailGetRequest {
    return {
        type: LeaderboardsDetailActionType.GetRequest
    }
}

export function leaderboardsDetailGetSuccess(leaderboardId: number, rankingIds: number[]): LeaderboardsDetailGetSuccess {
    return {
        type: LeaderboardsDetailActionType.GetSuccess,
        leaderboardId,
        rankingIds
    }
}

export function leaderboardsDetailGetFailure(): LeaderboardsDetailGetFailure {
    return {
        type: LeaderboardsDetailActionType.GetFailure
    }
}

export function leaderboardsDetailDeleteRequest(): LeaderboardsDetailDeleteRequest {
    return {
        type: LeaderboardsDetailActionType.DeleteRequest
    }
}

export function leaderboardsDetailDeleteSuccess(leaderboardId: number): LeaderboardsDetailDeleteSuccess {
    return {
        type: LeaderboardsDetailActionType.DeleteSuccess,
        leaderboardId
    }
}

export function leaderboardsDetailDeleteFailure(): LeaderboardsDetailDeleteFailure {
    return {
        type: LeaderboardsDetailActionType.DeleteFailure
    }
}
export function leaderboardsDetailPostInviteRequest(): LeaderboardsDetailPostInviteRequest {
    return {
        type: LeaderboardsDetailActionType.PostInviteRequest
    }
}

export function leaderboardsDetailPostInviteSuccess(): LeaderboardsDetailPostInviteSuccess {
    return {
        type: LeaderboardsDetailActionType.PostInviteSuccess
    }
}

export function leaderboardsDetailPostInviteFailure(): LeaderboardsDetailPostInviteFailure {
    return {
        type: LeaderboardsDetailActionType.PostInviteFailure
    }
}

// Thunks

export function leaderboardsDetailGetThunk(leaderboardId: number): ThunkAction<void, StoreState, null, Action> {
    return async function(dispatch, getState) {
        dispatch(leaderboardsDetailGetRequest());

        try {
            const leaderboardResponse = await axios.get(`/api/leaderboards/leaderboards/${leaderboardId}`);
            const membersResponse = await axios.get(`/api/leaderboards/leaderboards/${leaderboardId}/members`);
            
            const leaderboard: Leaderboard = leaderboardFromJson(leaderboardResponse.data);
            const members: Membership[] = membersResponse.data.map((data: any) => membershipFromJson(data));
            const osuUsers: OsuUser[] = membersResponse.data.map((data: any) => osuUserFromJson(data["user"]));
    
            if (leaderboard.accessType !== 0) {
                const owner: OsuUser = osuUserFromJson(leaderboardResponse.data["owner"]);
                dispatch(addOsuUsers(owner));
            }

            dispatch(addLeaderboards(leaderboard));
            dispatch(addMemberships(...members));
            dispatch(addOsuUsers(...osuUsers));

            dispatch(leaderboardsDetailGetSuccess(leaderboard.id, members.map(m => m.id)));
        } catch (error) {
            console.log(error);
            dispatch(leaderboardsDetailGetFailure());
        }
    }
}

export function leaderboardsDetailDeleteThunk(leaderboardId: number): ThunkAction<void, StoreState, null, Action> {
    return async function(dispatch, getState) {
        dispatch(leaderboardsDetailDeleteRequest());

        try {
            await axios.delete(`/api/leaderboards/leaderboards/${leaderboardId}`, {
                headers: {
                    "X-CSRFToken": Cookies.get("csrftoken")
                }
            });

            // TODO: remove leaderboard from data. not necessary, but good practice

            dispatch(leaderboardsDetailDeleteSuccess(leaderboardId));
        } catch (error) {
            console.log(error);
            dispatch(leaderboardsDetailDeleteFailure());
        }
    }
}

export function leaderboardsDetailPostInviteThunk(leaderboardId: number, userId: number): ThunkAction<void, StoreState, null, Action> {
    return async function(dispatch, getState) {
        dispatch(leaderboardsDetailPostInviteRequest());

        try {
            await axios.post(`/api/leaderboards/leaderboards/${leaderboardId}/invites`, {
                "user_id": userId
            }, {
                headers: {
                    "X-CSRFToken": Cookies.get("csrftoken")
                }
            });

            dispatch(leaderboardsDetailPostInviteSuccess());
        } catch (error) {
            console.log(error);
            dispatch(leaderboardsDetailPostInviteFailure());
        }
    }
}
