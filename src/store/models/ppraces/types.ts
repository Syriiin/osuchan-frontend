import { Gamemode } from "../common/enums";
import { OsuUser } from "../profiles/types";
import { PPRaceStatus } from "./enums";

export interface PPRace {
    id: number;
    gamemode: Gamemode;
    name: string;
    status: PPRaceStatus;
    duration: number;
    startTime: Date | null;
    endTime: Date | null;
    ppDecayBase: number;
    teams: PPRaceTeam[];
}

export interface PPRaceTeam {
    id: number;
    name: string;
    totalPp: number;
    scoreCount: number;
    players: PPRacePlayer[];
}

export interface PPRacePlayer {
    id: number;
    pp: number;
    ppContribution: number;
    scoreCount: number;
    user: OsuUser;
}
