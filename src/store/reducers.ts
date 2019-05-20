import { combineReducers } from "redux";

import meReducer from "./me/reducers";
import profileReducer from "./profile/reducers";

// Combine all our reducers to create the root reducer

const rootReducer = combineReducers({
    me: meReducer,
    profile: profileReducer
});

export type StoreState = ReturnType<typeof rootReducer>;

export default rootReducer;
