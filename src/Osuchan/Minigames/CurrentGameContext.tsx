import { createContext, useContext } from "react";
import type { Minigame } from "../../store/models/minigames/types";

const CurrentGameContext = createContext<Minigame | null>(null);

export const CurrentGameProvider = CurrentGameContext.Provider;

export function useCurrentGame(): Minigame | null {
    return useContext(CurrentGameContext);
}
