import { OsuUser, ScoreFilter } from "../profiles/types";

export interface User {
    id: number;
    dateJoined: Date;
    isBetaTester: boolean;
    osuUser: OsuUser | null;
    osuUserId: number;
}

export interface ScoreFilterPreset {
    id: number;
    name: string;
    scoreFilter: ScoreFilter | null;
    scoreFilterId: number;
    user: User | null;
    userId: number;
}