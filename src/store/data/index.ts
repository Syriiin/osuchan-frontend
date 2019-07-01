import { combineReducers } from "redux";

import profilesReducer from "./profiles/reducers";

const dataReducer = combineReducers({
    profiles: profilesReducer
});

export type DataState = ReturnType<typeof dataReducer>;

export default dataReducer;
