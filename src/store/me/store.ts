import { observable, action } from "mobx";

import http from "../../http";

import { ScoreFilter } from "../models/profiles/types";
import { Invite, Membership } from "../models/leaderboards/types";
import { inviteFromJson, membershipFromJson } from "../models/leaderboards/deserialisers";
import { Gamemode } from "../models/common/enums";
import { User, ScoreFilterPreset } from "../models/users/types";
import { userFromJson, scoreFilterPresetFromJson } from "../models/users/deserialisers";
import { notify } from "../../notifications";

export class MeStore {
    @observable user: User | null = null;
    @observable isLoading: boolean = false;
    @observable isAddingScores: boolean = false;
    @observable isJoiningLeaderboard: boolean = false;
    @observable isLeavingLeaderboard: boolean = false;
    @observable isDecliningInvite: boolean = false;
    @observable isCreatingScoreFilterPreset: boolean = false;
    @observable isUpdatingScoreFilterPreset: boolean = false;
    @observable isDeletingScoreFilterPreset: boolean = false;

    readonly memberships = observable<Membership>([]);
    readonly invites = observable<Invite>([]);
    readonly scoreFilterPresets = observable<ScoreFilterPreset>([]);

    @action
    loadMe = async () => {
        this.user = null;
        this.memberships.clear();
        this.invites.clear();
        this.scoreFilterPresets.clear();
        this.isLoading = true;

        try {
            const meResponse = await http.get("/api/users/me");
            const user: User = userFromJson(meResponse.data);

            this.user = user;

            if (user.osuUser !== null) {
                const membershipsResponse = await http.get(`/api/profiles/users/${user.osuUser.id}/memberships`);
                const memberships: Membership[] = membershipsResponse.data.map((data: any) => membershipFromJson(data));

                const invitesResponse = await http.get(`/api/profiles/users/${user.osuUser.id}/invites`);
                const invites: Invite[] = invitesResponse.data.map((data: any) => inviteFromJson(data));

                const scoreFilterPresetsResponse = await http.get(`/api/users/me/scorefilterpresets`);
                const scoreFilterPresets: ScoreFilterPreset[] = scoreFilterPresetsResponse.data.map((data: any) => scoreFilterPresetFromJson(data));

                this.memberships.replace(memberships);
                this.invites.replace(invites);
                this.scoreFilterPresets.replace(scoreFilterPresets);
            }


        } catch (error) {
            console.log(error);
        }

        this.isLoading = false;
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

        this.isAddingScores = false;
    }

    @action
    joinLeaderboard = async (leaderboardId: number) => {
        this.isJoiningLeaderboard = true;

        try {
            const membershipResponse = await http.post(`/api/leaderboards/leaderboards/${leaderboardId}/members`);
            const membership = membershipFromJson(membershipResponse.data);

            this.memberships.push(membership);

            notify.positive("Leaderboard joined");
        } catch (error) {
            console.log(error);

            const errorMessage = error.response.data.detail;

            if (errorMessage) {
                notify.negative(`Failed to join leaderboard: ${errorMessage}`);
            } else {
                notify.negative("Failed to join leaderboard");
            }
        }

        this.isJoiningLeaderboard = false;
    }

    @action
    leaveLeaderboard = async (leaderboardId: number) => {
        this.isLeavingLeaderboard = true;

        try {
            await http.delete(`/api/leaderboards/leaderboards/${leaderboardId}/members/${this.user!.osuUserId}`);

            this.memberships.replace(this.memberships.filter(m => m.leaderboardId !== leaderboardId));

            notify.positive("Leaderboard left");
        } catch (error) {
            console.log(error);

            const errorMessage = error.response.data.detail;

            if (errorMessage) {
                notify.negative(`Failed to leave leaderboard: ${errorMessage}`);
            } else {
                notify.negative("Failed to leave leaderboard");
            }
        }

        this.isLeavingLeaderboard = false;
    }

    @action
    declineInvite = async (leaderboardId: number) => {
        this.isDecliningInvite = true;

        try {
            await http.delete(`/api/leaderboards/leaderboards/${leaderboardId}/invites/${this.user!.osuUserId}`);

            this.invites.replace(this.invites.filter(i => i.leaderboardId !== leaderboardId));

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

        this.isDecliningInvite = false;
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

            this.scoreFilterPresets.push(scoreFilterPreset);

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

        this.isCreatingScoreFilterPreset = false;
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

            this.scoreFilterPresets.replace(this.scoreFilterPresets.map(preset => preset.id === scoreFilterPresetId ? scoreFilterPreset : preset));

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

        this.isUpdatingScoreFilterPreset = false;
    }

    @action
    deleteScoreFilterPreset = async (scoreFilterPresetId: number) => {
        this.isDeletingScoreFilterPreset = true;

        try {
            await http.delete(`/api/users/me/scorefilterpresets/${scoreFilterPresetId}`);

            this.scoreFilterPresets.replace(this.scoreFilterPresets.filter(preset => preset.id !== scoreFilterPresetId));

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

        this.isDeletingScoreFilterPreset = false;
    }
}
