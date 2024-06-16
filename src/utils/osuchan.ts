import { Mods } from "../store/models/common/enums";
import {
    AllowedBeatmapStatus,
    ScoreResult,
} from "../store/models/profiles/enums";
import { ScoreFilter } from "../store/models/profiles/types";

export function getScoreResult(
    countMiss: number,
    bestCombo: number,
    maxCombo: number
) {
    if (countMiss === 1) {
        return ScoreResult.OneMiss;
    }

    const percentCombo = bestCombo / maxCombo;

    if (percentCombo === 1) {
        return ScoreResult.Perfect;
    } else if (percentCombo > 0.98 && countMiss === 0) {
        return ScoreResult.NoBreak;
    } else if (percentCombo > 0.95) {
        return ScoreResult.EndChoke;
    } else if (countMiss === 0) {
        return ScoreResult.SliderBreak;
    } else {
        return ScoreResult.Clear;
    }
}

export function scoreFilterIsDefault(scoreFilter: ScoreFilter) {
    return (
        scoreFilter.allowedBeatmapStatus === AllowedBeatmapStatus.RankedOnly &&
        scoreFilter.oldestBeatmapDate === null &&
        scoreFilter.newestBeatmapDate === null &&
        scoreFilter.oldestScoreDate === null &&
        scoreFilter.newestScoreDate === null &&
        scoreFilter.lowestAr === null &&
        scoreFilter.highestAr === null &&
        scoreFilter.lowestOd === null &&
        scoreFilter.highestOd === null &&
        scoreFilter.lowestCs === null &&
        scoreFilter.highestCs === null &&
        scoreFilter.requiredMods === Mods.None &&
        scoreFilter.disqualifiedMods === Mods.None &&
        scoreFilter.lowestAccuracy === null &&
        scoreFilter.highestAccuracy === null &&
        scoreFilter.lowestLength === null &&
        scoreFilter.highestLength === null
    );
}
