import { Leaderboard, Membership, Invite } from "./types";
import { osuUserFromJson } from "../profiles/deserialisers";

export function leaderboardFromJson(leaderboardData: any): Leaderboard {
    return {
        id: leaderboardData["id"],
        gamemode: leaderboardData["gamemode"],
        accessType: leaderboardData["access_type"],
        name: leaderboardData["name"],
        description: leaderboardData["description"],
        iconUrl: leaderboardData["icon_url"],
        allowPastScores: leaderboardData["allow_past_scores"],
        allowedBeatmapStatus: leaderboardData["allowed_beatmap_status"],
        oldestBeatmapDate: leaderboardData["oldest_beatmap_date"] ? new Date(leaderboardData["oldest_beatmap_date"]) : null,
        newestBeatmapDate: leaderboardData["newest_beatmap_date"] ? new Date(leaderboardData["newest_beatmap_date"]) : null,
        oldestScoreDate: leaderboardData["oldest_score_date"] ? new Date(leaderboardData["oldest_score_date"]) : null,
        newestScoreDate: leaderboardData["newest_score_date"] ? new Date(leaderboardData["newest_score_date"]) : null,
        lowestAr: leaderboardData["lowest_ar"],
        highestAr: leaderboardData["highest_ar"],
        lowestOd: leaderboardData["lowest_od"],
        highestOd: leaderboardData["highest_od"],
        lowestCs: leaderboardData["lowest_cs"],
        highestCs: leaderboardData["highest_cs"],
        requiredMods: leaderboardData["required_mods"],
        disqualifiedMods: leaderboardData["disqualified_mods"],
        lowestAccuracy: leaderboardData["lowest_accuracy"],
        highestAccuracy: leaderboardData["highest_accuracy"],
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
