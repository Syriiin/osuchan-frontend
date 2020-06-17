import { observable, action } from "mobx";

import http from "../../../http";

import { Leaderboard, Invite } from "../../models/leaderboards/types";
import { leaderboardFromJson, inviteFromJson } from "../../models/leaderboards/deserialisers";
import { notify } from "../../../notifications";

export class InvitesStore {
    @observable leaderboard: Leaderboard | null = null;
    @observable isLoading: boolean = false;
    @observable isDeleting: boolean = false;
    @observable isInviting: boolean = false;
    @observable isCancellingInvite: boolean = false;

    readonly invites = observable<Invite>([]);

    @action
    loadInvites = async (leaderboardId: number) => {
        this.leaderboard = null;
        this.invites.clear();
        this.isLoading = true;

        try {
            const leaderboardResponse = await http.get(`/api/leaderboards/leaderboards/${leaderboardId}`);
            const leaderboard: Leaderboard = leaderboardFromJson(leaderboardResponse.data);
            
            const invitesResponse = await http.get(`/api/leaderboards/leaderboards/${leaderboardId}/invites`);
            const invites: Invite[] = invitesResponse.data.map((data: any) => inviteFromJson(data));
            
            this.leaderboard = leaderboard;
            this.invites.replace(invites);
        } catch (error) {
            console.log(error);
        }

        this.isLoading = false;
    }

    @action
    invitePlayers = async (leaderboardId: number, userIds: number[], message: string) => {
        this.isInviting = true;

        try {
            const invitesResponse = await http.post(`/api/leaderboards/leaderboards/${leaderboardId}/invites`, {
                "user_ids": userIds,
                "message": message
            });

            const invites: Invite[] = invitesResponse.data.map((data: any) => inviteFromJson(data));

            console.log(invites);

            this.invites.replace(this.invites.concat(invites));
            
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

    @action
    cancelInvite = async (leaderboardId: number, userId: number) => {
        this.isCancellingInvite = true;

        try {
            await http.delete(`/api/leaderboards/leaderboards/${leaderboardId}/invites/${userId}`);

            this.invites.replace(this.invites.filter(i => i.osuUserId !== userId));

            notify.positive("Invite cancelled");
        } catch (error) {
            console.log(error);

            const errorMessage = error.response.data.detail;

            if (errorMessage) {
                notify.negative(`Failed to cancel invite: ${errorMessage}`);
            } else {
                notify.negative("Failed to cancel invite");
            }
        }

        this.isCancellingInvite = false;
    }
}
