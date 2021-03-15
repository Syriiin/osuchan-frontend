import { createContext } from "react";

import { RootStore } from "./rootStore";

export { RootStore };

export const StoreContext = createContext<RootStore | null>(null);
