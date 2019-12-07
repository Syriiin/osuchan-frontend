import { OsuUser } from "../profiles/types";
import { AllowedBeatmapStatus, LeaderboardAccessType } from "./enums";
import { Gamemode, Mods } from "../common/enums";

export interface Leaderboard {
    id: number;
    gamemode: Gamemode;
    accessType: LeaderboardAccessType;
    name: string;
    description: string;
    iconUrl: string;
    allowPastScores: boolean | null;
    allowedBeatmapStatus: AllowedBeatmapStatus;
    oldestBeatmapDate: Date | null;
    newestBeatmapDate: Date | null;
    oldestScoreDate: Date | null;
    newestScoreDate: Date | null;
    lowestAr: number | null;
    highestAr: number | null;
    lowestOd: number | null;
    highestOd: number | null;
    lowestCs: number | null;
    highestCs: number | null;
    requiredMods: Mods;
    disqualifiedMods: Mods;
    lowestAccuracy: number | null;
    highestAccuracy: number | null;
    owner: OsuUser | number | null;
    creationTime: Date;
}

export interface Membership {
    id: number;
    pp: number;
    leaderboard: Leaderboard | number;
    osuUser: OsuUser | number;
    joinDate: Date;
    scoreCount: number;
}

export interface Invite {
    id: number;
    message: string;
    leaderboard: Leaderboard | number;
    osuUser: OsuUser | number;
    inviteDate: Date;
}
