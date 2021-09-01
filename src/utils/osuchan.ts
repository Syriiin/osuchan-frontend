import {
    ScoreResult,
    ScoreSet,
    AllowedBeatmapStatus,
} from "../store/models/profiles/enums";
import { Score, ScoreFilter } from "../store/models/profiles/types";
import { calculateAccuracy } from "./osu";
import { Mods } from "../store/models/common/enums";

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

export function unchokeScore(score: Score) {
    // some slight assumptions here about combo but its close enough
    score.count300 += score.countMiss;
    score.countMiss = 0;
    score.bestCombo = score.beatmap!.maxCombo;
    score.accuracy = calculateAccuracy(
        score.gamemode,
        score.count300,
        score.count100,
        score.count50,
        score.countMiss
    );
    score.pp = score.nochokePp;
    score.result = ScoreResult.Perfect;

    return score;
}

export function unchokeForScoreSet(scores: Score[], scoreSet: ScoreSet) {
    switch (scoreSet) {
        case ScoreSet.AlwaysFullCombo:
            scores = scores.map((score) => unchokeScore(score));
            break;
        case ScoreSet.NeverChoke:
            scores = scores.map((score) =>
                score.result & ScoreResult.Choke ? unchokeScore(score) : score
            );
            break;
    }

    return scores;
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
