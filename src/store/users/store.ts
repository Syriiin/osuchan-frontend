import { observable, action, computed } from "mobx";
import ojsama from "ojsama";

import http from "../../http";

import { UserStats, Score, ScoreFilter } from "../models/profiles/types";
import { Leaderboard } from "../models/leaderboards/types";
import { userStatsFromJson, scoreFromJson } from "../models/profiles/deserialisers";
import { leaderboardFromJson } from "../models/leaderboards/deserialisers";
import { getScoreResult, calculateAccuracy, calculateBpm, calculateLength, calculateCircleSize, calculateApproachRate, calculateOverallDifficulty, unchokeForScoreSet } from "../../utils/osu";
import { getBeatmap, setBeatmap } from "../../beatmapCache";
import { Gamemode, Mods } from "../models/common/enums";
import { ScoreSet } from "../models/profiles/enums";
import { notify } from "../../notifications";

function calculateScoreStyleValue(values: number[]) {
    let weighting_value = 0;
    for (let i = 0; i < values.length; i++) {
        weighting_value += 0.95 ** i;
    }
    return values.reduce((total, value, i) => total + value * 0.95 ** i, 0) / weighting_value;
}

export class UsersStore {
    @observable isLoading: boolean = false;
    @observable isLoadingSandboxScores: boolean = false;

    @observable currentUserStats: UserStats | null = null;

    readonly scores = observable<Score>([]);
    readonly leaderboards = observable<Leaderboard>([]);
    readonly sandboxScores = observable<Score>([]);

    @computed get extraPerformance() {
        return this.currentUserStats ? this.currentUserStats.pp - this.scores.reduce((total, score, i) => total + score.pp * 0.95 ** i, 0) : 0;
    }

    @computed get sandboxPerformance() {
        return this.sandboxScores.reduce((total, score, i) => total + score.pp * 0.95 ** i, 0) + this.extraPerformance;
    }

    @computed get sandboxScoreStyleAccuracy() {
        return calculateScoreStyleValue(this.sandboxScores.map(score => score.accuracy)) || 0;
    }

    @computed get sandboxScoreStyleBpm() {
        return calculateScoreStyleValue(this.sandboxScores.map(score => score.bpm)) || 0;
    }

    @computed get sandboxScoreStyleLength() {
        return calculateScoreStyleValue(this.sandboxScores.map(score => score.length)) || 0;
    }

    @computed get sandboxScoreStyleCircleSize() {
        return calculateScoreStyleValue(this.sandboxScores.map(score => score.circleSize)) || 0;
    }

    @computed get sandboxScoreStyleApproachRate() {
        return calculateScoreStyleValue(this.sandboxScores.map(score => score.approachRate)) || 0;
    }

    @computed get sandboxScoreStyleOverallDifficulty() {
        return calculateScoreStyleValue(this.sandboxScores.map(score => score.overallDifficulty)) || 0;
    }

    @action
    loadUser = async (userString: string, gamemode: Gamemode) => {
        this.currentUserStats = null;
        this.scores.clear();
        this.leaderboards.clear();
        this.sandboxScores.clear();
        this.isLoading = true;

        try {
            const userStatsResponse = await http.get(`/api/profiles/users/${userString}/stats/${gamemode}`, {
                params: {
                    "user_id_type": "username"
                }
            });
            const userStats: UserStats = userStatsFromJson(userStatsResponse.data);

            const userId = userStats.osuUserId;

            const scoresResponse = await http.get(`/api/profiles/users/${userId}/stats/${gamemode}/scores`);
            const scores: Score[] = scoresResponse.data.map((data: any) => scoreFromJson(data));

            const leaderboardsResponse = await http.get(`/api/leaderboards/leaderboards`, {
                params: {
                    "user_id": userId,
                    "gamemode": gamemode
                }
            });
            const leaderboards: Leaderboard[] = leaderboardsResponse.data.map((data: any) => leaderboardFromJson(data));

            this.currentUserStats = userStats;
            this.scores.replace(scores);
            this.leaderboards.replace(leaderboards);
            this.sandboxScores.replace(scores);
        } catch (error) {
            console.log(error);
        }
        
        this.isLoading = false;
    }

    @action
    loadSandboxScores = async (scoreSet: ScoreSet, scoreFilter: ScoreFilter) => {
        this.isLoadingSandboxScores = true;

        try {
            const scoresResponse = await http.get(`/api/profiles/users/${this.currentUserStats?.osuUserId}/stats/${this.currentUserStats?.gamemode}/scores`, {
                params: {
                    "score_set": scoreSet,
                    "allowed_beatmap_status": scoreFilter.allowedBeatmapStatus,
                    "oldest_beatmap_date": scoreFilter.oldestBeatmapDate,
                    "newest_beatmap_date": scoreFilter.newestBeatmapDate,
                    "oldest_score_date": scoreFilter.oldestScoreDate,
                    "newest_score_date": scoreFilter.newestScoreDate,
                    "lowest_ar": scoreFilter.lowestAr,
                    "highest_ar": scoreFilter.highestAr,
                    "lowest_od": scoreFilter.lowestOd,
                    "highest_od": scoreFilter.highestOd,
                    "lowest_cs": scoreFilter.lowestCs,
                    "highest_cs": scoreFilter.highestCs,
                    "required_mods": scoreFilter.requiredMods,
                    "disqualified_mods": scoreFilter.disqualifiedMods,
                    "lowest_accuracy": scoreFilter.lowestAccuracy,
                    "highest_accuracy": scoreFilter.highestAccuracy,
                    "lowest_length": scoreFilter.lowestLength,
                    "highest_length": scoreFilter.highestLength
                }
            });
            let scores: Score[] = scoresResponse.data.map((data: any) => scoreFromJson(data));

            // transform scores into their intended form for abnormal score sets
            scores = unchokeForScoreSet(scores, scoreSet);

            this.sandboxScores.replace(scores);

            notify.neutral("Sandbox scores loaded");
        } catch (error) {
            console.log(error);

            const errorMessage = error.response.data.detail;

            if (errorMessage) {
                notify.negative(`Failed to load sandbox scores: ${errorMessage}`);
            } else {
                notify.negative("Failed to load sandbox scores");
            }
        }
        
        this.isLoadingSandboxScores = false;
    }

    @action
    updateSandboxScore = async (score: Score, mods: Mods, bestCombo: number, count100: number, count50: number, countMiss: number) => {
        const beatmap = score.beatmap!;
        const totalObjects = score.count300 + score.count100 + score.count50 + score.countMiss;

        score.mods = mods;
        score.bestCombo = bestCombo;
        score.count300 = totalObjects - count100 - count50 - countMiss;
        score.count100 = count100;
        score.count50 = count50;
        score.countMiss = countMiss;
        
        score.accuracy = calculateAccuracy(this.currentUserStats!.gamemode, score.count300, score.count100, score.count50, score.countMiss);
        score.bpm = calculateBpm(beatmap.bpm, score.mods);
        score.length = calculateLength(beatmap.drainTime, score.mods);
        score.circleSize = calculateCircleSize(beatmap.circleSize, score.mods, score.gamemode);
        score.approachRate = calculateApproachRate(beatmap.approachRate, score.mods);
        score.overallDifficulty = calculateOverallDifficulty(beatmap.overallDifficulty, score.mods);
        score.result = getScoreResult(countMiss, bestCombo, beatmap.maxCombo);
        
        // PP calc
        const beatmapFile = await this.fetchBeatmapFile(beatmap.id);
        const parser = new ojsama.parser().feed(beatmapFile);
        const stars = new ojsama.diff().calc({
            map: parser.map,
            mods: mods as number
        });
        const pp = ojsama.ppv2({
            stars,
            combo: score.bestCombo,
            n300: score.count300,
            n100: score.count100,
            n50: score.count50,
            nmiss: score.countMiss
        });
        const nochokePp = ojsama.ppv2({
            stars,
            n100: score.count100,
            n50: score.count50
        });
        
        score.starRating = stars.total;
        score.pp = pp.total;
        score.nochokePp = nochokePp.total;

        // Sort observable array
        this.sandboxScores.replace(this.sandboxScores.slice().sort((a, b) => b.pp - a.pp));

        notify.neutral("Sandbox scores recalculated");
    }

    @action
    fetchBeatmapFile = async (beatmapId: number) => {
        // Check idb cache for map and return if found
        const cachedBeatmapData = await getBeatmap(beatmapId);
        if (cachedBeatmapData) {
            return cachedBeatmapData;
        }

        // Fetch beatmap from server
        const response = await http.get(`/beatmapfiles/${beatmapId}`);
        const beatmapData = response.data;

        // Save to idb cache
        setBeatmap(beatmapId, beatmapData);

        return beatmapData;
    }
}
