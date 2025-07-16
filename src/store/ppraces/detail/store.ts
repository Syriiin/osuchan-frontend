import { flow, makeAutoObservable } from "mobx";

import http from "../../../http";

import { PPRace } from "../../models/ppraces/types";
import { ResourceStatus } from "../../status";
import { ppraceFromJson } from "../../models/ppraces/deserialisers";
import { Score } from "../../models/profiles/types";
import { scoreFromJson } from "../../models/profiles/deserialisers";

export class DetailStore {
    ppraceId: number | null = null;
    pprace: PPRace | null = null;
    loadingStatus = ResourceStatus.NotLoaded;
    teamScores: Record<number, Score[]> = {};
    recentScores: Score[] = [];

    constructor() {
        makeAutoObservable(this, {
            loadPPRace: flow,
        });
    }

    get resourceUrl(): string {
        return `/api/ppraces/${this.ppraceId}`;
    }

    reloadPPRace = async () => this.loadPPRace(this.ppraceId!);

    *loadPPRace(ppraceId: number): any {
        if (this.loadingStatus === ResourceStatus.NotLoaded) {
            this.loadingStatus = ResourceStatus.Loading;
        }
        this.ppraceId = ppraceId;

        try {
            const ppraceResponse = yield http.get(this.resourceUrl);
            const pprace = ppraceFromJson(ppraceResponse.data);

            this.pprace = pprace;

            const recentScoresResponse = yield http.get(
                `/api/ppraces/${ppraceId}/recentscores`
            );
            const recentScores = recentScoresResponse.data.map((score: any) =>
                scoreFromJson(score)
            );
            this.recentScores = recentScores;

            for (const team of pprace.teams) {
                const teamScoresResponse = yield http.get(
                    `/api/ppraces/${ppraceId}/teams/${team.id}/scores`
                );
                this.teamScores[team.id] = teamScoresResponse.data.map(
                    (score: any) => scoreFromJson(score)
                );
            }

            this.loadingStatus = ResourceStatus.Loaded;
        } catch (error: any) {
            console.log(error);

            this.loadingStatus = ResourceStatus.Error;
        }
    }
}
