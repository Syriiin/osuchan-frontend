import type { MinigameImplementation } from "./types";
import firstToN from "./firstToN";
import lockoutBingo from "./lockoutBingo";
import battleRoyale from "./battleRoyale";

const registry: Record<string, MinigameImplementation> = {
    [firstToN.gameType]: firstToN,
    [lockoutBingo.gameType]: lockoutBingo,
    [battleRoyale.gameType]: battleRoyale,
};

export default registry;
