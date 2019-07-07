import { combineReducers } from "redux";

import dataReducer from "./data";
import meReducer from "./me/reducers";
import usersReducer from "./users/reducers";
import leaderboardsReducer from "./leaderboards";

// Combine all our reducers to create the root reducer

const rootReducer = combineReducers({
    data: dataReducer,
    me: meReducer,
    users: usersReducer,
    leaderboards: leaderboardsReducer
});

export type StoreState = ReturnType<typeof rootReducer>;

export default rootReducer;
