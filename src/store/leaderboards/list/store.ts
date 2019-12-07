import axios from "axios";
import Cookies from "js-cookie";
import { observable, action } from "mobx";

import history from "../../../history";

import { Leaderboard } from "../../models/leaderboards/types";
import { leaderboardFromJson } from "../../models/leaderboards/deserialisers";
import { AllowedBeatmapStatus, LeaderboardAccessType } from "../../models/leaderboards/enums";
import { Gamemode, Mods } from "../../models/common/enums";

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
    createLeaderboard = async (
        gamemode: Gamemode,
        accessType: LeaderboardAccessType,
        name: string,
        description: string,
        allowPastScores: boolean | null,
        allowedBeatmapStatus: AllowedBeatmapStatus,
        oldestBeatmapDate: Date | null,
        newestBeatmapDate: Date | null,
        oldestScoreDate: Date | null,
        newestScoreDate: Date | null,
        lowestAr: number | null,
        highestAr: number | null,
        lowestOd: number | null,
        highestOd: number | null,
        lowestCs: number | null,
        highestCs: number | null,
        requiredMods: Mods,
        disqualifiedMods: Mods,
        lowestAccuracy: number | null,
        highestAccuracy: number | null
    ) => {
        this.isCreating = true;

        try {
            const leaderboardResponse = await axios.post(`/api/leaderboards/leaderboards`, {
                "gamemode": gamemode,
                "access_type": accessType,
                "name": name,
                "description": description,
                "allow_past_scores": allowPastScores,
                "allowed_beatmap_status": allowedBeatmapStatus,
                "oldest_beatmap_date": oldestBeatmapDate,
                "newest_beatmap_date": newestBeatmapDate,
                "oldest_score_date": oldestScoreDate,
                "newest_score_date": newestScoreDate,
                "lowest_ar": lowestAr,
                "highest_ar": highestAr,
                "lowest_od": lowestOd,
                "highest_od": highestOd,
                "lowest_cs": lowestCs,
                "highest_cs": highestCs,
                "required_mods": requiredMods,
                "disqualified_mods": disqualifiedMods,
                "lowest_accuracy": lowestAccuracy,
                "highest_accuracy": highestAccuracy
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
