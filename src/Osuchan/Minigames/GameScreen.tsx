import type { Minigame } from "../../store/models/minigames/types";
import type { MinigameScore } from "../../store/models/minigames/types";
import registry from "./games/registry";

interface GameScreenProps {
    minigame: Minigame;
    scoringScores: MinigameScore[];
}

const GameScreen = (props: GameScreenProps) => {
    const { minigame, scoringScores } = props;
    const implementation = registry[minigame.gameType];
    if (implementation === undefined) return <h3>Unknown game type: {minigame.gameType}</h3>;
    return <implementation.GameComponent minigame={minigame} scoringScores={scoringScores} />;
};

export default GameScreen;
