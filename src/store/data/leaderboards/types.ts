import { Action } from "redux";

// Models

export interface Leaderboard {
    id: number;
    gamemode: number;
    accessType: number;
    name: string;
    description: string;
    iconUrl: string;
    allowPastScores: boolean | null;
    allowedBeatmapStatus: number;
    oldestBeatmapDate: Date | null;
    newestBeatmapDate: Date | null;
    lowestAr: number | null;
    highestAr: number | null;
    lowestOd: number | null;
    highestOd: number | null;
    lowestCs: number | null;
    highestCs: number | null;
    requiredMods: number;
    disqualifiedMods: number;
    lowestAccuracy: number | null;
    highestAccuracy: number | null;
    ownerId: number | null;
    creationTime: Date;
}

export interface Membership {
    id: number;
    pp: number;
    leaderboardId: number;
    osuUserId: number;
    joinDate: Date;
    scoreCount: number;
}

export interface Invite {
    id: number;
    message: string;
    leaderboardId: number;
    osuUserId: number;
    inviteDate: Date;
}

// State

export interface LeaderboardsDataState {
    leaderboards: { [id: number]: Leaderboard };
    memberships: { [id: number]: Membership };
    invites: { [id: number]: Invite };
}

// Actions

export enum LeaderboardsActionType {
    AddLeaderboards = "ADD_LEADERBOARDS",
    AddMemberships = "ADD_MEMBERSHIPS",
    AddInvites = "ADD_INVITES"
}

export interface LeaderboardsAddLeaderboards extends Action {
    type: LeaderboardsActionType.AddLeaderboards;
    leaderboards: Leaderboard[];
}

export interface LeaderboardsAddMemberships extends Action {
    type: LeaderboardsActionType.AddMemberships;
    memberships: Membership[];
}

export interface LeaderboardsAddInvites extends Action {
    type: LeaderboardsActionType.AddInvites;
    invites: Invite[];
}

export type LeaderboardsAction = LeaderboardsAddLeaderboards | LeaderboardsAddMemberships | LeaderboardsAddInvites;
