import axios from "axios";
import Cookies from "js-cookie";
import { observable, action } from "mobx";

import history from "../../../history";

import { Leaderboard } from "../../models/leaderboards/types";
import { leaderboardFromJson } from "../../models/leaderboards/deserialisers";

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
    createLeaderboard = async (leaderboardData: Partial<Leaderboard>) => {
        this.isCreating = true;

        try {
            const leaderboardResponse = await axios.post(`/api/leaderboards/leaderboards`, {
                "gamemode": leaderboardData.gamemode,
                "access_type": leaderboardData.accessType,
                "name": leaderboardData.name,
                "description": leaderboardData.description,
                "allow_past_scores": leaderboardData.allowPastScores,
                "allowed_beatmap_status": leaderboardData.allowedBeatmapStatus,
                "oldest_beatmap_date": leaderboardData.oldestBeatmapDate,
                "newest_beatmap_date": leaderboardData.newestBeatmapDate,
                "oldest_score_date": leaderboardData.oldestScoreDate,
                "newest_score_date": leaderboardData.newestScoreDate,
                "lowest_ar": leaderboardData.lowestAr,
                "highest_ar": leaderboardData.highestAr,
                "lowest_od": leaderboardData.lowestOd,
                "highest_od": leaderboardData.highestOd,
                "lowest_cs": leaderboardData.lowestCs,
                "highest_cs": leaderboardData.highestCs,
                "required_mods": leaderboardData.requiredMods,
                "disqualified_mods": leaderboardData.disqualifiedMods,
                "lowest_accuracy": leaderboardData.lowestAccuracy,
                "highest_accuracy": leaderboardData.highestAccuracy
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
