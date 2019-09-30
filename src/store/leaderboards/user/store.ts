import axios from "axios";
import { observable, action } from "mobx";

import { Score } from "../../models/profiles/types";
import { Membership } from "../../models/leaderboards/types";
import { membershipFromJson } from "../../models/leaderboards/deserialisers";
import { scoreFromJson } from "../../models/profiles/deserialisers";

export class UserStore {
    @observable membership: Membership | null = null;
    @observable scores: Score[] = [];
    @observable isLoading: boolean = false;

    @action    
    loadUser = async (leaderboardId: number, userId: number) => {
        this.isLoading = true;
        
        try {
            const membershipResponse = await axios.get(`/api/leaderboards/leaderboards/${leaderboardId}/members/${userId}`);
            const membership: Membership = membershipFromJson(membershipResponse.data);
            
            const scoresResponse = await axios.get(`/api/leaderboards/leaderboards/${leaderboardId}/members/${userId}/scores`);
            const scores: Score[] = scoresResponse.data.map((data: any) => scoreFromJson(data));

            this.membership = membership;
            this.scores = scores;
        } catch (error) {
            console.log(error);
        }

        this.isLoading = false;
    }
}
