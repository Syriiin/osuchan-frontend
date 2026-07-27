import { useQuery } from "@tanstack/react-query";
import http from "../../http";
import {
    eventFromJson,
    eventLeaderboardFromJson,
    beatmapChallengeFromJson,
} from "../models/events/deserialisers";
import { membershipFromJson, leaderboardFromJson } from "../models/leaderboards/deserialisers";
import { scoreFromJson } from "../models/profiles/deserialisers";
import { formatGamemodeNameShort } from "../../utils/formatting";
import type { Event, BeatmapChallenge } from "../models/events/types";
import type { Leaderboard, Membership } from "../models/leaderboards/types";
import type { Score } from "../models/profiles/types";

export interface LeaderboardDetailData {
    eventLeaderboardId: number;
    leaderboard: Leaderboard;
    rankings: Membership[];
    scores: Score[];
}

export type ChallengeScores = Record<number, Score[]>;

export interface DashboardData {
    event: Event;
    leaderboardDetails: LeaderboardDetailData[];
    challenges: BeatmapChallenge[];
    challengeScores: ChallengeScores;
    attendeeCount: number;
}

export const eventDashboardKeys = {
    all: ["event-dashboard"] as const,
    detail: (slug: string) => [...eventDashboardKeys.all, slug] as const,
};

export function useEventDashboard(slug: string) {
    return useQuery({
        queryKey: eventDashboardKeys.detail(slug),
        queryFn: async () => {
            const eventResponse = await http.get(`/api/events/${slug}`);
            const event = eventFromJson(eventResponse.data);

            const [leaderboardsResponse, challengesResponse, attendeesResponse] = await Promise.all(
                [
                    http.get(`/api/events/${slug}/leaderboards`),
                    http.get(`/api/events/${slug}/challenges`),
                    http.get(`/api/events/${slug}/attendees`, { params: { limit: 1 } }),
                ],
            );

            const attendeeCount = attendeesResponse.data.count ?? 0;

            const eventLeaderboards = leaderboardsResponse.data.map((data: any) =>
                eventLeaderboardFromJson(data),
            );

            const challenges: BeatmapChallenge[] = challengesResponse.data.map((data: any) =>
                beatmapChallengeFromJson(data),
            );

            const leaderboardDetails: LeaderboardDetailData[] = await Promise.all(
                eventLeaderboards.map(async (elb: any) => {
                    const lb = elb.leaderboard;
                    const resourceUrl = `/api/leaderboards/community/${formatGamemodeNameShort(lb.gamemode)}/${lb.id}`;

                    const [membersRes, scoresRes] = await Promise.all([
                        http.get(`${resourceUrl}/members`),
                        http.get(`${resourceUrl}/scores`, { params: { limit: 15 } }),
                    ]);

                    const leaderboard = leaderboardFromJson(lb);

                    const rankings: Membership[] = membersRes.data.map((data: any) =>
                        membershipFromJson(data),
                    );

                    const scores: Score[] = scoresRes.data
                        .map((data: any) =>
                            scoreFromJson(
                                data,
                                leaderboard.calculatorEngine,
                                leaderboard.primaryPerformanceValue,
                            ),
                        )
                        .sort((a: Score, b: Score) => b.performanceTotal - a.performanceTotal);

                    return {
                        eventLeaderboardId: elb.id,
                        leaderboard,
                        rankings,
                        scores,
                    };
                }),
            );

            const challengeScores: ChallengeScores = {};
            await Promise.all(
                challenges.map(async (challenge) => {
                    try {
                        const response = await http.get(
                            `/api/events/${slug}/challenges/${challenge.id}/scores`,
                        );
                        const scores: Score[] = response.data.map((data: any) => {
                            const score = scoreFromJson(data);
                            if (challenge.beatmap) {
                                score.beatmap = challenge.beatmap;
                            }
                            return score;
                        });
                        challengeScores[challenge.id] = scores;
                    } catch {
                        challengeScores[challenge.id] = [];
                    }
                }),
            );

            return {
                event,
                leaderboardDetails,
                challenges,
                challengeScores,
                attendeeCount,
            } satisfies DashboardData;
        },
        refetchInterval: 60_000,
        staleTime: 30_000,
    });
}
