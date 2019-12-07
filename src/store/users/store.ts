import axios from "axios";
import { observable, action } from "mobx";

import { UserStats, Score, OsuUser } from "../models/profiles/types";
import { Leaderboard } from "../models/leaderboards/types";
import { userStatsFromJson, scoreFromJson } from "../models/profiles/deserialisers";
import { leaderboardFromJson } from "../models/leaderboards/deserialisers";
import { Gamemode, Mods } from "../models/common/enums";

export class UsersStore {
    @observable currentUserStats: UserStats | null = null;
    @observable scores: Score[] = [];
    @observable leaderboards: Leaderboard[] = [];
    @observable isLoading: boolean = false;

    @action
    loadUser = async (userString: string, gamemode: Gamemode) => {
        this.currentUserStats = null;
        this.scores = [];
        this.leaderboards = [];
        this.isLoading = true;

        try {
            const userStatsResponse = await axios.get(`/api/profiles/users/${userString}/stats/${gamemode}`, {
                params: {
                    "user_id_type": "username"
                }
            });
            const userStats: UserStats = userStatsFromJson(userStatsResponse.data);

            const userId = (userStats.osuUser as OsuUser).id;

            const scoresResponse = await axios.get(`/api/profiles/users/${userId}/stats/${gamemode}/scores`);
            const scores: Score[] = scoresResponse.data.map((data: any) => scoreFromJson(data));

            const leaderboardsResponse = await axios.get(`/api/leaderboards/leaderboards`, {
                params: {
                    "user_id": userId,
                    "gamemode": gamemode
                }
            });
            const leaderboards: Leaderboard[] = leaderboardsResponse.data.map((data: any) => leaderboardFromJson(data));

            this.currentUserStats = userStats;
            this.scores = scores;
            this.leaderboards = leaderboards;
        } catch (error) {
            console.log(error)
        }
        
        this.isLoading = false;
    }
}
