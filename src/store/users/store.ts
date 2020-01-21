import axios from "axios";
import { observable, action, computed } from "mobx";
import ojsama from "ojsama";

import { UserStats, Score } from "../models/profiles/types";
import { Leaderboard } from "../models/leaderboards/types";
import { userStatsFromJson, scoreFromJson } from "../models/profiles/deserialisers";
import { leaderboardFromJson } from "../models/leaderboards/deserialisers";
import { getScoreResult, calculateAccuracy, calculateBpm, calculateLength, calculateCircleSize, calculateApproachRate, calculateOverallDifficulty } from "../../utils/osu";
import { getBeatmap, setBeatmap } from "../../beatmapCache";
import { Gamemode, Mods } from "../models/common/enums";

// This is just the sum(0.95 ** i for i in range(100)) but js is too imprecise for this many tiny additions
const WEIGHTING_VALUE = 19.881589415593293;

function calculateScoreStyleValue(values: number[]) {
    return values.reduce((total, value, i) => total + value * 0.95 ** i, 0) / WEIGHTING_VALUE;
}

export class UsersStore {
    @observable currentUserStats: UserStats | null = null;
    @observable isLoading: boolean = false;

    readonly scores = observable<Score>([]);
    readonly leaderboards = observable<Leaderboard>([]);
    readonly sandboxScores = observable<Score>([]);

    @computed get extraPerformance() {
        return this.currentUserStats ? this.currentUserStats.pp - this.scores.reduce((total, score, i) => total + score.pp * 0.95 ** i, 0) : 0;
    }

    @computed get extraNochokePerformance() {
        return this.currentUserStats ? this.currentUserStats.nochokePp - this.scores.reduce((total, score, i) => total + (score.result & ScoreResult.Choke ? score.nochokePp : score.pp) * 0.95 ** i, 0) : 0;
    }

    @computed get sandboxPerformance() {
        return this.sandboxScores.reduce((total, score, i) => total + score.pp * 0.95 ** i, 0) + this.extraPerformance;
    }

    @computed get sandboxNochokePerformance() {
        return this.sandboxScores.reduce((total, score, i) => total + (score.result & ScoreResult.Choke ? score.nochokePp : score.pp) * 0.95 ** i, 0) + this.extraNochokePerformance;
    }

    @computed get sandboxScoreStyleAccuracy() {
        return calculateScoreStyleValue(this.sandboxScores.map(score => score.accuracy));
    }

    @computed get sandboxScoreStyleBpm() {
        return calculateScoreStyleValue(this.sandboxScores.map(score => score.bpm));
    }

    @computed get sandboxScoreStyleLength() {
        return calculateScoreStyleValue(this.sandboxScores.map(score => score.length));
    }

    @computed get sandboxScoreStyleCircleSize() {
        return calculateScoreStyleValue(this.sandboxScores.map(score => score.circleSize));
    }

    @computed get sandboxScoreStyleApproachRate() {
        return calculateScoreStyleValue(this.sandboxScores.map(score => score.approachRate));
    }

    @computed get sandboxScoreStyleOverallDifficulty() {
        return calculateScoreStyleValue(this.sandboxScores.map(score => score.overallDifficulty));
    }

    @action
    loadUser = async (userString: string, gamemode: Gamemode) => {
        this.currentUserStats = null;
        this.isLoading = true;
        this.scores.clear();
        this.leaderboards.clear();
        this.sandboxScores.clear();

        try {
            const userStatsResponse = await axios.get(`/api/profiles/users/${userString}/stats/${gamemode}`, {
                params: {
                    "user_id_type": "username"
                }
            });
            const userStats: UserStats = userStatsFromJson(userStatsResponse.data);

            const userId = userStats.osuUserId;

            const scoresResponse = await axios.get(`/api/profiles/users/${userId}/stats/${gamemode}/scores`);
            const scores: Score[] = scoresResponse.data.map((data: any) => scoreFromJson(data));

            const leaderboardsResponse = await axios.get(`/api/leaderboards/leaderboards`, {
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
            console.log(error)
        }
        
        this.isLoading = false;
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
    }

    @action
    fetchBeatmapFile = async (beatmapId: number) => {
        // Check idb cache for map and return if found
        const cachedBeatmapData = await getBeatmap(beatmapId);
        if (cachedBeatmapData) {
            return cachedBeatmapData;
        }

        // Fetch beatmap from server
        const response = await axios.get(`/beatmapfiles/${beatmapId}`);
        const beatmapData = response.data;

        // Save to idb cache
        setBeatmap(beatmapId, beatmapData);

        return beatmapData;
    }
}
