import type { MinigameImplementation } from "./types";
import firstToN from "./firstToN";
import lockoutBingo from "./lockoutBingo";

const registry: Record<string, MinigameImplementation> = {
    [firstToN.gameType]: firstToN,
    [lockoutBingo.gameType]: lockoutBingo,
};

export default registry;
