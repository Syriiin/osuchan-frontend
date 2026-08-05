import type { OsuUser } from "../profiles/types";
import type { Leaderboard } from "../leaderboards/types";
import type { Beatmap } from "../profiles/types";

export interface Event {
    id: number;
    slug: string;
    name: string;
    description: string;
    logo: string;
    themeColours: Record<string, string>;
    startDate: Date;
    endDate: Date;
    creationTime: Date;
    organisers: OsuUser[];
    stats: EventStats | null;
}

export interface EventStats {
    totalScores: number;
    totalRegularHits: number;
    totalPlayTime: number;
    totalPp: number;
    uniquePlayers: number;
    uniqueCountries: number;
    uniqueMaps: number;
    lastUpdated: Date;
}

export interface EventAttendee {
    id: number;
    user: OsuUser;
}

export interface EventAttendeesPage {
    count: number;
    results: EventAttendee[];
}

export interface EventLeaderboard {
    id: number;
    leaderboard: Leaderboard;
}

export interface BeatmapChallenge {
    id: number;
    description: string;
    gamemode: number;
    challengeType: string;
    beatmap: Beatmap;
}
