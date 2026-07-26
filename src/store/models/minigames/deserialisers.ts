import { osuUserFromJson, scoreFromJson } from "../profiles/deserialisers";
import type { Minigame, MinigameTeam, MinigamePlayer, MinigameScore } from "./types";
import { MinigameStatus } from "./types";

export function minigameFromJson(data: any): Minigame {
    return {
        id: data["id"],
        gameType: data["game_type"],
        name: data["name"],
        gamemode: data["gamemode"],
        status: data["status"] as MinigameStatus,
        startTime: data["start_time"] !== null ? new Date(data["start_time"]) : null,
        endTime: data["end_time"] !== null ? new Date(data["end_time"]) : null,
        config: data["config"],
        state: data["state"],
        createdAt: new Date(data["created_at"]),
        host: osuUserFromJson(data["host"]),
        isFreeForAll: data["is_free_for_all"],
        winningTeamId: data["winning_team"],
        teams: data["teams"].map((team: any) => minigameTeamFromJson(team)),
    };
}

export function minigameTeamFromJson(data: any): MinigameTeam {
    return {
        id: data["id"],
        name: data["name"],
        points: data["points"],
        scoreCount: data["score_count"],
        players: data["players"].map((player: any) => minigamePlayerFromJson(player)),
    };
}

export function minigamePlayerFromJson(data: any): MinigamePlayer {
    return {
        id: data["id"],
        points: data["points"],
        scoreCount: data["score_count"],
        user: osuUserFromJson(data["user"]),
    };
}

export function minigameScoringScoreFromJson(data: any): MinigameScore {
    return {
        id: data["id"],
        points: data["points"],
        score: scoreFromJson(data["score"]),
    };
}
