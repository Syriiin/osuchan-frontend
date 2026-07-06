import { MeStore } from "./me/store";
import { UsersStore } from "./users/store";
import { LeaderboardsStore } from "./leaderboards/store";
import { PPRacesStore } from "./ppraces/store";
import { EventsStore } from "./events/store";

export class RootStore {
    meStore = new MeStore();
    usersStore = new UsersStore();
    leaderboardsStore = new LeaderboardsStore();
    ppracesStore = new PPRacesStore();
    eventsStore = new EventsStore();
}
