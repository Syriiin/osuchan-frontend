import { observable, action } from "mobx";

import history from "../../../history";
import http from "../../../http";

import { Leaderboard } from "../../models/leaderboards/types";
import { leaderboardFromJson } from "../../models/leaderboards/deserialisers";
import { ScoreFilter } from "../../models/profiles/types";
import { Gamemode } from "../../models/common/enums";
import { LeaderboardAccessType } from "../../models/leaderboards/enums";
import { ScoreSet } from "../../models/profiles/enums";
import { notify } from "../../../notifications";

export class ListStore {
    @observable isLoading: boolean = false;
    @observable isCreating: boolean = false;
    @observable isLoadingCommunityLeaderboardPage: boolean = false;
    @observable currentCommunityLeaderboardPage: number = 0;
    @observable communityLeaderboardPagesEnded: boolean = false;

    readonly globalLeaderboards = observable<Leaderboard>([]);
    readonly communityLeaderboards = observable<Leaderboard>([]);

    @action
    loadLeaderboards = async (gamemode: Gamemode) => {
        this.globalLeaderboards.clear();
        this.communityLeaderboards.clear();
        this.isLoading = true;
        this.currentCommunityLeaderboardPage = 0;
        this.communityLeaderboardPagesEnded = false;

        try {
            const globalLeaderboardsResponse = await http.get(`/api/leaderboards/leaderboards`, {
                params: {
                    type: "global",
                    gamemode: gamemode
                }
            });
            const globalLeaderboards: Leaderboard[] = globalLeaderboardsResponse.data.map((data: any) => leaderboardFromJson(data));

            const communityLeaderboardsResponse = await http.get(`/api/leaderboards/leaderboards`, {
                params: {
                    type: "community",
                    gamemode: gamemode,
                    page: 1
                }
            });
            const communityLeaderboards: Leaderboard[] = communityLeaderboardsResponse.data.map((data: any) => leaderboardFromJson(data));
            
            this.globalLeaderboards.replace(globalLeaderboards);
            this.communityLeaderboards.replace(communityLeaderboards);
            this.currentCommunityLeaderboardPage = 1
        } catch (error) {
            console.log(error);
        }

        this.isLoading = false;
    }

    @action
    loadNextCommunityLeaderboardPage = async (gamemode: Gamemode) => {
        this.isLoadingCommunityLeaderboardPage = true;

        try {
            const communityLeaderboardsResponse = await http.get(`/api/leaderboards/leaderboards`, {
                params: {
                    type: "community",
                    gamemode: gamemode,
                    page: this.currentCommunityLeaderboardPage + 1
                }
            });
            const communityLeaderboards: Leaderboard[] = communityLeaderboardsResponse.data.map((data: any) => leaderboardFromJson(data));
            
            this.communityLeaderboards.replace(this.communityLeaderboards.concat(communityLeaderboards));
            this.currentCommunityLeaderboardPage += 1
        } catch (error) {
            console.log(error);

            this.communityLeaderboardPagesEnded = true;
        }

        this.isLoadingCommunityLeaderboardPage = false;
    }

    @action
    createLeaderboard = async (gamemode: Gamemode, scoreSet: ScoreSet, accessType: LeaderboardAccessType, name: string, description: string, allowPastScores: boolean, scoreFilter: ScoreFilter) => {
        this.isCreating = true;

        try {
            const leaderboardResponse = await http.post(`/api/leaderboards/leaderboards`, {
                "gamemode": gamemode,
                "score_set": scoreSet,
                "access_type": accessType,
                "name": name,
                "description": description,
                "allow_past_scores": allowPastScores,
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
            const leaderboard: Leaderboard = leaderboardFromJson(leaderboardResponse.data);

            this.communityLeaderboards.push(leaderboard);

            // Navigate to leaderboard page after creation
            history.push(`/leaderboards/${leaderboard.id}`);

            notify.positive("Leaderboard created");
        } catch (error) {
            console.log(error);

            const errorMessage = error.response.data.detail;

            if (errorMessage) {
                notify.negative(`Failed to create leaderboard: ${errorMessage}`);
            } else {
                notify.negative("Failed to create leaderboard");
            }
        }

        this.isCreating = false;
    }
}
