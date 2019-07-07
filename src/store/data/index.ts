import { combineReducers } from "redux";

import profilesReducer from "./profiles/reducers";
import leaderboardsReducer from "./leaderboards/reducers";

const dataReducer = combineReducers({
    profiles: profilesReducer,
    leaderboards: leaderboardsReducer
});

export type DataState = ReturnType<typeof dataReducer>;

export default dataReducer;
