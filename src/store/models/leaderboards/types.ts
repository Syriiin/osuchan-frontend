import { OsuUser, ScoreFilter } from "../profiles/types";
import { LeaderboardAccessType } from "./enums";
import { Gamemode } from "../common/enums";

export interface Leaderboard {
    id: number;
    gamemode: Gamemode;
    accessType: LeaderboardAccessType;
    name: string;
    description: string;
    iconUrl: string;
    allowPastScores: boolean | null;
    scoreFilter: ScoreFilter | null;
    scoreFilterId: number | null;
    owner: OsuUser | null;
    ownerId: number | null;
    creationTime: Date;
}

export interface Membership {
    id: number;
    pp: number;
    leaderboard: Leaderboard | null;
    leaderboardId: number;
    osuUser: OsuUser | null;
    osuUserId: number;
    joinDate: Date;
    scoreCount: number;
}

export interface Invite {
    id: number;
    message: string;
    leaderboard: Leaderboard | null;
    leaderboardId: number;
    osuUser: OsuUser | null;
    osuUserId: number;
    inviteDate: Date;
}
