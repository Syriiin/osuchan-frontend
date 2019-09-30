import { OsuUser } from "../profiles/types";

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
    oldestScoreDate: Date | null;
    newestScoreDate: Date | null;
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
