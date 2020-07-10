import { observable, action, runInAction } from "mobx";

import history from "../../../history";
import http from "../../../http";
import notify from "../../../notifications";

import { Leaderboard, Membership, Invite } from "../../models/leaderboards/types";
import { Score } from "../../models/profiles/types";
import { leaderboardFromJson, membershipFromJson, inviteFromJson } from "../../models/leaderboards/deserialisers";
import { scoreFromJson } from "../../models/profiles/deserialisers";
import { unchokeForScoreSet } from "../../../utils/osuchan";
import { Gamemode } from "../../models/common/enums";

export class DetailStore {
    @observable leaderboardType: string | null = null;
    @observable gamemode: Gamemode | null = null;
    @observable leaderboardId: number | null = null;
    @observable leaderboard: Leaderboard | null = null;
    @observable userMembership: Membership | null = null;
    @observable membership: Membership | null = null;
    @observable isLoading: boolean = false;
    @observable isDeleting: boolean = false;
    @observable isLoadingInvites: boolean = false;
    @observable isInviting: boolean = false;
    @observable isCancellingInvite: boolean = false;
    @observable isLoadingMembership: boolean = false;
    @observable isJoiningLeaderboard: boolean = false;
    @observable isLeavingLeaderboard: boolean = false;

    readonly rankings = observable<Membership>([]);
    readonly leaderboardScores = observable<Score>([]);
    readonly invites = observable<Invite>([]);
    readonly membershipScores = observable<Score>([]);

    get resourceUrl(): string {
        return `/api/leaderboards/${this.leaderboardType}/${this.gamemode}/${this.leaderboardId}`;
    }

    @action
    loadLeaderboard = async (leaderboardType: string, gamemode: Gamemode, leaderboardId: number) => {
        this.leaderboardType = leaderboardType;
        this.gamemode = gamemode;
        this.leaderboardId = leaderboardId;
        this.leaderboard = null;
        this.userMembership = null;
        this.rankings.clear();
        this.leaderboardScores.clear();
        this.isLoading = true;

        try {
            const leaderboardResponse = await http.get(this.resourceUrl);
            const leaderboard: Leaderboard = leaderboardFromJson(leaderboardResponse.data);

            const membersResponse = await http.get(`${this.resourceUrl}/members`);
            const members: Membership[] = membersResponse.data.map((data: any) => membershipFromJson(data));
            
            const scoresResponse = await http.get(`${this.resourceUrl}/scores`);
            const scores: Score[] = scoresResponse.data.map((data: any) => scoreFromJson(data));

            runInAction(() => {
                this.leaderboard = leaderboard;
                this.rankings.replace(members);
                // transform scores into their intended form for abnormal score sets
                this.leaderboardScores.replace(unchokeForScoreSet(scores, leaderboard.scoreSet));
            });
        } catch (error) {
            console.log(error);
        }

        runInAction(() => {
            this.isLoading = false;
        });
    }

    @action
    loadUserMembership = async (userId: number) => {
        this.userMembership = null;

        try {
            const membershipResponse = await http.get(`${this.resourceUrl}/members/${userId}`);
            const membership = membershipFromJson(membershipResponse.data);

            runInAction(() => {
                this.userMembership = membership;
            });
        } catch (error) {
            console.log(error);
        }
    }

    @action
    reloadLeaderboard = async () => this.loadLeaderboard(this.leaderboardType!, this.gamemode!, this.leaderboardId!);

    @action
    deleteLeaderboard = async () => {
        this.isDeleting = true;

        try {
            await http.delete(this.resourceUrl);

            // Navigate to leaderboard list page after deletion
            history.push(`/leaderboards/community/${this.gamemode}`);

            runInAction(() => {
                this.leaderboard = null;
                this.rankings.clear();
                this.leaderboardScores.clear();
            });

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

        runInAction(() => {
            this.isDeleting = false;
        });
    }

    @action
    loadInvites = async () => {
        this.invites.clear();
        this.isLoadingInvites = true;

        try {
            const invitesResponse = await http.get(`${this.resourceUrl}/invites`);
            const invites: Invite[] = invitesResponse.data.map((data: any) => inviteFromJson(data));
            
            runInAction(() => {
                this.invites.replace(invites);
            });
        } catch (error) {
            console.log(error);
        }

        runInAction(() => {
            this.isLoadingInvites = false;
        });
    }

    @action
    invitePlayers = async (userIds: number[], message: string) => {
        this.isInviting = true;

        try {
            const invitesResponse = await http.post(`${this.resourceUrl}/invites`, {
                "user_ids": userIds,
                "message": message
            });

            const invites: Invite[] = invitesResponse.data.map((data: any) => inviteFromJson(data));

            runInAction(() => {
                this.invites.replace(this.invites.concat(invites));
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

        runInAction(() => {
            this.isInviting = false;
        });
    }

    @action
    cancelInvite = async (userId: number) => {
        this.isCancellingInvite = true;

        try {
            await http.delete(`${this.resourceUrl}/invites/${userId}`);

            runInAction(() => {
                this.invites.replace(this.invites.filter(i => i.osuUserId !== userId));
            });

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

        runInAction(() => {
            this.isCancellingInvite = false;
        });
    }

    @action    
    loadMembership = async (userId: number) => {
        this.membership = null;
        this.isLoadingMembership = true;
        
        try {
            const membershipResponse = await http.get(`${this.resourceUrl}/members/${userId}`);
            const membership: Membership = membershipFromJson(membershipResponse.data);
            
            const scoresResponse = await http.get(`${this.resourceUrl}/members/${userId}/scores`);
            const scores: Score[] = scoresResponse.data.map((data: any) => scoreFromJson(data));

            runInAction(() => {
                this.membership = membership;
                // transform scores into their intended form for abnormal score sets
                this.membershipScores.replace(unchokeForScoreSet(scores, this.leaderboard!.scoreSet));
            });
        } catch (error) {
            console.log(error);
        }

        runInAction(() => {
            this.isLoadingMembership = false;
        });
    }

    @action
    joinLeaderboard = async () => {
        this.isJoiningLeaderboard = true;

        try {
            const membershipResponse = await http.post(`${this.resourceUrl}/members`);
            const membership = membershipFromJson(membershipResponse.data);

            runInAction(() => {
                this.userMembership = membership;
            });

            notify.positive("Leaderboard joined");
        } catch (error) {
            console.log(error);

            const errorMessage = error.response.data.detail;

            if (errorMessage) {
                notify.negative(`Failed to join leaderboard: ${errorMessage}`);
            } else {
                notify.negative("Failed to join leaderboard");
            }
        }

        runInAction(() => {
            this.isJoiningLeaderboard = false;
        });
    }

    @action
    leaveLeaderboard = async () => {
        this.isLeavingLeaderboard = true;

        try {
            await http.delete(`${this.resourceUrl}/members/${this.userMembership!.osuUserId}`);

            runInAction(() => {
                this.userMembership = null;
            });

            notify.positive("Leaderboard left");
        } catch (error) {
            console.log(error);

            const errorMessage = error.response.data.detail;

            if (errorMessage) {
                notify.negative(`Failed to leave leaderboard: ${errorMessage}`);
            } else {
                notify.negative("Failed to leave leaderboard");
            }
        }

        runInAction(() => {
            this.isLeavingLeaderboard = false;
        });
    }
}
