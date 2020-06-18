import { observable, action } from "mobx";

import http from "../../../http";

import { Score } from "../../models/profiles/types";
import { Membership, Leaderboard } from "../../models/leaderboards/types";
import { membershipFromJson, leaderboardFromJson } from "../../models/leaderboards/deserialisers";
import { scoreFromJson } from "../../models/profiles/deserialisers";
import { unchokeForScoreSet } from "../../../utils/osuchan";

export class UserStore {
    @observable leaderboard: Leaderboard | null = null;
    @observable membership: Membership | null = null;
    @observable isLoading: boolean = false;

    readonly scores = observable<Score>([]);

    @action    
    loadUser = async (leaderboardId: number, userId: number) => {
        this.leaderboard = null;
        this.membership = null;
        this.isLoading = true;
        
        try {
            const leaderboardResponse = await http.get(`/api/leaderboards/leaderboards/${leaderboardId}`);
            const leaderboard: Leaderboard = leaderboardFromJson(leaderboardResponse.data);
        
            const membershipResponse = await http.get(`/api/leaderboards/leaderboards/${leaderboardId}/members/${userId}`);
            const membership: Membership = membershipFromJson(membershipResponse.data);
            
            const scoresResponse = await http.get(`/api/leaderboards/leaderboards/${leaderboardId}/members/${userId}/scores`);
            const scores: Score[] = scoresResponse.data.map((data: any) => scoreFromJson(data));

            this.leaderboard = leaderboard;
            this.membership = membership;
            // transform scores into their intended form for abnormal score sets
            this.scores.replace(unchokeForScoreSet(scores, leaderboard.scoreSet));
        } catch (error) {
            console.log(error);
        }

        this.isLoading = false;
    }
}
