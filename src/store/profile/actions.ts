import { ThunkAction } from "redux-thunk";
import axios from "axios";

import { ProfileActionType, ProfileRequest, ProfileSuccess, ProfileFailure, ProfileState, ProfileAction, ProfileData, Score } from "./types";

// Actions

export function profileRequest(): ProfileRequest {
    return {
        type: ProfileActionType.Request
    }
}

export function profileSuccess(profileData: ProfileData, scores: Score[]): ProfileSuccess {
    return {
        type: ProfileActionType.Success,
        profileData,
        scores
    }
}

export function profileFailure(): ProfileFailure {
    return {
        type: ProfileActionType.Failure
    }
}

// Thunks

export function profileThunkFetch(userString: string, gamemode: number): ThunkAction<void, ProfileState, null, ProfileAction> {
    return async function(dispatch, getState) {
        dispatch(profileRequest());

        try {
            // cant do in parallel just yet, as the profile call updates the user stats and will change the scores
            const profileResponse = await axios.get(`/api/profiles/stats/${userString}/${gamemode}`, {
                params: {
                    "user_id_type": "username"
                }
            });
            const scoresResponse = await axios.get(`/api/profiles/scores`, {
                params: {
                    "user_id": profileResponse.data["user"]["id"],
                    "gamemode": gamemode
                }
            });
            
            const profileData: ProfileData = {
                userData: {
                    id: profileResponse.data["user"]["id"],
                    username: profileResponse.data["user"]["username"],
                    country: profileResponse.data["user"]["country"],
                    joinDate: new Date(profileResponse.data["user"]["join_date"])
                },
                gamemode: profileResponse.data["gamemode"],
                playcount: profileResponse.data["playcount"],
                playtime: profileResponse.data["playtime"],
                level: profileResponse.data["level"],
                rank: profileResponse.data["rank"],
                countryRank: profileResponse.data["country_rank"],
                pp: profileResponse.data["pp"],
                accuracy: profileResponse.data["accuracy"],
                nochokePp: profileResponse.data["nochoke_pp"],
                scoreStyleAccuracy: profileResponse.data["score_style_accuracy"],
                scoreStyleBpm: profileResponse.data["score_style_bpm"],
                scoreStyleCs: profileResponse.data["score_style_cs"],
                scoreStyleAr: profileResponse.data["score_style_ar"],
                scoreStyleOd: profileResponse.data["score_style_od"],
                scoreStyleLength: profileResponse.data["score_style_length"]
            }

            const scores: Score[] = scoresResponse.data.map((score: any): Score => ({
                beatmap: {
                    id: score["beatmap"]["id"],
                    setId: score["beatmap"]["setId"],
                    artist: score["beatmap"]["artist"],
                    title: score["beatmap"]["title"],
                    difficultyName: score["beatmap"]["difficulty_name"],
                    gamemode: score["beatmap"]["gamemode"],
                    status: score["beatmap"]["status"],
                    creatorName: score["beatmap"]["creator_name"],
                    createId: score["beatmap"]["create_id"],
                    bpm: score["beatmap"]["bpm"],
                    drainTime: score["beatmap"]["drain_time"],
                    totalTime: score["beatmap"]["total_time"],
                    maxCombo: score["beatmap"]["max_combo"],
                    circleSize: score["beatmap"]["circle_size"],
                    overallDifficulty: score["beatmap"]["overall_difficulty"],
                    approachRate: score["beatmap"]["approach_rate"],
                    healthDrain: score["beatmap"]["health_drain"],
                    starRating: score["beatmap"]["star_rating"],
                    lastUpdated: new Date(score["beatmap"]["last_updated"])
                },
                score: score["score"],
                count300: score["count_300"],
                count100: score["count_100"],
                count50: score["count_50"],
                countMiss: score["count_miss"],
                countGeki: score["count_geki"],
                countKatu: score["count_katu"],
                bestCombo: score["best_combo"],
                mods: score["mods"],
                rank: score["rank"],
                pp: score["pp"],
                date: new Date(score["date"]),
                accuracy: score["accuracy"],
                bpm: score["bpm"],
                length: score["length"],
                circleSize: score["circle_size"],
                approachRate: score["approach_rate"],
                overallDifficulty: score["overall_difficulty"],
                nochokePp: score["nochoke_pp"],
                starRating: score["star_rating"],
                result: score["result"]
            }))

            dispatch(profileSuccess(profileData, scores));
        } catch (error) {
            console.log(error);
            dispatch(profileFailure());
        }
    }
}
