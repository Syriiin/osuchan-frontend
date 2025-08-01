import { observable, makeAutoObservable, flow } from "mobx";

import http from "../../http";
import notify from "../../notifications";

import { ScoreFilter } from "../models/profiles/types";
import { Invite } from "../models/leaderboards/types";
import { inviteFromJson } from "../models/leaderboards/deserialisers";
import { Gamemode } from "../models/common/enums";
import { User, ScoreFilterPreset } from "../models/users/types";
import {
    userFromJson,
    scoreFilterPresetFromJson,
} from "../models/users/deserialisers";
import { ResourceStatus } from "../status";

export class MeStore {
    user: User | null = null;
    loadingStatus = ResourceStatus.NotLoaded;
    isAddingScores = false;
    isDecliningInvite = false;
    isCreatingScoreFilterPreset = false;
    isUpdatingScoreFilterPreset = false;
    isDeletingScoreFilterPreset = false;

    readonly invites = observable<Invite>([]);
    readonly scoreFilterPresets = observable<ScoreFilterPreset>([]);

    constructor() {
        makeAutoObservable(this, {
            loadMe: flow,
            addScores: flow,
            declineInvite: flow,
            createScoreFilterPreset: flow,
            updateScoreFilterPreset: flow,
            deleteScoreFilterPreset: flow,
        });
    }

    get isAuthenticated() {
        return this.user !== null;
    }

    *loadMe(): any {
        this.loadingStatus = ResourceStatus.Loading;
        this.user = null;
        this.invites.clear();
        this.scoreFilterPresets.clear();

        try {
            const meResponse = yield http.get("/api/users/me");
            const user: User = userFromJson(meResponse.data);

            this.user = user;

            if (user.osuUser !== null) {
                const invitesResponse = yield http.get(`/api/users/me/invites`);
                const invites: Invite[] = invitesResponse.data.map(
                    (data: any) => inviteFromJson(data)
                );

                const scoreFilterPresetsResponse = yield http.get(
                    `/api/users/me/scorefilterpresets`
                );
                const scoreFilterPresets: ScoreFilterPreset[] =
                    scoreFilterPresetsResponse.data.map((data: any) =>
                        scoreFilterPresetFromJson(data)
                    );

                this.invites.replace(invites);
                this.scoreFilterPresets.replace(scoreFilterPresets);

                this.loadingStatus = ResourceStatus.Loaded;
            }
        } catch (error: any) {
            console.log(error);

            this.loadingStatus = ResourceStatus.Error;
        }
    }

    *addScores(userId: number, beatmapIds: number[], gamemodeId: Gamemode) {
        this.isAddingScores = true;

        try {
            yield http.post(
                `/api/profiles/users/${userId}/stats/${gamemodeId}/scores`,
                {
                    beatmap_ids: beatmapIds,
                }
            );

            notify.positive("New scores added");
        } catch (error: any) {
            console.log(error);

            const errorMessage = error.response.data.detail;

            if (errorMessage) {
                notify.negative(`Failed to add new scores: ${errorMessage}`);
            } else {
                notify.negative("Failed to add new scores");
            }
        }

        this.isAddingScores = false;
    }

    *declineInvite(leaderboardId: number) {
        this.isDecliningInvite = true;

        try {
            yield http.delete(
                `/api/leaderboards/leaderboards/${leaderboardId}/invites/${
                    this.user!.osuUserId
                }`
            );

            this.invites.replace(
                this.invites.filter((i) => i.leaderboardId !== leaderboardId)
            );

            notify.positive("Invite declined");
        } catch (error: any) {
            console.log(error);

            const errorMessage = error.response.data.detail;

            if (errorMessage) {
                notify.negative(`Failed to decline invite: ${errorMessage}`);
            } else {
                notify.negative("Failed to decline invite");
            }
        }

        this.isDecliningInvite = false;
    }

    *createScoreFilterPreset(name: string, scoreFilter: ScoreFilter): any {
        this.isCreatingScoreFilterPreset = true;

        try {
            const scoreFilterPresetResponse = yield http.post(
                `/api/users/me/scorefilterpresets`,
                {
                    name: name,
                    score_filter: {
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

            const scoreFilterPreset = scoreFilterPresetFromJson(
                scoreFilterPresetResponse.data
            );

            this.scoreFilterPresets.push(scoreFilterPreset);

            notify.positive("Score filter preset created");
        } catch (error: any) {
            console.log(error);

            const errorMessage = error.response.data.detail;

            if (errorMessage) {
                notify.negative(
                    `Failed to create score filter preset: ${errorMessage}`
                );
            } else {
                notify.negative("Failed to create score filter preset");
            }
        }

        this.isCreatingScoreFilterPreset = false;
    }

    *updateScoreFilterPreset(
        scoreFilterPresetId: number,
        name: string,
        scoreFilter: ScoreFilter
    ): any {
        this.isUpdatingScoreFilterPreset = true;

        try {
            const scoreFilterPresetResponse = yield http.put(
                `/api/users/me/scorefilterpresets/${scoreFilterPresetId}`,
                {
                    name: name,
                    score_filter: {
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

            const scoreFilterPreset = scoreFilterPresetFromJson(
                scoreFilterPresetResponse.data
            );

            this.scoreFilterPresets.replace(
                this.scoreFilterPresets.map((preset) =>
                    preset.id === scoreFilterPresetId
                        ? scoreFilterPreset
                        : preset
                )
            );

            notify.positive("Score filter preset updated");
        } catch (error: any) {
            console.log(error);

            const errorMessage = error.response.data.detail;

            if (errorMessage) {
                notify.negative(
                    `Failed to update score filter preset: ${errorMessage}`
                );
            } else {
                notify.negative("Failed to update score filter preset");
            }
        }

        this.isUpdatingScoreFilterPreset = false;
    }

    *deleteScoreFilterPreset(scoreFilterPresetId: number) {
        this.isDeletingScoreFilterPreset = true;

        try {
            yield http.delete(
                `/api/users/me/scorefilterpresets/${scoreFilterPresetId}`
            );

            this.scoreFilterPresets.replace(
                this.scoreFilterPresets.filter(
                    (preset) => preset.id !== scoreFilterPresetId
                )
            );

            notify.positive("Score filter preset deleted");
        } catch (error: any) {
            console.log(error);

            const errorMessage = error.response.data.detail;

            if (errorMessage) {
                notify.negative(
                    `Failed to delete score filter preset: ${errorMessage}`
                );
            } else {
                notify.negative("Failed to delete score filter preset");
            }
        }

        this.isDeletingScoreFilterPreset = false;
    }
}
