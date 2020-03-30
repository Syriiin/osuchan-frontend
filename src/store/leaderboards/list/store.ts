import axios from "axios";
import Cookies from "js-cookie";
import { observable, action } from "mobx";

import history from "../../../history";

import { Leaderboard } from "../../models/leaderboards/types";
import { leaderboardFromJson } from "../../models/leaderboards/deserialisers";
import { ScoreFilter } from "../../models/profiles/types";

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
    createLeaderboard = async (leaderboardData: Partial<Leaderboard>, scoreFilterData: Partial<ScoreFilter>) => {
        this.isCreating = true;

        try {
            const leaderboardResponse = await axios.post(`/api/leaderboards/leaderboards`, {
                "gamemode": leaderboardData.gamemode,
                "access_type": leaderboardData.accessType,
                "name": leaderboardData.name,
                "description": leaderboardData.description,
                "allow_past_scores": leaderboardData.allowPastScores,
                "allowed_beatmap_status": scoreFilterData.allowedBeatmapStatus,
                "oldest_beatmap_date": scoreFilterData.oldestBeatmapDate,
                "newest_beatmap_date": scoreFilterData.newestBeatmapDate,
                "oldest_score_date": scoreFilterData.oldestScoreDate,
                "newest_score_date": scoreFilterData.newestScoreDate,
                "lowest_ar": scoreFilterData.lowestAr,
                "highest_ar": scoreFilterData.highestAr,
                "lowest_od": scoreFilterData.lowestOd,
                "highest_od": scoreFilterData.highestOd,
                "lowest_cs": scoreFilterData.lowestCs,
                "highest_cs": scoreFilterData.highestCs,
                "required_mods": scoreFilterData.requiredMods,
                "disqualified_mods": scoreFilterData.disqualifiedMods,
                "lowest_accuracy": scoreFilterData.lowestAccuracy,
                "highest_accuracy": scoreFilterData.highestAccuracy
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
