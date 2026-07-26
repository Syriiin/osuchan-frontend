import type { Gamemode } from "../common/enums";
import type { OsuUser, Score } from "../profiles/types";

export enum MinigameStatus {
    Lobby = "lobby",
    WaitingToStart = "waiting_to_start",
    InProgress = "in_progress",
    Finalising = "finalising",
    Finished = "finished",
}

export interface Minigame {
    id: number;
    gameType: string;
    name: string;
    gamemode: Gamemode;
    status: MinigameStatus;
    startTime: Date | null;
    endTime: Date | null;
    config: Record<string, unknown>;
    state: Record<string, unknown>;
    createdAt: Date;
    host: OsuUser;
    isFreeForAll: boolean;
    teams: MinigameTeam[];
    winningTeamId: number | null;
}

export interface MinigameTeam {
    id: number;
    name: string;
    points: number;
    scoreCount: number;
    players: MinigamePlayer[];
}

export interface MinigamePlayer {
    id: number;
    points: number;
    scoreCount: number;
    user: OsuUser;
}

export interface MinigameScore {
    id: number;
    points: number;
    score: Score;
}
