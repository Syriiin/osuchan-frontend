import { observable, action } from "mobx";

import history from "../../../history";
import http from "../../../http";

import { Leaderboard, Membership } from "../../models/leaderboards/types";
import { Score } from "../../models/profiles/types";
import { leaderboardFromJson, membershipFromJson } from "../../models/leaderboards/deserialisers";
import { scoreFromJson } from "../../models/profiles/deserialisers";
import { unchokeForScoreSet } from "../../../utils/osu";
import { notify } from "../../../notifications";

export class DetailStore {
    @observable leaderboard: Leaderboard | null = null;
    @observable isLoading: boolean = false;
    @observable isDeleting: boolean = false;
    @observable isInviting: boolean = false;

    readonly rankings = observable<Membership>([]);
    readonly topScores = observable<Score>([]);

    @action
    loadLeaderboard = async (leaderboardId: number) => {
        this.leaderboard = null;
        this.rankings.clear();
        this.topScores.clear();
        this.isLoading = true;

        try {
            const leaderboardResponse = await http.get(`/api/leaderboards/leaderboards/${leaderboardId}`);
            const leaderboard: Leaderboard = leaderboardFromJson(leaderboardResponse.data);
            
            const membersResponse = await http.get(`/api/leaderboards/leaderboards/${leaderboardId}/members`);
            const members: Membership[] = membersResponse.data.map((data: any) => membershipFromJson(data));
            
            const scoresResponse = await http.get(`/api/leaderboards/leaderboards/${leaderboardId}/scores`);
            const scores: Score[] = scoresResponse.data.map((data: any) => scoreFromJson(data));

            this.leaderboard = leaderboard;
            this.rankings.replace(members);
            // transform scores into their intended form for abnormal score sets
            this.topScores.replace(unchokeForScoreSet(scores, leaderboard.scoreSet));
        } catch (error) {
            console.log(error);
        }

        this.isLoading = false;
    }

    @action
    deleteLeaderboard = async (leaderboardId: number) => {
        this.isDeleting = true;

        try {
            await http.delete(`/api/leaderboards/leaderboards/${leaderboardId}`);

            // Navigate to leaderboard ist page after deletion
            history.push("/leaderboards");

            this.leaderboard = null;
            this.rankings.clear();
            this.topScores.clear();

            notify.positive("Leaderboard deleted");
        } catch (error) {
            console.log(error);

            const errorMessage = error.response.data.detail;

            if (errorMessage) {
                notify.negative(`Failed to delete leaderboard: ${errorMessage}`);
            } else {
                notify.negative("Failed to delete leaderboard");
            }
        }

        this.isDeleting = false;
    }

    @action
    invitePlayers = async (leaderboardId: number, userIds: number[]) => {
        this.isInviting = true;

        try {
            await http.post(`/api/leaderboards/leaderboards/${leaderboardId}/invites`, {
                "user_ids": userIds
            });

            notify.positive("Invitations sent");
        } catch (error) {
            console.log(error);

            const errorMessage = error.response.data.detail;

            if (errorMessage) {
                notify.negative(`Failed to send invitations: ${errorMessage}`);
            } else {
                notify.negative("Failed to send invitations");
            }
        }

        this.isInviting = false;
    }
}
