import { Action } from "redux";
import { ThunkAction } from "redux-thunk";
import axios from "axios";

import { StoreState } from "../reducers";
import { OsuUser, UserStats, Beatmap, Score } from "../data/profiles/types";
import { addUserStats, addScores, addOsuUsers, addBeatmaps } from "../data/profiles/actions";
import { UsersActionType, UsersRequest, UsersSuccess, UsersFailure } from "./types";
import { osuUserFromJson, userStatsFromJson, beatmapFromJson, scoreFromJson } from "../data/profiles/deserialisers";
import { Leaderboard } from "../data/leaderboards/types";
import { leaderboardFromJson } from "../data/leaderboards/deserialisers";
import { addLeaderboards } from "../data/leaderboards/actions";

// Actions

export function usersRequest(): UsersRequest {
    return {
        type: UsersActionType.Request
    }
}

export function usersSuccess(userStatsId: number, scoreIds: number[], leaderboardIds: number[]): UsersSuccess {
    return {
        type: UsersActionType.Success,
        userStatsId,
        scoreIds,
        leaderboardIds
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
            const usersResponse = await axios.get(`/api/profiles/users/${userString}/${gamemode}`, {
                params: {
                    "user_id_type": "username"
                }
            });
            const osuUser: OsuUser = osuUserFromJson(usersResponse.data["user"]);
            const userStats: UserStats = userStatsFromJson(usersResponse.data);

            const scoresResponse = await axios.get(`/api/profiles/users/${osuUser.id}/${gamemode}/scores`);
            const beatmaps: Beatmap[] = scoresResponse.data.map((data: any) => beatmapFromJson(data["beatmap"]));
            const scores: Score[] = scoresResponse.data.map((data: any) => scoreFromJson(data));
            
            const leaderboardsResponse = await axios.get(`/api/leaderboards/leaderboards`, {
                params: {
                    "user_id": usersResponse.data["user"]["id"],
                    "gamemode": gamemode
                }
            });
            const leaderboards: Leaderboard[] = leaderboardsResponse.data.map((data: any) => leaderboardFromJson(data));
            const owners: OsuUser[] = leaderboardsResponse.data.filter((l: any) => l["owner"]).map((data: any) => osuUserFromJson(data["owner"]));

            dispatch(addOsuUsers(osuUser, ...owners));
            dispatch(addUserStats(userStats));
            dispatch(addBeatmaps(...beatmaps));
            dispatch(addScores(...scores));
            dispatch(addLeaderboards(...leaderboards));

            dispatch(usersSuccess(userStats.id, scores.map(s => s.id), leaderboards.map(l => l.id)));
        } catch (error) {
            console.log(error);
            dispatch(usersFailure());
        }
    }
}
