import { observable, action, computed, runInAction } from "mobx";

import http from "../../http";
import notify from "../../notifications";

import { ScoreFilter } from "../models/profiles/types";
import { Invite } from "../models/leaderboards/types";
import { inviteFromJson } from "../models/leaderboards/deserialisers";
import { Gamemode } from "../models/common/enums";
import { User, ScoreFilterPreset } from "../models/users/types";
import { userFromJson, scoreFilterPresetFromJson } from "../models/users/deserialisers";
import { ResourceStatus } from "../status";

export class MeStore {
    @observable user: User | null = null;
    @observable loadingStatus = ResourceStatus.NotLoaded;
    @observable isAddingScores = false;
    @observable isDecliningInvite = false;
    @observable isCreatingScoreFilterPreset = false;
    @observable isUpdatingScoreFilterPreset = false;
    @observable isDeletingScoreFilterPreset = false;

    readonly invites = observable<Invite>([]);
    readonly scoreFilterPresets = observable<ScoreFilterPreset>([]);

    @computed get isAuthenticated() {
        return this.user !== null;
    }

    @action
    loadMe = async () => {
        this.loadingStatus = ResourceStatus.Loading;
        this.user = null;
        this.invites.clear();
        this.scoreFilterPresets.clear();

        try {
            const meResponse = await http.get("/api/users/me");
            const user: User = userFromJson(meResponse.data);

            runInAction(() => {
                this.user = user;
            });

            if (user.osuUser !== null) {
                const invitesResponse = await http.get(`/api/users/me/invites`);
                const invites: Invite[] = invitesResponse.data.map((data: any) => inviteFromJson(data));

                const scoreFilterPresetsResponse = await http.get(`/api/users/me/scorefilterpresets`);
                const scoreFilterPresets: ScoreFilterPreset[] = scoreFilterPresetsResponse.data.map((data: any) => scoreFilterPresetFromJson(data));

                runInAction(() => {
                    this.invites.replace(invites);
                    this.scoreFilterPresets.replace(scoreFilterPresets);

                    this.loadingStatus = ResourceStatus.Loaded;
                });
            }


        } catch (error) {
            console.log(error);

            runInAction(() => {
                this.loadingStatus = ResourceStatus.Error;
            });
        }
    }

    @action
    addScores = async (userId: number, beatmapIds: number[], gamemodeId: Gamemode) => {
        this.isAddingScores = true;

        try {
            await http.post(`/api/profiles/users/${userId}/stats/${gamemodeId}/scores`, {
                "beatmap_ids": beatmapIds
            });

            notify.positive("New scores added");
        } catch (error) {
            console.log(error);

            const errorMessage = error.response.data.detail;

            if (errorMessage) {
                notify.negative(`Failed to add new scores: ${errorMessage}`);
            } else {
                notify.negative("Failed to add new scores");
            }
        }

        runInAction(() => {
            this.isAddingScores = false;
        });
    }

    @action
    declineInvite = async (leaderboardId: number) => {
        this.isDecliningInvite = true;

        try {
            await http.delete(`/api/leaderboards/leaderboards/${leaderboardId}/invites/${this.user!.osuUserId}`);

            runInAction(() => {
                this.invites.replace(this.invites.filter(i => i.leaderboardId !== leaderboardId));
            });

            notify.positive("Invite declined");
        } catch (error) {
            console.log(error);

            const errorMessage = error.response.data.detail;

            if (errorMessage) {
                notify.negative(`Failed to decline invite: ${errorMessage}`);
            } else {
                notify.negative("Failed to decline invite");
            }
        }

        runInAction(() => {
            this.isDecliningInvite = false;
        });
    }

    @action
    createScoreFilterPreset = async (name: string, scoreFilter: ScoreFilter) => {
        this.isCreatingScoreFilterPreset = true;

        try {
            const scoreFilterPresetResponse = await http.post(`/api/users/me/scorefilterpresets`, {
                "name": name,
                "score_filter": {
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

            const scoreFilterPreset = scoreFilterPresetFromJson(scoreFilterPresetResponse.data);

            runInAction(() => {
                this.scoreFilterPresets.push(scoreFilterPreset);
            });

            notify.positive("Score filter preset created");
        } catch (error) {
            console.log(error);

            const errorMessage = error.response.data.detail;

            if (errorMessage) {
                notify.negative(`Failed to create score filter preset: ${errorMessage}`);
            } else {
                notify.negative("Failed to create score filter preset");
            }
        }

        runInAction(() => {
            this.isCreatingScoreFilterPreset = false;
        });
    }

    @action
    updateScoreFilterPreset = async (scoreFilterPresetId: number, name: string, scoreFilter: ScoreFilter) => {
        this.isUpdatingScoreFilterPreset = true;

        try {
            const scoreFilterPresetResponse = await http.put(`/api/users/me/scorefilterpresets/${scoreFilterPresetId}`, {
                "name": name,
                "score_filter": {
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

            const scoreFilterPreset = scoreFilterPresetFromJson(scoreFilterPresetResponse.data);

            runInAction(() => {
                this.scoreFilterPresets.replace(this.scoreFilterPresets.map(preset => preset.id === scoreFilterPresetId ? scoreFilterPreset : preset));
            });

            notify.positive("Score filter preset updated");
        } catch (error) {
            console.log(error);

            const errorMessage = error.response.data.detail;

            if (errorMessage) {
                notify.negative(`Failed to update score filter preset: ${errorMessage}`);
            } else {
                notify.negative("Failed to update score filter preset");
            }
        }

        runInAction(() => {
            this.isUpdatingScoreFilterPreset = false;
        });
    }

    @action
    deleteScoreFilterPreset = async (scoreFilterPresetId: number) => {
        this.isDeletingScoreFilterPreset = true;

        try {
            await http.delete(`/api/users/me/scorefilterpresets/${scoreFilterPresetId}`);

            runInAction(() => {
                this.scoreFilterPresets.replace(this.scoreFilterPresets.filter(preset => preset.id !== scoreFilterPresetId));
            });

            notify.positive("Score filter preset deleted");
        } catch (error) {
            console.log(error);

            const errorMessage = error.response.data.detail;

            if (errorMessage) {
                notify.negative(`Failed to delete score filter preset: ${errorMessage}`);
            } else {
                notify.negative("Failed to delete score filter preset");
            }
        }

        runInAction(() => {
            this.isDeletingScoreFilterPreset = false;
        });
    }
}
