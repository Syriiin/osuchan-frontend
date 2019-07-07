import { Action } from "redux";
import { ThunkAction } from "redux-thunk";
import axios from "axios";

import { StoreState } from "../../reducers";
import { LeaderboardsBeatmapActionType, LeaderboardsBeatmapRequest, LeaderboardsBeatmapSuccess, LeaderboardsBeatmapFailure } from "./types";
import { OsuUser, Beatmap, Score, UserStats } from "../../data/profiles/types";
import { osuUserFromJson, beatmapFromJson, scoreFromJson, userStatsFromJson } from "../../data/profiles/deserialisers";
import { addOsuUsers, addBeatmaps, addUserStats, addScores } from "../../data/profiles/actions";

// Actions

export function leaderboardsBeatmapRequest(): LeaderboardsBeatmapRequest {
    return {
        type: LeaderboardsBeatmapActionType.Request
    }
}

export function leaderboardsBeatmapSuccess(leaderboardId: number, beatmapId: number, scoreIds: number[]): LeaderboardsBeatmapSuccess {
    return {
        type: LeaderboardsBeatmapActionType.Success,
        leaderboardId,
        beatmapId,
        scoreIds
    }
}

export function leaderboardsBeatmapFailure(): LeaderboardsBeatmapFailure {
    return {
        type: LeaderboardsBeatmapActionType.Failure
    }
}

// Thunks

export function leaderboardsBeatmapThunkFetch(leaderboardId: number, beatmapId: number): ThunkAction<void, StoreState, null, Action> {
    return async function(dispatch, getState) {
        dispatch(leaderboardsBeatmapRequest());

        try {
            const beatmapResponse = await axios.get(`/api/profiles/beatmaps/${beatmapId}`);
            const scoresResponse = await axios.get(`/api/leaderboards/scores`, {
                params: {
                    "leaderboard_id": leaderboardId,
                    "beatmap_id": beatmapId
                }
            });
            
            const beatmap: Beatmap = beatmapFromJson(beatmapResponse.data);
            const scores: Score[] = scoresResponse.data.map((data: any) => scoreFromJson(data));
            const userStats: UserStats[] = scoresResponse.data.map((data: any) => userStatsFromJson(data["user_stats"]));
            const osuUsers: OsuUser[] = scoresResponse.data.map((data: any) => osuUserFromJson(data["user_stats"]["user"]));

            dispatch(addBeatmaps(beatmap));
            dispatch(addScores(...scores));
            dispatch(addUserStats(...userStats));
            dispatch(addOsuUsers(...osuUsers));

            dispatch(leaderboardsBeatmapSuccess(leaderboardId, beatmap.id, scores.map(s => s.id)));
        } catch (error) {
            console.log(error);
            dispatch(leaderboardsBeatmapFailure());
        }
    }
}
