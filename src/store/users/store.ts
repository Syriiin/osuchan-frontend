import { flow, flowResult, makeAutoObservable, observable } from "mobx";
import ojsama from "ojsama";

import http from "../../http";
import notify from "../../notifications";

import { getBeatmap, setBeatmap } from "../../beatmapCache";
import {
    bitmodsFromJsonMods,
    calculateApproachRate,
    calculateBpm,
    calculateCircleSize,
    calculateClassicAccuracy,
    calculateLength,
    calculateOverallDifficulty
} from "../../utils/osu";
import { getScoreResult } from "../../utils/osuchan";
import { Gamemode } from "../models/common/enums";
import { membershipFromJson } from "../models/leaderboards/deserialisers";
import { Membership } from "../models/leaderboards/types";
import {
    scoreFromJson,
    userStatsFromJson,
} from "../models/profiles/deserialisers";
import { ScoreSet } from "../models/profiles/enums";
import { ModsJson, Score, ScoreFilter, UserStats } from "../models/profiles/types";
import { PaginatedResourceStatus, ResourceStatus } from "../status";

function calculateScoreStyleValue(values: number[]) {
    let weighting_value = 0;
    for (let i = 0; i < values.length; i++) {
        weighting_value += 0.95 ** i;
    }
    return (
        values.reduce((total, value, i) => total + value * 0.95 ** i, 0) /
        weighting_value
    );
}

export class UsersStore {
    gamemode: Gamemode | null = null;
    currentUserStats: UserStats | null = null;
    loadingStatus = ResourceStatus.NotLoaded;
    loadingSandboxScoresStatus = ResourceStatus.NotLoaded;
    globalMembershipsStatus = PaginatedResourceStatus.NotLoaded;
    communityMembershipsStatus = PaginatedResourceStatus.NotLoaded;

    readonly scores = observable<Score>([]);
    readonly globalMemberships = observable<Membership>([]);
    readonly communityMemberships = observable<Membership>([]);
    readonly sandboxScores = observable<Score>([]);

    constructor() {
        makeAutoObservable(this, {
            loadUser: flow,
            loadNextGlobalMembershipsPage: flow,
            loadCommunityMemberships: flow,
            loadNextCommunityMembershipsPage: flow,
            loadSandboxScores: flow,
            updateSandboxScore: flow,
            fetchBeatmapFile: flow,
        });
    }

    get extraPerformance() {
        return this.currentUserStats
            ? this.currentUserStats.pp -
            this.scores.reduce(
                (total, score, i) =>
                    total + score.performanceTotal * 0.95 ** i,
                0
            )
            : 0;
    }

    get sandboxPerformance() {
        return (
            this.sandboxScores.reduce(
                (total, score, i) => total + score.performanceTotal * 0.95 ** i,
                0
            ) + this.extraPerformance
        );
    }

    get sandboxScoreStyleAccuracy() {
        return (
            calculateScoreStyleValue(
                this.sandboxScores.map((score) => score.accuracy)
            ) || 0
        );
    }

    get sandboxScoreStyleBpm() {
        return (
            calculateScoreStyleValue(
                this.sandboxScores.map((score) => score.bpm)
            ) || 0
        );
    }

    get sandboxScoreStyleLength() {
        return (
            calculateScoreStyleValue(
                this.sandboxScores.map((score) => score.length)
            ) || 0
        );
    }

    get sandboxScoreStyleCircleSize() {
        return (
            calculateScoreStyleValue(
                this.sandboxScores.map((score) => score.circleSize)
            ) || 0
        );
    }

    get sandboxScoreStyleApproachRate() {
        return (
            calculateScoreStyleValue(
                this.sandboxScores.map((score) => score.approachRate)
            ) || 0
        );
    }

    get sandboxScoreStyleOverallDifficulty() {
        return (
            calculateScoreStyleValue(
                this.sandboxScores.map((score) => score.overallDifficulty)
            ) || 0
        );
    }

    *loadUser(userString: string, gamemode: Gamemode): any {
        this.gamemode = gamemode;
        this.currentUserStats = null;
        this.scores.clear();
        this.globalMemberships.clear();
        this.communityMemberships.clear();
        this.sandboxScores.clear();
        this.loadingStatus = ResourceStatus.Loading;
        this.globalMembershipsStatus = PaginatedResourceStatus.Loading;
        this.communityMembershipsStatus = PaginatedResourceStatus.NotLoaded;

        try {
            const userStatsResponse = yield http.get(
                `/api/profiles/users/${userString}/stats/${gamemode}`,
                {
                    params: {
                        user_id_type: "username",
                    },
                }
            );
            const userStats: UserStats = userStatsFromJson(
                userStatsResponse.data
            );

            const userId = userStats.osuUserId;

            const scoresResponse = yield http.get(
                `/api/profiles/users/${userId}/stats/${gamemode}/scores`
            );
            const scores: Score[] = scoresResponse.data.map((data: any) =>
                scoreFromJson(data)
            );

            const globalMembershipsResponse = yield http.get(
                `/api/profiles/users/${userId}/memberships/global/${gamemode}`,
                {
                    params: {
                        offset: 0,
                        limit: 25,
                    },
                }
            );
            const globalMemberships: Membership[] =
                globalMembershipsResponse.data["results"].map((data: any) =>
                    membershipFromJson(data)
                );

            this.currentUserStats = userStats;
            this.scores.replace(scores);
            this.globalMemberships.replace(globalMemberships);
            this.sandboxScores.replace(scores);

            this.loadingStatus = ResourceStatus.Loaded;

            if (
                this.globalMemberships.length ===
                globalMembershipsResponse.data["count"]
            ) {
                this.globalMembershipsStatus = PaginatedResourceStatus.Loaded;
            } else {
                this.globalMembershipsStatus =
                    PaginatedResourceStatus.PartiallyLoaded;
            }
        } catch (error: any) {
            console.log(error);

            this.loadingStatus = ResourceStatus.Error;
            this.globalMembershipsStatus = PaginatedResourceStatus.Error;
        }
    }

    *loadNextGlobalMembershipsPage(): any {
        this.globalMembershipsStatus = PaginatedResourceStatus.LoadingMore;

        try {
            const globalMembershipsResponse = yield http.get(
                `/api/profiles/users/${this.currentUserStats?.osuUserId}/memberships/global/${this.gamemode}`,
                {
                    params: {
                        offset: this.globalMemberships.length,
                        limit: 25,
                    },
                }
            );
            const globalMemberships: Membership[] =
                globalMembershipsResponse.data["results"].map((data: any) =>
                    membershipFromJson(data)
                );

            this.globalMemberships.replace(
                this.globalMemberships.concat(globalMemberships)
            );

            if (
                this.globalMemberships.length ===
                globalMembershipsResponse.data["count"]
            ) {
                this.globalMembershipsStatus = PaginatedResourceStatus.Loaded;
            } else {
                this.globalMembershipsStatus =
                    PaginatedResourceStatus.PartiallyLoaded;
            }
        } catch (error: any) {
            console.log(error);

            this.globalMembershipsStatus = PaginatedResourceStatus.Error;
        }
    }

    *loadCommunityMemberships(): any {
        this.communityMembershipsStatus =
            PaginatedResourceStatus.LoadingInitial;

        this.communityMemberships.clear();

        try {
            const communityMembershipsResponse = yield http.get(
                `/api/profiles/users/${this.currentUserStats?.osuUserId}/memberships/community/${this.gamemode}`,
                {
                    params: {
                        offset: 0,
                        limit: 5,
                    },
                }
            );
            const communityMemberships: Membership[] =
                communityMembershipsResponse.data["results"].map((data: any) =>
                    membershipFromJson(data)
                );

            this.communityMemberships.replace(communityMemberships);

            if (
                this.communityMemberships.length ===
                communityMembershipsResponse.data["count"]
            ) {
                this.communityMembershipsStatus =
                    PaginatedResourceStatus.Loaded;
            } else {
                this.communityMembershipsStatus =
                    PaginatedResourceStatus.PartiallyLoaded;
            }
        } catch (error: any) {
            console.log(error);

            this.communityMembershipsStatus = PaginatedResourceStatus.Error;
        }
    }

    *loadNextCommunityMembershipsPage(): any {
        this.communityMembershipsStatus = PaginatedResourceStatus.LoadingMore;

        try {
            const communityMembershipsResponse = yield http.get(
                `/api/profiles/users/${this.currentUserStats?.osuUserId}/memberships/community/${this.gamemode}`,
                {
                    params: {
                        offset: this.communityMemberships.length,
                        limit: 10,
                    },
                }
            );
            const communityMemberships: Membership[] =
                communityMembershipsResponse.data["results"].map((data: any) =>
                    membershipFromJson(data)
                );

            this.communityMemberships.replace(
                this.communityMemberships.concat(communityMemberships)
            );

            if (
                this.communityMemberships.length ===
                communityMembershipsResponse.data["count"]
            ) {
                this.communityMembershipsStatus =
                    PaginatedResourceStatus.Loaded;
            } else {
                this.communityMembershipsStatus =
                    PaginatedResourceStatus.PartiallyLoaded;
            }
        } catch (error: any) {
            console.log(error);

            this.communityMembershipsStatus = PaginatedResourceStatus.Error;
        }
    }

    *loadSandboxScores(scoreSet: ScoreSet, scoreFilter: ScoreFilter): any {
        this.loadingSandboxScoresStatus = ResourceStatus.Loading;

        try {
            const scoresResponse = yield http.get(
                `/api/profiles/users/${this.currentUserStats?.osuUserId}/stats/${this.currentUserStats?.gamemode}/scores`,
                {
                    params: {
                        score_set: scoreSet,
                        allowed_beatmap_status:
                            scoreFilter.allowedBeatmapStatus,
                        oldest_beatmap_date: scoreFilter.oldestBeatmapDate,
                        newest_beatmap_date: scoreFilter.newestBeatmapDate,
                        oldest_score_date: scoreFilter.oldestScoreDate,
                        newest_score_date: scoreFilter.newestScoreDate,
                        lowest_ar: scoreFilter.lowestAr,
                        highest_ar: scoreFilter.highestAr,
                        lowest_od: scoreFilter.lowestOd,
                        highest_od: scoreFilter.highestOd,
                        lowest_cs: scoreFilter.lowestCs,
                        highest_cs: scoreFilter.highestCs,
                        required_mods_json: scoreFilter.requiredModsJson,
                        disqualified_mods_json: scoreFilter.disqualifiedModsJson,
                        lowest_accuracy: scoreFilter.lowestAccuracy,
                        highest_accuracy: scoreFilter.highestAccuracy,
                        lowest_length: scoreFilter.lowestLength,
                        highest_length: scoreFilter.highestLength,
                    },
                }
            );
            let scores: Score[] = scoresResponse.data.map((data: any) =>
                scoreFromJson(data)
            );

            this.sandboxScores.replace(scores);

            this.loadingSandboxScoresStatus = ResourceStatus.Loaded;

            notify.neutral("Sandbox scores loaded");
        } catch (error: any) {
            console.log(error);

            this.loadingSandboxScoresStatus = ResourceStatus.Error;

            const errorMessage = error.response.data.detail;

            if (errorMessage) {
                notify.negative(
                    `Failed to load sandbox scores: ${errorMessage}`
                );
            } else {
                notify.negative("Failed to load sandbox scores");
            }
        }
    }

    *updateSandboxScore(
        score: Score,
        mods: ModsJson,
        bestCombo: number,
        countOk: number,
        countMeh: number,
        countMiss: number
    ): any {
        const beatmap = score.beatmap!;
        const totalObjects =
            score.statistics["great"] ?? 0 + score.statistics["ok"] ?? 0 + score.statistics["meh"] ?? 0 + score.statistics["miss"] ?? 0;

        score.modsJson = mods;
        score.bestCombo = bestCombo;
        score.statistics["great"] = totalObjects - countOk - countMeh - countMiss;
        score.statistics["ok"] = countOk;
        score.statistics["meh"] = countMeh;
        score.statistics["miss"] = countMiss;

        score.accuracy = calculateClassicAccuracy(
            score.statistics,
            this.currentUserStats!.gamemode
        );
        score.bpm = calculateBpm(beatmap.bpm, score.modsJson);
        score.length = calculateLength(beatmap.drainTime, score.modsJson);
        score.circleSize = calculateCircleSize(
            beatmap.circleSize,
            score.modsJson,
            score.gamemode
        );
        score.approachRate = calculateApproachRate(
            beatmap.approachRate,
            score.modsJson
        );
        score.overallDifficulty = calculateOverallDifficulty(
            beatmap.overallDifficulty,
            score.modsJson
        );
        score.result = getScoreResult(countMiss, bestCombo, beatmap.maxCombo);

        // PP calc
        const beatmapFile = yield flowResult(this.fetchBeatmapFile(beatmap.id));
        const parser = new ojsama.parser().feed(beatmapFile);
        const stars = new ojsama.diff().calc({
            map: parser.map,
            mods: bitmodsFromJsonMods(score.modsJson),
        });
        const pp = ojsama.ppv2({
            stars,
            combo: score.bestCombo,
            n300: score.statistics["great"],
            n100: score.statistics["ok"],
            n50: score.statistics["meh"],
            nmiss: score.statistics["miss"],
        });

        score.difficultyTotal = stars.total;
        score.performanceTotal = pp.total;

        // Sort observable array
        this.sandboxScores.replace(
            this.sandboxScores
                .slice()
                .sort((a, b) => b.performanceTotal - a.performanceTotal)
        );

        notify.neutral("Sandbox scores recalculated");
    }

    *fetchBeatmapFile(beatmapId: number): any {
        // Check idb cache for map and return if found
        const cachedBeatmapData = yield getBeatmap(beatmapId);
        if (cachedBeatmapData) {
            return cachedBeatmapData;
        }

        // Fetch beatmap from server
        const response = yield http.get(`/beatmapfiles/${beatmapId}`);
        const beatmapData = response.data;

        // Save to idb cache
        setBeatmap(beatmapId, beatmapData);

        return beatmapData;
    }
}
