import { observable, action } from "mobx";

import history from "../../../history";
import http from "../../../http";
import notify from "../../../notifications";

import { Leaderboard, Membership } from "../../models/leaderboards/types";
import { leaderboardFromJson, membershipFromJson } from "../../models/leaderboards/deserialisers";
import { ScoreFilter } from "../../models/profiles/types";
import { Gamemode } from "../../models/common/enums";
import { LeaderboardAccessType } from "../../models/leaderboards/enums";
import { ScoreSet } from "../../models/profiles/enums";
import { formatGamemodeNameShort } from "../../../utils/formatting";

export class ListStore {
    @observable gamemode: Gamemode | null = null;
    @observable isLoadingGlobalLeaderboards: boolean = false;
    @observable globalLeaderboardsLoaded: boolean = false;
    @observable isLoadingGlobalLeaderboardsPage: boolean = false;
    @observable globalLeaderboardsPagesEnded: boolean = false;
    @observable isLoadingCommunityLeaderboards: boolean = false;
    @observable communityLeaderboardsLoaded: boolean = false;
    @observable isLoadingCommunityLeaderboardsPage: boolean = false;
    @observable communityLeaderboardsPagesEnded: boolean = false;
    @observable isLoadingCommunityMemberships: boolean = false;
    @observable communityMembershipsLoaded: boolean = false;
    @observable isLoadingCommunityMembershipsPage: boolean = false;
    @observable communityMembershipsPagesEnded: boolean = false;
    @observable isCreating: boolean = false;

    readonly globalLeaderboards = observable<Leaderboard>([]);
    readonly globalMemberships = observable<Membership>([]);
    readonly communityLeaderboards = observable<Leaderboard>([]);
    readonly communityMemberships = observable<Membership>([]);

    @action
    unload = async () => {
        this.gamemode = null;
        this.isLoadingGlobalLeaderboards = false;
        this.globalLeaderboardsLoaded = false;
        this.isLoadingGlobalLeaderboardsPage = false;
        this.globalLeaderboardsPagesEnded = false;
        this.isLoadingCommunityLeaderboards = false;
        this.communityLeaderboardsLoaded = false;
        this.isLoadingCommunityLeaderboardsPage = false;
        this.communityLeaderboardsPagesEnded = false;
        this.isLoadingCommunityMemberships = false;
        this.communityMembershipsLoaded = false;
        this.isLoadingCommunityMembershipsPage = false;
        this.communityMembershipsPagesEnded = false;
        this.isCreating = false;

        this.globalLeaderboards.clear();
        this.globalMemberships.clear();
        this.communityLeaderboards.clear();
        this.communityMemberships.clear();
    }

    @action
    loadGlobalLeaderboards = async (gamemode: Gamemode, userId?: number) => {
        this.gamemode = gamemode;
        this.globalLeaderboardsLoaded = false;
        this.globalLeaderboards.clear();
        this.globalMemberships.clear();
        this.isLoadingGlobalLeaderboards = true;

        try {
            if (userId) {
                const globalMembershipsResponse = await http.get(`/api/profiles/users/${userId}/memberships/global/${gamemode}`, {
                    params: {
                        "offset": 0,
                        "limit": 25
                    }
                });
                const globalMemberships: Membership[] = globalMembershipsResponse.data["results"].map((data: any) => membershipFromJson(data));
                
                this.globalMemberships.replace(globalMemberships);
            } else {
                const globalLeaderboardsResponse = await http.get(`/api/leaderboards/global/${gamemode}`, {
                    params: {
                        "offset": 0,
                        "limit": 25
                    }
                });
                const globalLeaderboards: Leaderboard[] = globalLeaderboardsResponse.data["results"].map((data: any) => leaderboardFromJson(data));
                
                this.globalLeaderboards.replace(globalLeaderboards);
            }
        } catch (error) {
            console.log(error);
        }

        this.isLoadingGlobalLeaderboards = false;
        this.globalLeaderboardsLoaded = true;
    }

    @action
    loadNextGlobalLeaderboardsPage = async (userId?: number) => {
        this.isLoadingGlobalLeaderboardsPage = true;

        try {
            if (userId) {
                const globalMembershipsResponse = await http.get(`/api/profiles/users/${userId}/memberships/global/${this.gamemode}`, {
                    params: {
                        "offset": this.globalMemberships.length,
                        "limit": 25
                    }
                });
                const globalMemberships: Membership[] = globalMembershipsResponse.data["results"].map((data: any) => membershipFromJson(data));
                
                this.globalMemberships.replace(this.globalMemberships.concat(globalMemberships));
                
                if (this.globalMemberships.length === globalMembershipsResponse.data["count"]) {
                    this.globalLeaderboardsPagesEnded = true;
                }
            } else {
                const globalLeaderboardsResponse = await http.get(`/api/leaderboards/global/${this.gamemode}`, {
                    params: {
                        "offset": this.globalLeaderboards.length,
                        "limit": 25
                    }
                });
                const globalLeaderboards: Leaderboard[] = globalLeaderboardsResponse.data["results"].map((data: any) => leaderboardFromJson(data));
                
                this.globalLeaderboards.replace(this.globalLeaderboards.concat(globalLeaderboards));
                
                if (this.globalLeaderboards.length === globalLeaderboardsResponse.data["count"]) {
                    this.globalLeaderboardsPagesEnded = true;
                }
            }
        } catch (error) {
            console.log(error);
        }

        this.isLoadingGlobalLeaderboardsPage = false;
    }

    @action
    loadCommunityLeaderboards = async (gamemode: Gamemode) => {
        this.isLoadingCommunityLeaderboards = true;
        this.communityLeaderboardsLoaded = false;
        this.communityLeaderboardsPagesEnded = false;
        
        this.gamemode = gamemode;
        this.communityLeaderboards.clear();

        try {
            const communityLeaderboardsResponse = await http.get(`/api/leaderboards/community/${gamemode}`, {
                params: {
                    "offset": 0,
                    "limit": 10
                }
            });
            const communityLeaderboards: Leaderboard[] = communityLeaderboardsResponse.data["results"].map((data: any) => leaderboardFromJson(data));
            
            this.communityLeaderboards.replace(communityLeaderboards);
            
            if (this.communityLeaderboards.length === communityLeaderboardsResponse.data["count"]) {
                this.communityLeaderboardsPagesEnded = true;
            }
        } catch (error) {
            console.log(error);
        }

        this.communityLeaderboardsLoaded = true;
        this.isLoadingCommunityLeaderboards = false;
    }

    @action
    loadNextCommunityLeaderboardsPage = async () => {
        this.isLoadingCommunityLeaderboardsPage = true;

        try {
            const communityLeaderboardsResponse = await http.get(`/api/leaderboards/community/${this.gamemode}`, {
                params: {
                    "offset": this.communityLeaderboards.length,
                    "limit": 25
                }
            });
            const communityLeaderboards: Leaderboard[] = communityLeaderboardsResponse.data["results"].map((data: any) => leaderboardFromJson(data));
            
            this.communityLeaderboards.replace(this.communityLeaderboards.concat(communityLeaderboards));
            
            if (this.communityLeaderboards.length === communityLeaderboardsResponse.data["count"]) {
                this.communityLeaderboardsPagesEnded = true;
            }
        } catch (error) {
            console.log(error);
        }

        this.isLoadingCommunityLeaderboardsPage = false;
    }

    @action
    loadCommunityMemberships = async (gamemode: Gamemode, userId: number) => {
        this.isLoadingCommunityMemberships = true;
        this.communityMembershipsLoaded = false;
        this.communityMembershipsPagesEnded = false;
        
        this.gamemode = gamemode;
        this.communityMemberships.clear();

        try {
            const communityMembershipsResponse = await http.get(`/api/profiles/users/${userId}/memberships/community/${gamemode}`, {
                params: {
                    "offset": 0,
                    "limit": 5
                }
            });
            const communityMemberships: Membership[] = communityMembershipsResponse.data["results"].map((data: any) => membershipFromJson(data));
            
            this.communityMemberships.replace(communityMemberships);
            
            if (this.communityMemberships.length === communityMembershipsResponse.data["count"]) {
                this.communityMembershipsPagesEnded = true;
            }
        } catch (error) {
            console.log(error);
        }

        this.communityMembershipsLoaded = true;
        this.isLoadingCommunityMemberships = false;
    }

    @action
    loadNextCommunityMembershipsPage = async (userId: number) => {
        this.isLoadingCommunityMembershipsPage = true;

        try {
            const communityMembershipsResponse = await http.get(`/api/profiles/users/${userId}/memberships/community/${this.gamemode}`, {
                params: {
                    "offset": this.communityMemberships.length,
                    "limit": 10
                }
            });
            const communityMemberships: Membership[] = communityMembershipsResponse.data["results"].map((data: any) => membershipFromJson(data));
            
            this.communityMemberships.replace(this.communityMemberships.concat(communityMemberships));
            
            if (this.communityMemberships.length === communityMembershipsResponse.data["count"]) {
                this.communityMembershipsPagesEnded = true;
            }
        } catch (error) {
            console.log(error);
        }

        this.isLoadingCommunityMembershipsPage = false;
    }

    @action
    createLeaderboard = async (gamemode: Gamemode, scoreSet: ScoreSet, accessType: LeaderboardAccessType, name: string, description: string, allowPastScores: boolean, scoreFilter: ScoreFilter) => {
        this.isCreating = true;

        try {
            const leaderboardResponse = await http.post(`/api/leaderboards/community/${gamemode}`, {
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
            history.push(`/leaderboards/community/${formatGamemodeNameShort(gamemode)}/${leaderboard.id}`);

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
