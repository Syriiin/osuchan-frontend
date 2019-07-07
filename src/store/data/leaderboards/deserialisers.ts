import { Leaderboard, Membership, Invite } from "./types";

export function leaderboardFromJson(leaderboardData: any): Leaderboard {
    return {
        id: leaderboardData["id"],
        gamemode: leaderboardData["gamemode"],
        accessType: leaderboardData["access_type"],
        name: leaderboardData["name"],
        description: leaderboardData["description"],
        allowPastScores: leaderboardData["allow_past_scores"],
        allowedBeatmapStatus: leaderboardData["allowed_beatmap_status"],
        oldestBeatmapDate: leaderboardData["oldest_beatmap_date"] ? new Date(leaderboardData["oldest_beatmap_date"]) : null,
        newestBeatmapDate: leaderboardData["newest_beatmap_date"] ? new Date(leaderboardData["newest_beatmap_date"]) : null,
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
        ownerId: leaderboardData["owner"] ? leaderboardData["owner"]["id"] : null,
        creationTime: new Date(leaderboardData["creation_time"]),
        memberCount: leaderboardData["member_count"]
    }
}

export function membershipFromJson(membershipData: any): Membership {
    return {
        id: membershipData["id"],
        pp: membershipData["pp"],
        leaderboardId: membershipData["leaderboard"],
        osuUserId: membershipData["user"]["id"],
        joinDate: new Date(membershipData["join_date"]),
        scoreCount: membershipData["score_count"]
    }
}

export function inviteFromJson(inviteData: any): Invite {
    return {
        id: inviteData["id"],
        message: inviteData["message"],
        leaderboardId: inviteData["leaderboard"]["id"],
        osuUserId: inviteData["user"]["id"],
        inviteDate: new Date(inviteData["invite_date"])
    }
}
