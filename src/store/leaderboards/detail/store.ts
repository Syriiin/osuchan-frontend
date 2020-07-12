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
import { ResourceStatus } from "../../status";

export class DetailStore {
    @observable leaderboardType: string | null = null;
    @observable gamemode: Gamemode | null = null;
    @observable leaderboardId: number | null = null;
    @observable leaderboard: Leaderboard | null = null;
    @observable userMembership: Membership | null = null;
    @observable membership: Membership | null = null;
    @observable loadingStatus = ResourceStatus.NotLoaded;
    @observable loadingUserMembershipStatus = ResourceStatus.NotLoaded;
    @observable isDeletingLeaderboard = false;
    @observable loadingInvitesStatus = ResourceStatus.NotLoaded;
    @observable isInviting = false;
    @observable isCancellingInvite = false;
    @observable loadingMembershipStatus = ResourceStatus.NotLoaded;
    @observable isJoiningLeaderboard = false;
    @observable isLeavingLeaderboard = false;

    readonly rankings = observable<Membership>([]);
    readonly leaderboardScores = observable<Score>([]);
    readonly invites = observable<Invite>([]);
    readonly membershipScores = observable<Score>([]);

    get resourceUrl(): string {
        return `/api/leaderboards/${this.leaderboardType}/${this.gamemode}/${this.leaderboardId}`;
    }

    @action
    loadLeaderboard = async (leaderboardType: string, gamemode: Gamemode, leaderboardId: number) => {
        this.loadingStatus = ResourceStatus.Loading;
        this.leaderboardType = leaderboardType;
        this.gamemode = gamemode;
        this.leaderboardId = leaderboardId;
        this.leaderboard = null;
        this.userMembership = null;
        this.rankings.clear();
        this.leaderboardScores.clear();

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

                this.loadingStatus = ResourceStatus.Loaded;
            });
        } catch (error) {
            console.log(error);

            runInAction(() => {
                this.loadingStatus = ResourceStatus.Error;
            });
        }
    }

    @action
    loadUserMembership = async (userId: number) => {
        this.loadingUserMembershipStatus = ResourceStatus.Loading;
        this.userMembership = null;

        try {
            const membershipResponse = await http.get(`${this.resourceUrl}/members/${userId}`);
            const membership = membershipFromJson(membershipResponse.data);

            runInAction(() => {
                this.userMembership = membership;

                this.loadingUserMembershipStatus = ResourceStatus.Loaded;
            });
        } catch (error) {
            console.log(error);

            runInAction(() => {
                this.loadingUserMembershipStatus = ResourceStatus.Error;
            });
        }
    }

    @action
    reloadLeaderboard = async () => this.loadLeaderboard(this.leaderboardType!, this.gamemode!, this.leaderboardId!);

    @action
    deleteLeaderboard = async () => {
        this.isDeletingLeaderboard = true;

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
            this.isDeletingLeaderboard = false;
        });
    }

    @action
    loadInvites = async () => {
        this.loadingInvitesStatus = ResourceStatus.Loading;
        this.invites.clear();

        try {
            const invitesResponse = await http.get(`${this.resourceUrl}/invites`);
            const invites: Invite[] = invitesResponse.data.map((data: any) => inviteFromJson(data));
            
            runInAction(() => {
                this.invites.replace(invites);

                this.loadingInvitesStatus = ResourceStatus.Loaded;
            });
        } catch (error) {
            console.log(error);

            runInAction(() => {
                this.loadingInvitesStatus = ResourceStatus.Error;
            });
        }
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
        this.loadingMembershipStatus = ResourceStatus.Loading;
        this.membership = null;
        
        try {
            const membershipResponse = await http.get(`${this.resourceUrl}/members/${userId}`);
            const membership: Membership = membershipFromJson(membershipResponse.data);
            
            const scoresResponse = await http.get(`${this.resourceUrl}/members/${userId}/scores`);
            const scores: Score[] = scoresResponse.data.map((data: any) => scoreFromJson(data));

            runInAction(() => {
                this.membership = membership;
                // transform scores into their intended form for abnormal score sets
                this.membershipScores.replace(unchokeForScoreSet(scores, this.leaderboard!.scoreSet));

                this.loadingMembershipStatus = ResourceStatus.Loaded;
            });
        } catch (error) {
            console.log(error);

            runInAction(() => {
                this.loadingMembershipStatus = ResourceStatus.Error;
            });
        }
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
