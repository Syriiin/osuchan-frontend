import { Action } from "redux";
import { ThunkAction } from "redux-thunk";
import axios from "axios";

import { StoreState } from "../../reducers";
import { LeaderboardsUserActionType, LeaderboardsUserRequest, LeaderboardsUserSuccess, LeaderboardsUserFailure } from "./types";
import { OsuUser, Score, Beatmap } from "../../data/profiles/types";
import { osuUserFromJson, scoreFromJson, beatmapFromJson } from "../../data/profiles/deserialisers";
import { addOsuUsers, addScores, addBeatmaps } from "../../data/profiles/actions";
import { Membership } from "../../data/leaderboards/types";
import { membershipFromJson } from "../../data/leaderboards/deserialisers";
import { addMemberships } from "../../data/leaderboards/actions";

// Actions

export function leaderboardsUserRequest(): LeaderboardsUserRequest {
    return {
        type: LeaderboardsUserActionType.Request
    }
}

export function leaderboardsUserSuccess(leaderboardId: number, memberId: number, scoreIds: number[]): LeaderboardsUserSuccess {
    return {
        type: LeaderboardsUserActionType.Success,
        leaderboardId,
        membershipId: memberId,
        scoreIds
    }
}

export function leaderboardsUserFailure(): LeaderboardsUserFailure {
    return {
        type: LeaderboardsUserActionType.Failure
    }
}

// Thunks

export function leaderboardsUserThunkFetch(leaderboardId: number, userId: number): ThunkAction<void, StoreState, null, Action> {
    return async function(dispatch, getState) {
        dispatch(leaderboardsUserRequest());

        try {
            const membershipResponse = await axios.get(`/api/leaderboards/leaderboards/${leaderboardId}/members/${userId}`);
            const membership: Membership = membershipFromJson(membershipResponse.data);
            const osuUser: OsuUser = osuUserFromJson(membershipResponse.data["user"]);
            
            const scoresResponse = await axios.get(`/api/leaderboards/leaderboards/${leaderboardId}/members/${userId}/scores`);
            const scores: Score[] = scoresResponse.data.map((data: any) => scoreFromJson(data));
            const beatmaps: Beatmap[] = scoresResponse.data.map((data: any) => beatmapFromJson(data["beatmap"]));

            dispatch(addMemberships(membership));
            dispatch(addOsuUsers(osuUser));
            dispatch(addScores(...scores));
            dispatch(addBeatmaps(...beatmaps));

            dispatch(leaderboardsUserSuccess(leaderboardId, membership.id, scores.map(s => s.id)));
        } catch (error) {
            console.log(error);
            dispatch(leaderboardsUserFailure());
        }
    }
}
