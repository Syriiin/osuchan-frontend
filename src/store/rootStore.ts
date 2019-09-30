import { MeStore } from "./me/store";
import { UsersStore } from "./users/store";
import { LeaderboardsStore } from "./leaderboards/store";

export class RootStore {
    meStore = new MeStore();
    usersStore = new UsersStore();
    leaderboardsStore = new LeaderboardsStore();
}
