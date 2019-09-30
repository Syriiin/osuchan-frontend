import { createContext } from "react";

import { RootStore } from "./rootStore";

const store = new RootStore();

export const StoreContext = createContext(store);
