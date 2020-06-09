import { User, ScoreFilterPreset } from "./types";
import { osuUserFromJson, scoreFilterFromJson } from "../profiles/deserialisers";

export function userFromJson(userData: any): User {
    return {
        id: userData["id"],
        dateJoined: new Date(userData["date_joined"]),
        isBetaTester: userData["is_beta_tester"],
        osuUser: typeof userData["osu_user"] === "object" ? osuUserFromJson(userData["osu_user"]) : null,
        osuUserId: typeof userData["osu_user"] === "object" ? userData["osu_user"]["id"] : userData["osu_user"]
    }
}

export function scoreFilterPresetFromJson(scoreFilterPresetData: any): ScoreFilterPreset {
    return {
        id: scoreFilterPresetData["id"],
        name: scoreFilterPresetData["name"],
        scoreFilter: typeof scoreFilterPresetData["score_filter"] === "object" ? scoreFilterFromJson(scoreFilterPresetData["score_filter"]) : null,
        scoreFilterId: typeof scoreFilterPresetData["score_filter"] === "object" ? scoreFilterPresetData["score_filter"]["id"] : scoreFilterPresetData["osu_user"],
        user: typeof scoreFilterPresetData["user"] === "object" ? userFromJson(scoreFilterPresetData["user"]) : null,
        userId: typeof scoreFilterPresetData["user"] === "object" ? scoreFilterPresetData["user"]["id"] : scoreFilterPresetData["user"]
    }
}
