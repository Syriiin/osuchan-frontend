import { action, flow, makeAutoObservable, observable } from "mobx";

import http from "../../http";
import notify from "../../notifications";

import {
    beatmapChallengeFromJson,
    eventFromJson,
    eventAttendeeFromJson,
    eventLeaderboardFromJson,
} from "../models/events/deserialisers";
import { scoreFromJson } from "../models/profiles/deserialisers";
import type {
    BeatmapChallenge,
    Event,
    EventAttendee,
    EventLeaderboard,
} from "../models/events/types";
import { Gamemode } from "../models/common/enums";
import type { Score } from "../models/profiles/types";
import { ResourceStatus, PaginatedResourceStatus } from "../status";

export class EventsStore {
    loadingStatus = ResourceStatus.NotLoaded;
    loadingAttendeesStatus = ResourceStatus.NotLoaded;
    attendeesCount = 0;
    loadingLeaderboardsStatus = ResourceStatus.NotLoaded;
    loadingChallengesStatus = ResourceStatus.NotLoaded;
    loadingChallengeScoresStatus = ResourceStatus.NotLoaded;
    isAddingAttendee = false;
    isRemovingAttendee = false;
    isUpdatingEvent = false;
    isCreatingLeaderboard = false;
    isDeletingLeaderboard = false;
    isCreatingChallenge = false;

    eventsStatus = PaginatedResourceStatus.NotLoaded;

    event: Event | null = null;

    readonly events = observable<Event>([]);
    readonly eventAttendees = observable<EventAttendee>([]);
    readonly eventLeaderboards = observable<EventLeaderboard>([]);
    readonly challenges = observable<BeatmapChallenge>([]);
    readonly challengeScores = observable.map<number, Score[]>();
    readonly leaderboardScores = observable.map<number, Score[]>();

    constructor() {
        makeAutoObservable(this, {
            unload: action,
            loadEvents: flow,
            loadEvent: flow,
            updateEvent: flow,
            loadAttendees: flow,
            addAttendee: flow,
            removeAttendee: flow,
            loadLeaderboards: flow,
            createLeaderboard: flow,
            deleteLeaderboard: flow,
            loadChallenges: flow,
            loadChallengeScores: flow,
            loadLeaderboardScores: flow,
            createChallenge: flow,
        });
    }

    unload = () => {
        this.loadingStatus = ResourceStatus.NotLoaded;
        this.event = null;
        this.events.clear();
        this.eventAttendees.clear();
        this.attendeesCount = 0;
        this.eventLeaderboards.clear();
        this.challenges.clear();
        this.challengeScores.clear();
        this.leaderboardScores.clear();
    };

    *loadEvents(): any {
        this.eventsStatus = PaginatedResourceStatus.LoadingInitial;
        this.events.clear();

        try {
            const response = yield http.get("/api/events/", {
                params: { limit: 50, offset: 0 },
            });
            const events: Event[] = response.data.results.map((data: any) => eventFromJson(data));

            this.events.replace(events);
            this.eventsStatus = PaginatedResourceStatus.Loaded;
        } catch (error: any) {
            console.log(error);
            this.eventsStatus = PaginatedResourceStatus.Error;
        }
    }

    *loadEvent(slug: string): any {
        this.loadingStatus = ResourceStatus.Loading;

        try {
            const response = yield http.get(`/api/events/${slug}`);
            this.event = eventFromJson(response.data);
            this.loadingStatus = ResourceStatus.Loaded;
        } catch (error: any) {
            console.log(error);
            this.loadingStatus = ResourceStatus.Error;
        }
    }

    *updateEvent(slug: string, data: Record<string, any>): any {
        this.isUpdatingEvent = true;

        try {
            const response = yield http.patch(`/api/events/${slug}`, data);
            this.event = eventFromJson(response.data);
            notify.positive("Event updated");
        } catch (error: any) {
            console.log(error);
            const errorMessage = error.response?.data?.detail;
            if (errorMessage) {
                notify.negative(`Failed to update event: ${errorMessage}`);
            } else {
                notify.negative("Failed to update event");
            }
        }

        this.isUpdatingEvent = false;
    }

    *loadAttendees(slug: string, limit = 5, offset = 0): any {
        this.loadingAttendeesStatus = ResourceStatus.Loading;
        this.eventAttendees.clear();

        try {
            const response = yield http.get(`/api/events/${slug}/attendees`, {
                params: { limit, offset },
            });
            const attendees: EventAttendee[] = response.data.results.map((data: any) =>
                eventAttendeeFromJson(data),
            );
            this.attendeesCount = response.data.count;
            this.eventAttendees.replace(attendees);
            this.loadingAttendeesStatus = ResourceStatus.Loaded;
        } catch (error: any) {
            console.log(error);
            this.loadingAttendeesStatus = ResourceStatus.Error;
        }
    }

    *addAttendee(slug: string, userId: number): any {
        this.isAddingAttendee = true;

        try {
            const response = yield http.post(`/api/events/${slug}/attendees`, {
                user_id: userId,
            });
            const attendee = eventAttendeeFromJson(response.data);
            this.eventAttendees.push(attendee);
            this.attendeesCount += 1;
            notify.positive("Attendee added");
        } catch (error: any) {
            console.log(error);
            const errorMessage = error.response?.data?.detail;
            if (errorMessage) {
                notify.negative(`Failed to add attendee: ${errorMessage}`);
            } else {
                notify.negative("Failed to add attendee");
            }
        }

        this.isAddingAttendee = false;
    }

    *removeAttendee(slug: string, userId: number): any {
        this.isRemovingAttendee = true;

        try {
            yield http.delete(`/api/events/${slug}/attendees/${userId}`);
            this.eventAttendees.replace(this.eventAttendees.filter((a) => a.user.id !== userId));
            this.attendeesCount = Math.max(0, this.attendeesCount - 1);
            notify.positive("Attendee removed");
        } catch (error: any) {
            console.log(error);
            const errorMessage = error.response?.data?.detail;
            if (errorMessage) {
                notify.negative(`Failed to remove attendee: ${errorMessage}`);
            } else {
                notify.negative("Failed to remove attendee");
            }
        }

        this.isRemovingAttendee = false;
    }

    *loadLeaderboards(slug: string): any {
        this.loadingLeaderboardsStatus = ResourceStatus.Loading;
        this.eventLeaderboards.clear();

        try {
            const response = yield http.get(`/api/events/${slug}/leaderboards`);
            const leaderboards: EventLeaderboard[] = response.data.map((data: any) =>
                eventLeaderboardFromJson(data),
            );
            this.eventLeaderboards.replace(leaderboards);
            this.loadingLeaderboardsStatus = ResourceStatus.Loaded;

            yield Promise.all(
                leaderboards.map((lb) =>
                    this.loadLeaderboardScores(
                        lb.leaderboard.id,
                        lb.leaderboard.gamemode,
                        lb.leaderboard.calculatorEngine,
                        lb.leaderboard.primaryPerformanceValue,
                    ),
                ),
            );
        } catch (error: any) {
            console.log(error);
            this.loadingLeaderboardsStatus = ResourceStatus.Error;
        }
    }

    *loadLeaderboardScores(
        leaderboardId: number,
        gamemode: Gamemode,
        calculatorEngine: string,
        primaryPerformanceValue: string,
    ): any {
        try {
            const response = yield http.get(
                `/api/leaderboards/community/${gamemode}/${leaderboardId}/scores`,
                { params: { limit: 5 } },
            );
            const scores: Score[] = response.data.map((data: any) =>
                scoreFromJson(data, calculatorEngine, primaryPerformanceValue),
            );
            this.leaderboardScores.set(leaderboardId, scores);
        } catch (error: any) {
            console.log(error);
        }
    }

    *createLeaderboard(slug: string, data: Record<string, any>): any {
        this.isCreatingLeaderboard = true;

        try {
            const response = yield http.post(`/api/events/${slug}/leaderboards`, data);
            const leaderboard = eventLeaderboardFromJson(response.data);
            this.eventLeaderboards.push(leaderboard);
            notify.positive("Leaderboard created");
        } catch (error: any) {
            console.log(error);
            const errorMessage = error.response?.data?.detail;
            if (errorMessage) {
                notify.negative(`Failed to create leaderboard: ${errorMessage}`);
            } else {
                notify.negative("Failed to create leaderboard");
            }
        }

        this.isCreatingLeaderboard = false;
    }

    *deleteLeaderboard(slug: string, eventLeaderboardId: number): any {
        this.isDeletingLeaderboard = true;

        try {
            yield http.delete(`/api/events/${slug}/leaderboards/${eventLeaderboardId}`);
            this.eventLeaderboards.replace(
                this.eventLeaderboards.filter((lb) => lb.id !== eventLeaderboardId),
            );
            notify.positive("Leaderboard deleted");
        } catch (error: any) {
            console.log(error);
            const errorMessage = error.response?.data?.detail;
            if (errorMessage) {
                notify.negative(`Failed to delete leaderboard: ${errorMessage}`);
            } else {
                notify.negative("Failed to delete leaderboard");
            }
        }

        this.isDeletingLeaderboard = false;
    }

    *loadChallenges(slug: string): any {
        this.loadingChallengesStatus = ResourceStatus.Loading;
        this.challenges.clear();

        try {
            const response = yield http.get(`/api/events/${slug}/challenges`);
            const challenges: BeatmapChallenge[] = response.data.map((data: any) =>
                beatmapChallengeFromJson(data),
            );
            this.challenges.replace(challenges);
            this.loadingChallengesStatus = ResourceStatus.Loaded;

            yield Promise.all(challenges.map((c) => this.loadChallengeScores(slug, c.id)));
        } catch (error: any) {
            console.log(error);
            this.loadingChallengesStatus = ResourceStatus.Error;
        }
    }

    *loadChallengeScores(slug: string, challengeId: number): any {
        try {
            const response = yield http.get(`/api/events/${slug}/challenges/${challengeId}/scores`);
            const challenge = this.challenges.find((c) => c.id === challengeId);
            const beatmap = challenge?.beatmap ?? null;
            const scores: Score[] = response.data.map((data: any) => {
                const score = scoreFromJson(data);
                if (beatmap) {
                    score.beatmap = beatmap;
                }
                return score;
            });
            this.challengeScores.set(challengeId, scores);
        } catch (error: any) {
            console.log(error);
        }
    }

    *createChallenge(slug: string, data: Record<string, any>): any {
        this.isCreatingChallenge = true;

        try {
            const response = yield http.post(`/api/events/${slug}/challenges`, data);
            const challenge = beatmapChallengeFromJson(response.data);
            this.challenges.push(challenge);
            this.loadChallengeScores(slug, challenge.id);
            notify.positive("Challenge created");
        } catch (error: any) {
            console.log(error);
            const errorMessage = error.response?.data?.detail;
            if (errorMessage) {
                notify.negative(`Failed to create challenge: ${errorMessage}`);
            } else {
                notify.negative("Failed to create challenge");
            }
        }

        this.isCreatingChallenge = false;
    }
}
