import { Leaderboard, Membership, Invite } from "./types";
import { osuUserFromJson, scoreFilterFromJson } from "../profiles/deserialisers";

export function leaderboardFromJson(leaderboardData: any): Leaderboard {
    return {
        id: leaderboardData["id"],
        gamemode: leaderboardData["gamemode"],
        accessType: leaderboardData["access_type"],
        name: leaderboardData["name"],
        description: leaderboardData["description"],
        iconUrl: leaderboardData["icon_url"],
        allowPastScores: leaderboardData["allow_past_scores"],
        scoreFilter: leaderboardData["score_filter"] === null ? null : typeof leaderboardData["score_filter"] === "object" ? scoreFilterFromJson(leaderboardData["score_filter"]) : null,
        scoreFilterId: leaderboardData["score_filter"] === null ? null : typeof leaderboardData["score_filter"] === "object" ? leaderboardData["score_filter"]["id"] : leaderboardData["score_filter"],
        owner: leaderboardData["owner"] === null ? null : typeof leaderboardData["owner"] === "object" ? osuUserFromJson(leaderboardData["owner"]) : null,
        ownerId: leaderboardData["owner"] === null ? null : typeof leaderboardData["owner"] === "object" ? leaderboardData["owner"]["id"] : leaderboardData["owner"],
        creationTime: new Date(leaderboardData["creation_time"])
    }
}

export function membershipFromJson(membershipData: any): Membership {
    return {
        id: membershipData["id"],
        pp: membershipData["pp"],
        leaderboard: typeof membershipData["leaderboard"] === "object" ? leaderboardFromJson(membershipData["leaderboard"]) : null,
        leaderboardId: typeof membershipData["leaderboard"] === "object" ? membershipData["leaderboard"]["id"] : membershipData["leaderboard"],
        osuUser: typeof membershipData["user"] === "object" ? osuUserFromJson(membershipData["user"]) : null,
        osuUserId: typeof membershipData["user"] === "object" ? membershipData["user"]["id"] : membershipData["user"],
        joinDate: new Date(membershipData["join_date"]),
        scoreCount: membershipData["score_count"]
    }
}

export function inviteFromJson(inviteData: any): Invite {
    return {
        id: inviteData["id"],
        message: inviteData["message"],
        leaderboard: typeof inviteData["leaderboard"] === "object" ? leaderboardFromJson(inviteData["leaderboard"]) : null,
        leaderboardId: typeof inviteData["leaderboard"] === "object" ? inviteData["leaderboard"]["id"] : inviteData["leaderboard"],
        osuUser: typeof inviteData["user"] === "object" ? osuUserFromJson(inviteData["user"]) : null,
        osuUserId: typeof inviteData["user"] === "object" ? inviteData["user"]["id"] : inviteData["user"],
        inviteDate: new Date(inviteData["invite_date"])
    }
}
