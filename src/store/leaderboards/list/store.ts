import { observable, action, runInAction, makeAutoObservable } from "mobx";

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
import { PaginatedResourceStatus } from "../../status";

export class ListStore {
    gamemode: Gamemode | null = null;
    globalLeaderboardsStatus = PaginatedResourceStatus.NotLoaded;
    communityLeaderboardsStatus = PaginatedResourceStatus.NotLoaded;
    communityMembershipsStatus = PaginatedResourceStatus.NotLoaded;
    isCreatingLeaderboard = false;

    readonly globalLeaderboards = observable<Leaderboard>([]);
    readonly globalMemberships = observable<Membership>([]);
    readonly communityLeaderboards = observable<Leaderboard>([]);
    readonly communityMemberships = observable<Membership>([]);

    constructor() {
        makeAutoObservable(this, {
            unload: action,
            loadGlobalLeaderboards: action,
            loadNextGlobalLeaderboardsPage: action,
            loadCommunityLeaderboards: action,
            loadNextCommunityLeaderboardsPage: action,
            loadCommunityMemberships: action,
            loadNextCommunityMembershipsPage: action,
            createLeaderboard: action
        });
    }

    unload = async () => {
        this.gamemode = null;
        this.globalLeaderboardsStatus = PaginatedResourceStatus.NotLoaded;
        this.communityLeaderboardsStatus = PaginatedResourceStatus.NotLoaded;
        this.communityMembershipsStatus = PaginatedResourceStatus.NotLoaded;
        this.isCreatingLeaderboard = false;

        this.globalLeaderboards.clear();
        this.globalMemberships.clear();
        this.communityLeaderboards.clear();
        this.communityMemberships.clear();
    }

    loadGlobalLeaderboards = async (gamemode: Gamemode, userId?: number) => {
        this.globalLeaderboardsStatus = PaginatedResourceStatus.LoadingInitial;
        this.gamemode = gamemode;
        this.globalLeaderboards.clear();
        this.globalMemberships.clear();

        try {
            if (userId) {
                const globalMembershipsResponse = await http.get(`/api/profiles/users/${userId}/memberships/global/${gamemode}`, {
                    params: {
                        "offset": 0,
                        "limit": 25
                    }
                });
                const globalMemberships: Membership[] = globalMembershipsResponse.data["results"].map((data: any) => membershipFromJson(data));
                
                runInAction(() => {
                    this.globalMemberships.replace(globalMemberships);
                    
                    if (this.globalMemberships.length === globalMembershipsResponse.data["count"]) {
                        this.globalLeaderboardsStatus = PaginatedResourceStatus.Loaded;
                    } else {
                        this.globalLeaderboardsStatus = PaginatedResourceStatus.PartiallyLoaded;
                    }
                });
            } else {
                const globalLeaderboardsResponse = await http.get(`/api/leaderboards/global/${gamemode}`, {
                    params: {
                        "offset": 0,
                        "limit": 25
                    }
                });
                const globalLeaderboards: Leaderboard[] = globalLeaderboardsResponse.data["results"].map((data: any) => leaderboardFromJson(data));
                
                runInAction(() => {
                    this.globalLeaderboards.replace(globalLeaderboards);
                    
                    if (this.globalLeaderboards.length === globalLeaderboardsResponse.data["count"]) {
                        this.globalLeaderboardsStatus = PaginatedResourceStatus.Loaded;
                    } else {
                        this.globalLeaderboardsStatus = PaginatedResourceStatus.PartiallyLoaded;
                    }
                });
            }
        } catch (error) {
            console.log(error);

            runInAction(() => {
                this.globalLeaderboardsStatus = PaginatedResourceStatus.Error;
            });
        }
    }

    loadNextGlobalLeaderboardsPage = async (userId?: number) => {
        this.globalLeaderboardsStatus = PaginatedResourceStatus.LoadingMore;

        try {
            if (userId) {
                const globalMembershipsResponse = await http.get(`/api/profiles/users/${userId}/memberships/global/${this.gamemode}`, {
                    params: {
                        "offset": this.globalMemberships.length,
                        "limit": 25
                    }
                });
                const globalMemberships: Membership[] = globalMembershipsResponse.data["results"].map((data: any) => membershipFromJson(data));
                
                runInAction(() => {
                    this.globalMemberships.replace(this.globalMemberships.concat(globalMemberships));
                    
                    if (this.globalMemberships.length === globalMembershipsResponse.data["count"]) {
                        this.globalLeaderboardsStatus = PaginatedResourceStatus.Loaded;
                    } else {
                        this.globalLeaderboardsStatus = PaginatedResourceStatus.PartiallyLoaded;
                    }
                });
            } else {
                const globalLeaderboardsResponse = await http.get(`/api/leaderboards/global/${this.gamemode}`, {
                    params: {
                        "offset": this.globalLeaderboards.length,
                        "limit": 25
                    }
                });
                const globalLeaderboards: Leaderboard[] = globalLeaderboardsResponse.data["results"].map((data: any) => leaderboardFromJson(data));
                
                runInAction(() => {
                    this.globalLeaderboards.replace(this.globalLeaderboards.concat(globalLeaderboards));
                    
                    if (this.globalLeaderboards.length === globalLeaderboardsResponse.data["count"]) {
                        this.globalLeaderboardsStatus = PaginatedResourceStatus.Loaded;
                    } else {
                        this.globalLeaderboardsStatus = PaginatedResourceStatus.PartiallyLoaded;
                    }
                });
            }
        } catch (error) {
            console.log(error);

            runInAction(() => {
                this.globalLeaderboardsStatus = PaginatedResourceStatus.Error;
            });
        }
    }

    loadCommunityLeaderboards = async (gamemode: Gamemode) => {
        this.communityLeaderboardsStatus = PaginatedResourceStatus.LoadingInitial;
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
            
            runInAction(() => {
                this.communityLeaderboards.replace(communityLeaderboards);
                
                if (this.communityLeaderboards.length === communityLeaderboardsResponse.data["count"]) {
                    this.communityLeaderboardsStatus = PaginatedResourceStatus.Loaded;
                } else {
                    this.communityLeaderboardsStatus = PaginatedResourceStatus.PartiallyLoaded;
                }
            });
        } catch (error) {
            console.log(error);
            
            runInAction(() => {
                this.communityLeaderboardsStatus = PaginatedResourceStatus.Error;
            });
        }
    }

    loadNextCommunityLeaderboardsPage = async () => {
        this.communityLeaderboardsStatus = PaginatedResourceStatus.LoadingMore;

        try {
            const communityLeaderboardsResponse = await http.get(`/api/leaderboards/community/${this.gamemode}`, {
                params: {
                    "offset": this.communityLeaderboards.length,
                    "limit": 25
                }
            });
            const communityLeaderboards: Leaderboard[] = communityLeaderboardsResponse.data["results"].map((data: any) => leaderboardFromJson(data));
            
            runInAction(() => {
                this.communityLeaderboards.replace(this.communityLeaderboards.concat(communityLeaderboards));
                
                if (this.communityLeaderboards.length === communityLeaderboardsResponse.data["count"]) {
                    this.communityLeaderboardsStatus = PaginatedResourceStatus.Loaded;
                } else {
                    this.communityLeaderboardsStatus = PaginatedResourceStatus.PartiallyLoaded;
                }
            });
        } catch (error) {
            console.log(error);

            runInAction(() => {
                this.communityLeaderboardsStatus = PaginatedResourceStatus.Error;
            });
        }
    }

    loadCommunityMemberships = async (gamemode: Gamemode, userId: number) => {
        this.communityMembershipsStatus = PaginatedResourceStatus.LoadingInitial;
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
            
            runInAction(() => {
                this.communityMemberships.replace(communityMemberships);
                
                if (this.communityMemberships.length === communityMembershipsResponse.data["count"]) {
                    this.communityMembershipsStatus = PaginatedResourceStatus.Loaded;
                } else {
                    
                    this.communityMembershipsStatus = PaginatedResourceStatus.PartiallyLoaded;
                }
            });
        } catch (error) {
            console.log(error);

            runInAction(() => {
                this.communityMembershipsStatus = PaginatedResourceStatus.Error;
            });
        }
    }

    loadNextCommunityMembershipsPage = async (userId: number) => {
        this.communityMembershipsStatus = PaginatedResourceStatus.LoadingMore;

        try {
            const communityMembershipsResponse = await http.get(`/api/profiles/users/${userId}/memberships/community/${this.gamemode}`, {
                params: {
                    "offset": this.communityMemberships.length,
                    "limit": 10
                }
            });
            const communityMemberships: Membership[] = communityMembershipsResponse.data["results"].map((data: any) => membershipFromJson(data));
            
            runInAction(() => {
                this.communityMemberships.replace(this.communityMemberships.concat(communityMemberships));
                
                if (this.communityMemberships.length === communityMembershipsResponse.data["count"]) {
                    this.communityMembershipsStatus = PaginatedResourceStatus.Loaded;
                } else {
                    this.communityMembershipsStatus = PaginatedResourceStatus.PartiallyLoaded;
                }
            });
        } catch (error) {
            console.log(error);

            runInAction(() => {
                this.communityMembershipsStatus = PaginatedResourceStatus.Error;
            });
        }
    }

    createLeaderboard = async (gamemode: Gamemode, scoreSet: ScoreSet, accessType: LeaderboardAccessType, name: string, description: string, iconUrl: string, allowPastScores: boolean, scoreFilter: ScoreFilter) => {
        this.isCreatingLeaderboard = true;

        try {
            const leaderboardResponse = await http.post(`/api/leaderboards/community/${gamemode}`, {
                "score_set": scoreSet,
                "access_type": accessType,
                "name": name,
                "description": description,
                "icon_url": iconUrl,
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

            runInAction(() => {
                this.communityLeaderboards.push(leaderboard);
            });

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

        runInAction(() => {
            this.isCreatingLeaderboard = false;
        });
    }
}
