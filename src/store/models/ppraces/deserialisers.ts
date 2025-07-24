import { osuUserFromJson } from "../profiles/deserialisers";
import { PPRace } from "./types";

export function ppraceFromJson(data: any): PPRace {
    return {
        id: data["id"],
        gamemode: data["gamemode"],
        name: data["name"],
        status: data["status"],
        duration: data["duration"],
        startTime:
            data["start_time"] !== null ? new Date(data["start_time"]) : null,
        endTime: data["end_time"] !== null ? new Date(data["end_time"]) : null,
        ppDecayBase: data["pp_decay_base"],
        teams: data["teams"].map((team: any) => ppraceTeamFromJson(team)),
    };
}

export function ppraceTeamFromJson(data: any) {
    return {
        id: data["id"],
        name: data["name"],
        totalPp: data["total_pp"],
        scoreCount: data["score_count"],
        players: data["players"].map((player: any) =>
            ppracePlayerFromJson(player)
        ),
    };
}

export function ppracePlayerFromJson(data: any) {
    return {
        id: data["id"],
        pp: data["pp"],
        ppContribution: data["pp_contribution"],
        scoreCount: data["score_count"],
        user: osuUserFromJson(data["user"]),
    };
}
