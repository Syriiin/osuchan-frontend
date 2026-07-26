import { beatmapFromJson, osuUserFromJson } from "../profiles/deserialisers";
import { leaderboardFromJson } from "../leaderboards/deserialisers";
import type { BeatmapChallenge, Event, EventAttendee, EventLeaderboard } from "./types";

export function eventFromJson(data: any): Event {
    return {
        id: data["id"],
        slug: data["slug"],
        name: data["name"],
        description: data["description"],
        logo: data["logo"],
        themeColours: data["theme_colours"],
        startDate: new Date(data["start_date"]),
        endDate: new Date(data["end_date"]),
        creationTime: new Date(data["creation_time"]),
        organisers:
            data["organisers"] === null
                ? []
                : data["organisers"].map((o: any) => osuUserFromJson(o)),
    };
}

export function eventAttendeeFromJson(data: any): EventAttendee {
    return {
        id: data["id"],
        user: osuUserFromJson(data["user"]),
    };
}

export function eventLeaderboardFromJson(data: any): EventLeaderboard {
    return {
        id: data["id"],
        leaderboard: leaderboardFromJson(data["leaderboard"]),
    };
}

export function beatmapChallengeFromJson(data: any): BeatmapChallenge {
    return {
        id: data["id"],
        description: data["description"],
        gamemode: data["gamemode"],
        challengeType: data["challenge_type"],
        beatmap: beatmapFromJson(data["beatmap"]),
    };
}
