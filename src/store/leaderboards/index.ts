import { combineReducers } from "redux";

import listReducer from "./list/reducers";
import detailReducer from "./detail/reducers";
import beatmapReducer from "./beatmap/reducers";
import userReducer from "./user/reducers";

const leaderboardsReducer = combineReducers({
    list: listReducer,
    detail: detailReducer,
    beatmap: beatmapReducer,
    user: userReducer
});

export type DataState = ReturnType<typeof leaderboardsReducer>;

export default leaderboardsReducer;
