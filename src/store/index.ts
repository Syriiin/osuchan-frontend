import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";

import osuchanApp from "./reducers";

// Create store with thunk middleware

const middleware = [thunk];

const store = createStore(osuchanApp, composeWithDevTools(applyMiddleware(...middleware)));

export default store;
