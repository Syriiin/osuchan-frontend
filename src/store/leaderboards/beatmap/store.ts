import { observable, action } from "mobx";

import http from "../../../http";

import { Score, Beatmap } from "../../models/profiles/types";
import { beatmapFromJson, scoreFromJson } from "../../models/profiles/deserialisers";
import { unchokeForScoreSet } from "../../../utils/osuchan";
import { Leaderboard } from "../../models/leaderboards/types";
import { leaderboardFromJson } from "../../models/leaderboards/deserialisers";

export class BeatmapStore {
    @observable leaderboard: Leaderboard | null = null;
    @observable beatmap: Beatmap | null = null;
    @observable isLoading: boolean = false;

    readonly scores = observable<Score>([]);

    @action
    loadBeatmap = async (leaderboardId: number, beatmapId: number) => {
        this.leaderboard = null;
        this.beatmap = null;
        this.isLoading = true;

        try {
            const leaderboardResponse = await http.get(`/api/leaderboards/leaderboards/${leaderboardId}`);
            const leaderboard: Leaderboard = leaderboardFromJson(leaderboardResponse.data);
            
            const beatmapResponse = await http.get(`/api/profiles/beatmaps/${beatmapId}`);
            const beatmap: Beatmap = beatmapFromJson(beatmapResponse.data);
            
            const scoresResponse = await http.get(`/api/leaderboards/leaderboards/${leaderboardId}/beatmaps/${beatmapId}/scores`);
            const scores: Score[] = scoresResponse.data.map((data: any) => scoreFromJson(data));

            this.leaderboard = leaderboard;
            this.beatmap = beatmap;
            // transform scores into their intended form for abnormal score sets
            this.scores.replace(unchokeForScoreSet(scores, leaderboard.scoreSet));
        } catch (error) {
            console.log(error);
        }

        this.isLoading = false;
    }
}
