import { Leaderboard, Membership, Invite } from "./types";
import {
    osuUserFromJson,
    scoreFilterFromJson,
} from "../profiles/deserialisers";

export function leaderboardFromJson(data: any): Leaderboard {
    return {
        id: data["id"],
        gamemode: data["gamemode"],
        scoreSet: data["score_set"],
        accessType: data["access_type"],
        name: data["name"],
        description: data["description"],
        iconUrl: data["icon_url"],
        allowPastScores: data["allow_past_scores"],
        memberCount: data["member_count"],
        archived: data["archived"],
        scoreFilter:
            data["score_filter"] === null
                ? null
                : typeof data["score_filter"] === "object"
                ? scoreFilterFromJson(data["score_filter"])
                : null,
        scoreFilterId:
            data["score_filter"] === null
                ? null
                : typeof data["score_filter"] === "object"
                ? data["score_filter"]["id"]
                : data["score_filter"],
        owner:
            data["owner"] === null
                ? null
                : typeof data["owner"] === "object"
                ? osuUserFromJson(data["owner"])
                : null,
        ownerId:
            data["owner"] === null
                ? null
                : typeof data["owner"] === "object"
                ? data["owner"]["id"]
                : data["owner"],
        creationTime: new Date(data["creation_time"]),
    };
}

export function membershipFromJson(data: any): Membership {
    return {
        id: data["id"],
        pp: data["pp"],
        scoreCount: data["score_count"],
        rank: data["rank"],
        leaderboard:
            typeof data["leaderboard"] === "object"
                ? leaderboardFromJson(data["leaderboard"])
                : null,
        leaderboardId:
            typeof data["leaderboard"] === "object"
                ? data["leaderboard"]["id"]
                : data["leaderboard"],
        osuUser:
            typeof data["user"] === "object"
                ? osuUserFromJson(data["user"])
                : null,
        osuUserId:
            typeof data["user"] === "object"
                ? data["user"]["id"]
                : data["user"],
        joinDate: new Date(data["join_date"]),
    };
}

export function inviteFromJson(data: any): Invite {
    return {
        id: data["id"],
        message: data["message"],
        leaderboard:
            typeof data["leaderboard"] === "object"
                ? leaderboardFromJson(data["leaderboard"])
                : null,
        leaderboardId:
            typeof data["leaderboard"] === "object"
                ? data["leaderboard"]["id"]
                : data["leaderboard"],
        osuUser:
            typeof data["user"] === "object"
                ? osuUserFromJson(data["user"])
                : null,
        osuUserId:
            typeof data["user"] === "object"
                ? data["user"]["id"]
                : data["user"],
        inviteDate: new Date(data["invite_date"]),
    };
}
