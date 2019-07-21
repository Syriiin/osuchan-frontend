import { Action } from "redux";
import { ThunkAction } from "redux-thunk";
import axios from "axios";
import Cookies from "js-cookie";

import history from "../../../history";

import { StoreState } from "../../reducers";
import { LeaderboardsListActionType, LeaderboardsListGetRequest, LeaderboardsListGetSuccess, LeaderboardsListGetFailure, LeaderboardsListPostRequest, LeaderboardsListPostSuccess, LeaderboardsListPostFailure } from "./types";
import { leaderboardFromJson } from "../../data/leaderboards/deserialisers";
import { Leaderboard } from "../../data/leaderboards/types";
import { OsuUser } from "../../data/profiles/types";
import { osuUserFromJson } from "../../data/profiles/deserialisers";
import { addOsuUsers } from "../../data/profiles/actions";
import { addLeaderboards } from "../../data/leaderboards/actions";

// Actions

export function leaderboardsListGetRequest(): LeaderboardsListGetRequest {
    return {
        type: LeaderboardsListActionType.GetRequest
    }
}

export function leaderboardsListGetSuccess(leaderboardIds: number[]): LeaderboardsListGetSuccess {
    return {
        type: LeaderboardsListActionType.GetSuccess,
        leaderboardIds
    }
}

export function leaderboardsListGetFailure(): LeaderboardsListGetFailure {
    return {
        type: LeaderboardsListActionType.GetFailure
    }
}

export function leaderboardsListPostRequest(): LeaderboardsListPostRequest {
    return {
        type: LeaderboardsListActionType.PostRequest
    }
}

export function leaderboardsListPostSuccess(leaderboardId: number): LeaderboardsListPostSuccess {
    return {
        type: LeaderboardsListActionType.PostSuccess,
        leaderboardId
    }
}

export function leaderboardsListPostFailure(): LeaderboardsListPostFailure {
    return {
        type: LeaderboardsListActionType.PostFailure
    }
}

// Thunks

export function leaderboardsListGetThunk(): ThunkAction<void, StoreState, null, Action> {
    return async function(dispatch, getState) {
        dispatch(leaderboardsListGetRequest());

        try {
            const leaderboardsResponse = await axios.get(`/api/leaderboards/leaderboards`);
            const leaderboards: Leaderboard[] = leaderboardsResponse.data.map((data: any) => leaderboardFromJson(data));
            const owners: OsuUser[] = leaderboardsResponse.data.filter((l: any) => l["owner"]).map((data: any) => osuUserFromJson(data["owner"]));

            dispatch(addOsuUsers(...owners));
            dispatch(addLeaderboards(...leaderboards));

            dispatch(leaderboardsListGetSuccess(leaderboards.map(l => l.id)));
        } catch (error) {
            console.log(error);
            dispatch(leaderboardsListGetFailure());
        }
    }
}

export function leaderboardsListPostThunk(
    gamemode: number,
    accessType: number,
    name: string,
    description: string,
    allowPastScores: boolean | null,
    allowedBeatmapStatus: number,
    oldestBeatmapDate: Date | null,
    newestBeatmapDate: Date | null,
    oldestScoreDate: Date | null,
    newestScoreDate: Date | null,
    lowestAr: number | null,
    highestAr: number | null,
    lowestOd: number | null,
    highestOd: number | null,
    lowestCs: number | null,
    highestCs: number | null,
    requiredMods: number,
    disqualifiedMods: number,
    lowestAccuracy: number | null,
    highestAccuracy: number | null
): ThunkAction<void, StoreState, null, Action> {
    return async function(dispatch, getState) {
        dispatch(leaderboardsListPostRequest());

        try {
            const leaderboardResponse = await axios.post(`/api/leaderboards/leaderboards`, {
                "gamemode": gamemode,
                "access_type": accessType,
                "name": name,
                "description": description,
                "allow_past_scores": allowPastScores,
                "allowed_beatmap_status": allowedBeatmapStatus,
                "oldest_beatmap_date": oldestBeatmapDate,
                "newest_beatmap_date": newestBeatmapDate,
                "oldest_score_date": oldestScoreDate,
                "newest_score_date": newestScoreDate,
                "lowest_ar": lowestAr,
                "highest_ar": highestAr,
                "lowest_od": lowestOd,
                "highest_od": highestOd,
                "lowest_cs": lowestCs,
                "highest_cs": highestCs,
                "required_mods": requiredMods,
                "disqualified_mods": disqualifiedMods,
                "lowest_accuracy": lowestAccuracy,
                "highest_accuracy": highestAccuracy
            }, {
                headers: {
                    "X-CSRFToken": Cookies.get("csrftoken")
                }
            });
            const leaderboard: Leaderboard = leaderboardFromJson(leaderboardResponse.data);
            const owner: OsuUser = osuUserFromJson(leaderboardResponse.data["owner"]);

            dispatch(addOsuUsers(owner));
            dispatch(addLeaderboards(leaderboard));

            dispatch(leaderboardsListPostSuccess(leaderboard.id));

            // Navigate to leaderboard page after creation
            history.push(`/leaderboards/${leaderboard.id}`);
        } catch (error) {
            console.log(error);
            dispatch(leaderboardsListPostFailure());
        }
    }
}
