import axios from "axios";
import Cookies from "js-cookie";
import { observable, action } from "mobx";

import history from "../../../history";

import { Leaderboard } from "../../models/leaderboards/types";
import { leaderboardFromJson } from "../../models/leaderboards/deserialisers";
import { ScoreFilter } from "../../models/profiles/types";
import { Gamemode } from "../../models/common/enums";
import { LeaderboardAccessType } from "../../models/leaderboards/enums";
import { ScoreSet } from "../../models/profiles/enums";

export class ListStore {
    @observable leaderboards: Leaderboard[] = [];
    @observable isLoading: boolean = false;
    @observable isCreating: boolean = false;

    @action
    loadLeaderboards = async () => {
        this.leaderboards = [];
        this.isLoading = true;

        try {
            const leaderboardsResponse = await axios.get(`/api/leaderboards/leaderboards`);
            const leaderboards: Leaderboard[] = leaderboardsResponse.data.map((data: any) => leaderboardFromJson(data));

            this.leaderboards = leaderboards;
        } catch (error) {
            console.log(error)
        }

        this.isLoading = false;
    }

    @action
    createLeaderboard = async (gamemode: Gamemode, scoreSet: ScoreSet, accessType: LeaderboardAccessType, name: string, description: string, allowPastScores: boolean, scoreFilter: ScoreFilter) => {
        this.isCreating = true;

        try {
            const leaderboardResponse = await axios.post(`/api/leaderboards/leaderboards`, {
                "gamemode": gamemode,
                "score_set": scoreSet,
                "access_type": accessType,
                "name": name,
                "description": description,
                "allow_past_scores": allowPastScores,
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
            }, {
                headers: {
                    "X-CSRFToken": Cookies.get("csrftoken")
                }
            });
            const leaderboard: Leaderboard = leaderboardFromJson(leaderboardResponse.data);

            this.leaderboards.push(leaderboard);

            // Navigate to leaderboard page after creation
            history.push(`/leaderboards/${leaderboard.id}`);
        } catch (error) {
            console.log(error)
        }

        this.isCreating = false;
    }
}
