import { ListStore } from "./list/store";
import { DetailStore } from "./detail/store";

export class LeaderboardsStore {
    listStore: ListStore = new ListStore();
    detailStore: DetailStore = new DetailStore();
}
