import { Action } from "redux";
import { ThunkAction } from "redux-thunk";
import axios from "axios";

import { StoreState } from "../reducers";
import { OsuUser, UserStats, Beatmap, Score } from "../data/profiles/types";
import { addUserStats, addScores, addOsuUsers, addBeatmaps } from "../data/profiles/actions";
import { UsersActionType, UsersRequest, UsersSuccess, UsersFailure } from "./types";
import { osuUserFromJson, userStatsFromJson, beatmapFromJson, scoreFromJson } from "../data/profiles/deserialisers";

// Actions

export function usersRequest(): UsersRequest {
    return {
        type: UsersActionType.Request
    }
}

export function usersSuccess(userStatsId: number, scoreIds: number[]): UsersSuccess {
    return {
        type: UsersActionType.Success,
        userStatsId,
        scoreIds
    }
}

export function usersFailure(): UsersFailure {
    return {
        type: UsersActionType.Failure
    }
}

// Thunks

export function usersThunkFetch(userString: string, gamemode: number): ThunkAction<void, StoreState, null, Action> {
    return async function(dispatch, getState) {
        dispatch(usersRequest());

        try {
            // cant do in parallel just yet, as the users call updates the user stats and will change the scores
            const usersResponse = await axios.get(`/api/profiles/stats/${userString}/${gamemode}`, {
                params: {
                    "user_id_type": "username"
                }
            });
            const scoresResponse = await axios.get(`/api/profiles/scores`, {
                params: {
                    "user_id": usersResponse.data["user"]["id"],
                    "gamemode": gamemode
                }
            });
            
            const osuUser: OsuUser = osuUserFromJson(usersResponse.data["user"]);
            const userStats: UserStats = userStatsFromJson(usersResponse.data);
            const beatmaps: Beatmap[] = scoresResponse.data.map((scoreData: any) => beatmapFromJson(scoreData["beatmap"]));
            const scores: Score[] = scoresResponse.data.map((scoreData: any) => scoreFromJson(scoreData));

            dispatch(addOsuUsers(osuUser));
            dispatch(addUserStats(userStats));
            dispatch(addBeatmaps(...beatmaps));
            dispatch(addScores(...scores));

            dispatch(usersSuccess(userStats.id, scores.map(s => s.id)));
        } catch (error) {
            console.log(error);
            dispatch(usersFailure());
        }
    }
}
