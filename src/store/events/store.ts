import { action, flow, makeAutoObservable, observable } from "mobx";

import http from "../../http";
import notify from "../../notifications";

import {
    eventFromJson,
    eventAttendeeFromJson,
    eventLeaderboardFromJson,
} from "../models/events/deserialisers";
import { Event, EventAttendee, EventLeaderboard } from "../models/events/types";
import { ResourceStatus, PaginatedResourceStatus } from "../status";

export class EventsStore {
    loadingStatus = ResourceStatus.NotLoaded;
    loadingAttendeesStatus = ResourceStatus.NotLoaded;
    attendeesCount = 0;
    loadingLeaderboardsStatus = ResourceStatus.NotLoaded;
    isAddingAttendee = false;
    isRemovingAttendee = false;
    isUpdatingEvent = false;
    isCreatingLeaderboard = false;
    isDeletingLeaderboard = false;

    eventsStatus = PaginatedResourceStatus.NotLoaded;

    event: Event | null = null;

    readonly events = observable<Event>([]);
    readonly eventAttendees = observable<EventAttendee>([]);
    readonly eventLeaderboards = observable<EventLeaderboard>([]);

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
        });
    }

    unload = () => {
        this.loadingStatus = ResourceStatus.NotLoaded;
        this.event = null;
        this.events.clear();
        this.eventAttendees.clear();
        this.attendeesCount = 0;
        this.eventLeaderboards.clear();
    };

    *loadEvents(): any {
        this.eventsStatus = PaginatedResourceStatus.LoadingInitial;
        this.events.clear();

        try {
            const response = yield http.get("/api/events/", {
                params: { limit: 50, offset: 0 },
            });
            const events: Event[] = response.data.results.map((data: any) =>
                eventFromJson(data)
            );

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
            const attendees: EventAttendee[] = response.data.results.map(
                (data: any) => eventAttendeeFromJson(data)
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
            this.eventAttendees.replace(
                this.eventAttendees.filter((a) => a.user.id !== userId)
            );
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
            const leaderboards: EventLeaderboard[] = response.data.map(
                (data: any) => eventLeaderboardFromJson(data)
            );
            this.eventLeaderboards.replace(leaderboards);
            this.loadingLeaderboardsStatus = ResourceStatus.Loaded;
        } catch (error: any) {
            console.log(error);
            this.loadingLeaderboardsStatus = ResourceStatus.Error;
        }
    }

    *createLeaderboard(slug: string, data: Record<string, any>): any {
        this.isCreatingLeaderboard = true;

        try {
            const response = yield http.post(
                `/api/events/${slug}/leaderboards`,
                data
            );
            const leaderboard = eventLeaderboardFromJson(response.data);
            this.eventLeaderboards.push(leaderboard);
            notify.positive("Leaderboard created");
        } catch (error: any) {
            console.log(error);
            const errorMessage = error.response?.data?.detail;
            if (errorMessage) {
                notify.negative(
                    `Failed to create leaderboard: ${errorMessage}`
                );
            } else {
                notify.negative("Failed to create leaderboard");
            }
        }

        this.isCreatingLeaderboard = false;
    }

    *deleteLeaderboard(slug: string, eventLeaderboardId: number): any {
        this.isDeletingLeaderboard = true;

        try {
            yield http.delete(
                `/api/events/${slug}/leaderboards/${eventLeaderboardId}`
            );
            this.eventLeaderboards.replace(
                this.eventLeaderboards.filter(
                    (lb) => lb.id !== eventLeaderboardId
                )
            );
            notify.positive("Leaderboard deleted");
        } catch (error: any) {
            console.log(error);
            const errorMessage = error.response?.data?.detail;
            if (errorMessage) {
                notify.negative(
                    `Failed to delete leaderboard: ${errorMessage}`
                );
            } else {
                notify.negative("Failed to delete leaderboard");
            }
        }

        this.isDeletingLeaderboard = false;
    }
}
