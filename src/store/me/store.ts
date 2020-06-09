import axios from "axios";
import Cookies from "js-cookie";
import { observable, action } from "mobx";

import { OsuUser, ScoreFilter } from "../models/profiles/types";
import { Invite, Membership } from "../models/leaderboards/types";
import { osuUserFromJson } from "../models/profiles/deserialisers";
import { inviteFromJson, membershipFromJson } from "../models/leaderboards/deserialisers";
import { Gamemode } from "../models/common/enums";
import { ScoreFilterPreset } from "../models/users/types";
import { scoreFilterPresetFromJson } from "../models/users/deserialisers";

export class MeStore {
    @observable osuUser: OsuUser | null = null;
    @observable memberships: Membership[] = [];
    @observable invites: Invite[] = [];
    @observable isLoading: boolean = false;
    @observable isJoiningLeaderboard: boolean = false;
    @observable isAddingScores: boolean = false;
    @observable isLeavingLeaderboard: boolean = false;
    @observable isCreatingScoreFilterPreset: boolean = false;
    @observable isUpdatingScoreFilterPreset: boolean = false;
    @observable isDeletingScoreFilterPreset: boolean = false;

    readonly scoreFilterPresets = observable<ScoreFilterPreset>([]);

    @action
    loadMe = async () => {
        this.osuUser = null;
        this.memberships = [];
        this.invites = [];
        this.scoreFilterPresets.clear();
        this.isLoading = true;

        try {
            const meResponse = await axios.get("/osuauth/me");
            const osuUser: OsuUser = osuUserFromJson(meResponse.data);

            const membershipsResponse = await axios.get(`/api/profiles/users/${osuUser.id}/memberships`);
            const memberships: Membership[] = membershipsResponse.data.map((data: any) => membershipFromJson(data));
            
            const invitesResponse = await axios.get(`/api/profiles/users/${osuUser.id}/invites`);
            const invites: Invite[] = invitesResponse.data.map((data: any) => inviteFromJson(data));

            const scoreFilterPresetsResponse = await axios.get(`/osuauth/me/scorefilterpresets`);
            const scoreFilterPresets: ScoreFilterPreset[] = scoreFilterPresetsResponse.data.map((data: any) => scoreFilterPresetFromJson(data));

            this.osuUser = osuUser;
            this.memberships = memberships;
            this.invites = invites;
            this.scoreFilterPresets.replace(scoreFilterPresets);
        } catch (error) {
            console.log(error)
        }
        
        this.isLoading = false;
    }

    @action
    addScores = async (userId: number, beatmapIds: number[], gamemodeId: Gamemode) => {
        this.isAddingScores = true;

        try {
            await axios.post(`/api/profiles/users/${userId}/stats/${gamemodeId}/scores`, {
                "beatmap_ids": beatmapIds
            }, {
                headers: {
                    "X-CSRFToken": Cookies.get("csrftoken")
                }
            });
        } catch (error) {
            console.log(error);
        }
        
        this.isAddingScores = false;
    }

    @action
    joinLeaderboard = async (leaderboardId: number) => {
        this.isJoiningLeaderboard = true;

        try {
            const membershipResponse = await axios.post(`/api/leaderboards/leaderboards/${leaderboardId}/members`, {}, {
                headers: {
                    "X-CSRFToken": Cookies.get("csrftoken")
                }
            });
            const membership = membershipFromJson(membershipResponse.data);
            
            this.memberships.push(membership);
        } catch (error) {
            console.log(error);
        }
        
        this.isJoiningLeaderboard = false;
    }

    @action
    leaveLeaderboard = async (leaderboardId: number) => {
        this.isLeavingLeaderboard = true;

        try {
            await axios.delete(`/api/leaderboards/leaderboards/${leaderboardId}/members/${this.osuUser!.id}`, {
                headers: {
                    "X-CSRFToken": Cookies.get("csrftoken")
                }
            });

            this.memberships = this.memberships.filter(m => m.leaderboardId !== leaderboardId);
        } catch (error) {
            console.log(error);
        }
        
        this.isLeavingLeaderboard = false;
    }

    @action
    createScoreFilterPreset = async (name: string, scoreFilter: ScoreFilter) => {
        this.isCreatingScoreFilterPreset = true;

        try {
            const scoreFilterPresetResponse = await axios.post(`/osuauth/me/scorefilterpresets`, {
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
                    "highest_accuracy": scoreFilter.highestAccuracy
                }
            }, {
                headers: {
                    "X-CSRFToken": Cookies.get("csrftoken")
                }
            });

            const scoreFilterPreset = scoreFilterPresetFromJson(scoreFilterPresetResponse.data);

            this.scoreFilterPresets.push(scoreFilterPreset);
        } catch (error) {
            console.log(error);
        }

        this.isCreatingScoreFilterPreset = false;
    }

    @action
    updateScoreFilterPreset = async (scoreFilterPresetId: number, name: string, scoreFilter: ScoreFilter) => {
        this.isUpdatingScoreFilterPreset = true;

        try {
            const scoreFilterPresetResponse = await axios.put(`/osuauth/me/scorefilterpresets/${scoreFilterPresetId}`, {
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
                    "highest_accuracy": scoreFilter.highestAccuracy
                }
            }, {
                headers: {
                    "X-CSRFToken": Cookies.get("csrftoken")
                }
            });

            const scoreFilterPreset = scoreFilterPresetFromJson(scoreFilterPresetResponse.data);

            this.scoreFilterPresets.replace(this.scoreFilterPresets.map(preset => preset.id === scoreFilterPresetId ? scoreFilterPreset : preset));
        } catch (error) {
            console.log(error);
        }

        this.isUpdatingScoreFilterPreset = false;
    }

    @action
    deleteScoreFilterPreset = async (scoreFilterPresetId: number) => {
        this.isDeletingScoreFilterPreset = true;

        try {
            await axios.delete(`/osuauth/me/scorefilterpresets/${scoreFilterPresetId}`, {
                headers: {
                    "X-CSRFToken": Cookies.get("csrftoken")
                }
            });

            this.scoreFilterPresets.replace(this.scoreFilterPresets.filter(preset => preset.id !== scoreFilterPresetId));
        } catch (error) {
            console.log(error);
        }

        this.isDeletingScoreFilterPreset = false;
    }
}
