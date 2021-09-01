import { observable, action, makeAutoObservable, flow } from "mobx";

import history from "../../../history";
import http from "../../../http";
import notify from "../../../notifications";

import {
    Leaderboard,
    Membership,
    Invite,
} from "../../models/leaderboards/types";
import { Score } from "../../models/profiles/types";
import {
    leaderboardFromJson,
    membershipFromJson,
    inviteFromJson,
} from "../../models/leaderboards/deserialisers";
import { scoreFromJson } from "../../models/profiles/deserialisers";
import { unchokeForScoreSet } from "../../../utils/osuchan";
import { Gamemode } from "../../models/common/enums";
import { ResourceStatus } from "../../status";
import { formatGamemodeNameShort } from "../../../utils/formatting";

export class DetailStore {
    leaderboardType: string | null = null;
    gamemode: Gamemode | null = null;
    leaderboardId: number | null = null;
    leaderboard: Leaderboard | null = null;
    userMembership: Membership | null = null;
    membership: Membership | null = null;
    loadingStatus = ResourceStatus.NotLoaded;
    loadingUserMembershipStatus = ResourceStatus.NotLoaded;
    isDeletingLeaderboard = false;
    isUpdatingLeaderboard = false;
    isArchivingLeaderboard = false;
    isRestoringLeaderboard = false;
    loadingInvitesStatus = ResourceStatus.NotLoaded;
    isInviting = false;
    isCancellingInvite = false;
    loadingMembershipStatus = ResourceStatus.NotLoaded;
    isJoiningLeaderboard = false;
    isLeavingLeaderboard = false;
    isKickingMember = false;

    readonly rankings = observable<Membership>([]);
    readonly leaderboardScores = observable<Score>([]);
    readonly invites = observable<Invite>([]);
    readonly membershipScores = observable<Score>([]);

    constructor() {
        makeAutoObservable(this, {
            loadLeaderboard: flow,
            loadUserMembership: flow,
            reloadLeaderboard: action,
            updateLeaderboard: flow,
            archiveLeaderboard: flow,
            restoreLeaderboard: flow,
            deleteLeaderboard: flow,
            loadInvites: flow,
            invitePlayers: flow,
            cancelInvite: flow,
            loadMembership: flow,
            joinLeaderboard: flow,
            leaveLeaderboard: flow,
            kickMember: flow,
        });
    }

    get resourceUrl(): string {
        return `/api/leaderboards/${this.leaderboardType}/${this.gamemode}/${this.leaderboardId}`;
    }

    reloadLeaderboard = async () =>
        this.loadLeaderboard(
            this.leaderboardType!,
            this.gamemode!,
            this.leaderboardId!
        );

    *loadLeaderboard(
        leaderboardType: string,
        gamemode: Gamemode,
        leaderboardId: number
    ): any {
        this.loadingStatus = ResourceStatus.Loading;
        this.leaderboardType = leaderboardType;
        this.gamemode = gamemode;
        this.leaderboardId = leaderboardId;
        this.leaderboard = null;
        this.userMembership = null;
        this.rankings.clear();
        this.leaderboardScores.clear();

        try {
            const leaderboardResponse = yield http.get(this.resourceUrl);
            const leaderboard: Leaderboard = leaderboardFromJson(
                leaderboardResponse.data
            );

            const membersResponse = yield http.get(
                `${this.resourceUrl}/members`
            );
            const members: Membership[] = membersResponse.data.map(
                (data: any) => membershipFromJson(data)
            );

            const scoresResponse = yield http.get(`${this.resourceUrl}/scores`);
            const scores: Score[] = scoresResponse.data.map((data: any) =>
                scoreFromJson(data)
            );

            this.leaderboard = leaderboard;
            this.rankings.replace(members);
            // transform scores into their intended form for abnormal score sets
            this.leaderboardScores.replace(
                unchokeForScoreSet(scores, leaderboard.scoreSet)
            );

            this.loadingStatus = ResourceStatus.Loaded;
        } catch (error: any) {
            console.log(error);

            this.loadingStatus = ResourceStatus.Error;
        }
    }

    *loadUserMembership(userId: number): any {
        this.loadingUserMembershipStatus = ResourceStatus.Loading;
        this.userMembership = null;

        try {
            const membershipResponse = yield http.get(
                `${this.resourceUrl}/members/${userId}`
            );
            const membership = membershipFromJson(membershipResponse.data);

            this.userMembership = membership;

            this.loadingUserMembershipStatus = ResourceStatus.Loaded;
        } catch (error: any) {
            console.log(error);

            this.loadingUserMembershipStatus = ResourceStatus.Error;
        }
    }

    *updateLeaderboard(leaderboardData: Partial<Leaderboard>): any {
        this.isUpdatingLeaderboard = true;

        try {
            const leaderboardResponse = yield http.patch(this.resourceUrl, {
                access_type: leaderboardData.accessType,
                name: leaderboardData.name,
                description: leaderboardData.description,
                icon_url: leaderboardData.iconUrl,
            });

            this.leaderboard = leaderboardFromJson(leaderboardResponse.data);

            notify.positive("Leaderboard updated");
        } catch (error: any) {
            console.log(error);

            const errorMessage = error.response.data.detail;

            if (errorMessage) {
                notify.negative(
                    `Failed to update leaderboard: ${errorMessage}`
                );
            } else {
                notify.negative("Failed to update leaderboard");
            }
        }

        this.isUpdatingLeaderboard = false;
    }

    *archiveLeaderboard(): any {
        this.isArchivingLeaderboard = true;

        try {
            const leaderboardResponse = yield http.patch(this.resourceUrl, {
                archived: true,
            });

            this.leaderboard = leaderboardFromJson(leaderboardResponse.data);

            notify.positive("Leaderboard archived");
        } catch (error: any) {
            console.log(error);

            const errorMessage = error.response.data.detail;

            if (errorMessage) {
                notify.negative(
                    `Failed to archive leaderboard: ${errorMessage}`
                );
            } else {
                notify.negative("Failed to archive leaderboard");
            }
        }

        this.isArchivingLeaderboard = false;
    }

    *restoreLeaderboard(): any {
        this.isRestoringLeaderboard = true;

        try {
            const leaderboardResponse = yield http.patch(this.resourceUrl, {
                archived: false,
            });

            this.leaderboard = leaderboardFromJson(leaderboardResponse.data);

            notify.positive("Leaderboard restored");
        } catch (error: any) {
            console.log(error);

            const errorMessage = error.response.data.detail;

            if (errorMessage) {
                notify.negative(
                    `Failed to restore leaderboard: ${errorMessage}`
                );
            } else {
                notify.negative("Failed to restore leaderboard");
            }
        }

        this.isRestoringLeaderboard = false;
    }

    *deleteLeaderboard() {
        this.isDeletingLeaderboard = true;

        try {
            yield http.delete(this.resourceUrl);

            // Navigate to leaderboard list page after deletion
            history.push(
                `/leaderboards/community/${formatGamemodeNameShort(
                    this.gamemode!
                )}`
            );

            this.leaderboard = null;
            this.rankings.clear();
            this.leaderboardScores.clear();

            notify.positive("Leaderboard deleted");
        } catch (error: any) {
            console.log(error);

            const errorMessage = error.response.data.detail;

            if (errorMessage) {
                notify.negative(
                    `Failed to delete leaderboard: ${errorMessage}`
                );
            } else {
                notify.negative("Failed to delete leaderboard");
            }
        }

        this.isDeletingLeaderboard = false;
    }

    *loadInvites(): any {
        this.loadingInvitesStatus = ResourceStatus.Loading;
        this.invites.clear();

        try {
            const invitesResponse = yield http.get(
                `${this.resourceUrl}/invites`
            );
            const invites: Invite[] = invitesResponse.data.map((data: any) =>
                inviteFromJson(data)
            );

            this.invites.replace(invites);

            this.loadingInvitesStatus = ResourceStatus.Loaded;
        } catch (error: any) {
            console.log(error);

            this.loadingInvitesStatus = ResourceStatus.Error;
        }
    }

    *invitePlayers(userIds: number[], message: string): any {
        this.isInviting = true;

        try {
            const invitesResponse = yield http.post(
                `${this.resourceUrl}/invites`,
                {
                    user_ids: userIds,
                    message: message,
                }
            );

            const invites: Invite[] = invitesResponse.data.map((data: any) =>
                inviteFromJson(data)
            );

            this.invites.replace(this.invites.concat(invites));

            notify.positive("Invitations sent");
        } catch (error: any) {
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

    *cancelInvite(userId: number) {
        this.isCancellingInvite = true;

        try {
            yield http.delete(`${this.resourceUrl}/invites/${userId}`);

            this.invites.replace(
                this.invites.filter((i) => i.osuUserId !== userId)
            );

            notify.positive("Invite cancelled");
        } catch (error: any) {
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

    *loadMembership(userId: number): any {
        this.loadingMembershipStatus = ResourceStatus.Loading;
        this.membership = null;

        try {
            const membershipResponse = yield http.get(
                `${this.resourceUrl}/members/${userId}`
            );
            const membership: Membership = membershipFromJson(
                membershipResponse.data
            );

            const scoresResponse = yield http.get(
                `${this.resourceUrl}/members/${userId}/scores`
            );
            const scores: Score[] = scoresResponse.data.map((data: any) =>
                scoreFromJson(data)
            );

            this.membership = membership;
            // transform scores into their intended form for abnormal score sets
            this.membershipScores.replace(
                unchokeForScoreSet(scores, this.leaderboard!.scoreSet)
            );

            this.loadingMembershipStatus = ResourceStatus.Loaded;
        } catch (error: any) {
            console.log(error);

            this.loadingMembershipStatus = ResourceStatus.Error;
        }
    }

    *joinLeaderboard(): any {
        this.isJoiningLeaderboard = true;

        try {
            const membershipResponse = yield http.post(
                `${this.resourceUrl}/members`
            );
            const membership = membershipFromJson(membershipResponse.data);

            this.userMembership = membership;

            notify.positive("Leaderboard joined");
        } catch (error: any) {
            console.log(error);

            const errorMessage = error.response.data.detail;

            if (errorMessage) {
                notify.negative(`Failed to join leaderboard: ${errorMessage}`);
            } else {
                notify.negative("Failed to join leaderboard");
            }
        }

        this.isJoiningLeaderboard = false;
    }

    *leaveLeaderboard() {
        this.isLeavingLeaderboard = true;

        try {
            yield http.delete(
                `${this.resourceUrl}/members/${this.userMembership!.osuUserId}`
            );

            this.userMembership = null;

            notify.positive("Leaderboard left");
        } catch (error: any) {
            console.log(error);

            const errorMessage = error.response.data.detail;

            if (errorMessage) {
                notify.negative(`Failed to leave leaderboard: ${errorMessage}`);
            } else {
                notify.negative("Failed to leave leaderboard");
            }
        }

        this.isLeavingLeaderboard = false;
    }

    *kickMember() {
        this.isKickingMember = true;

        try {
            yield http.delete(
                `${this.resourceUrl}/members/${this.membership!.osuUserId}`
            );

            history.push(
                `/leaderboards/${
                    this.leaderboardType
                }/${formatGamemodeNameShort(this.gamemode!)}/${
                    this.leaderboardId
                }`
            );
            this.rankings.replace(
                this.rankings.filter(
                    (m) => m.osuUserId !== this.membership!.osuUserId
                )
            );
            this.leaderboardScores.replace(
                this.leaderboardScores.filter(
                    (s) => s.userStats!.osuUserId !== this.membership!.osuUserId
                )
            );
            this.membership = null;

            notify.positive("Member kicked");
        } catch (error: any) {
            console.log(error);

            const errorMessage = error.response.data.detail;

            if (errorMessage) {
                notify.negative(`Failed to kick member: ${errorMessage}`);
            } else {
                notify.negative("Failed to kick member");
            }
        }

        this.isKickingMember = false;
    }
}
