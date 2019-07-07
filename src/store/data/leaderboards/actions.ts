import { Leaderboard, Membership, LeaderboardsAddLeaderboards, LeaderboardsActionType, LeaderboardsAddMemberships, Invite, LeaderboardsAddInvites } from "./types";

// Actions

export function addLeaderboards(...leaderboards: Leaderboard[]): LeaderboardsAddLeaderboards {
    return {
        type: LeaderboardsActionType.AddLeaderboards,
        leaderboards
    }
}

export function addMemberships(...memberships: Membership[]): LeaderboardsAddMemberships {
    return {
        type: LeaderboardsActionType.AddMemberships,
        memberships
    }
}

export function addInvites(...invites: Invite[]): LeaderboardsAddInvites {
    return {
        type: LeaderboardsActionType.AddInvites,
        invites
    }
}
