import type { ComponentType } from "react";
import type { Minigame, MinigameScore } from "../../../store/models/minigames/types";

export interface MinigameImplementation {
    gameType: string;
    label: string;
    GameComponent: ComponentType<{
        minigame: Minigame;
        scoringScores: MinigameScore[];
    }>;
    SettingsComponent: ComponentType<{ open: boolean; onClose: () => void; minigame: Minigame }>;
    defaultSettings: Record<string, unknown>;
}
