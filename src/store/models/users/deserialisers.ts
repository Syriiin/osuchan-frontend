import { User, ScoreFilterPreset } from "./types";
import {
    osuUserFromJson,
    scoreFilterFromJson,
} from "../profiles/deserialisers";

export function userFromJson(data: any): User {
    return {
        id: data["id"],
        dateJoined: new Date(data["date_joined"]),
        isBetaTester: data["is_beta_tester"],
        osuUser:
            typeof data["osu_user"] === "object"
                ? osuUserFromJson(data["osu_user"])
                : null,
        osuUserId:
            typeof data["osu_user"] === "object"
                ? data["osu_user"]["id"]
                : data["osu_user"],
    };
}

export function scoreFilterPresetFromJson(data: any): ScoreFilterPreset {
    return {
        id: data["id"],
        name: data["name"],
        scoreFilter:
            typeof data["score_filter"] === "object"
                ? scoreFilterFromJson(data["score_filter"])
                : null,
        scoreFilterId:
            typeof data["score_filter"] === "object"
                ? data["score_filter"]["id"]
                : data["osu_user"],
        user:
            typeof data["user"] === "object"
                ? userFromJson(data["user"])
                : null,
        userId:
            typeof data["user"] === "object"
                ? data["user"]["id"]
                : data["user"],
    };
}
