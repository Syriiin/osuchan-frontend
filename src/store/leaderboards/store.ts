import { ListStore } from "./list/store";
import { DetailStore } from "./detail/store";
import { BeatmapStore } from "./beatmap/store";
import { UserStore } from "./user/store";

export class LeaderboardsStore {
    listStore: ListStore = new ListStore();
    detailStore: DetailStore = new DetailStore();
    beatmapStore: BeatmapStore = new BeatmapStore();
    userStore: UserStore = new UserStore();
}
