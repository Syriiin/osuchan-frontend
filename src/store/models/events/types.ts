import type { OsuUser } from "../profiles/types";
import type { Leaderboard } from "../leaderboards/types";

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
