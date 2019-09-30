import axios from "axios";
import Cookies from "js-cookie";
import { observable, action } from "mobx";

import { OsuUser } from "../models/profiles/types";
import { Invite, Membership, Leaderboard } from "../models/leaderboards/types";
import { osuUserFromJson } from "../models/profiles/deserialisers";
import { inviteFromJson, membershipFromJson } from "../models/leaderboards/deserialisers";

export class MeStore {
    @observable osuUser: OsuUser | null = null;
    @observable memberships: Membership[] = [];
    @observable invites: Invite[] = [];
    @observable isLoading: boolean = false;
    @observable isJoiningLeaderboard: boolean = false;
    @observable isAddingScores: boolean = false;
    @observable isLeavingLeaderboard: boolean = false;

    @action
    loadMe = async () => {
        this.osuUser = null;
        this.memberships = [];
        this.invites = [];
        this.isLoading = true;

        try {
            const meResponse = await axios.get("/osuauth/me");
            const osuUser: OsuUser = osuUserFromJson(meResponse.data);

            const membershipsResponse = await axios.get(`/api/profiles/users/${osuUser.id}/memberships`);
            const memberships: Membership[] = membershipsResponse.data.map((data: any) => membershipFromJson(data));
            
            const invitesResponse = await axios.get(`/api/profiles/users/${osuUser.id}/invites`);
            const invites: Invite[] = invitesResponse.data.map((data: any) => inviteFromJson(data));

            this.osuUser = osuUser;
            this.memberships = memberships;
            this.invites = invites;
        } catch (error) {
            console.log(error)
        }
        
        this.isLoading = false;
    }

    @action
    addScores = async (userId: number, beatmapIds: number[], gamemodeId: number) => {
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

            this.memberships = this.memberships.filter(m => (m.leaderboard as Leaderboard).id !== leaderboardId);
        } catch (error) {
            console.log(error);
        }
        
        this.isLeavingLeaderboard = false;
    }
}
