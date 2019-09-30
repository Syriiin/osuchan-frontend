import axios from "axios";
import { observable, action } from "mobx";

import { Score, Beatmap } from "../../models/profiles/types";
import { beatmapFromJson, scoreFromJson } from "../../models/profiles/deserialisers";

export class BeatmapStore {
    @observable beatmap: Beatmap | null = null;
    @observable scores: Score[] = [];
    @observable isLoading: boolean = false;

    @action
    loadBeatmap = async (leaderboardId: number, beatmapId: number) => {
        this.isLoading = true;

        try {
            const beatmapResponse = await axios.get(`/api/profiles/beatmaps/${beatmapId}`);
            const beatmap: Beatmap = beatmapFromJson(beatmapResponse.data);
            
            const scoresResponse = await axios.get(`/api/leaderboards/leaderboards/${leaderboardId}/beatmaps/${beatmapId}/scores`);
            const scores: Score[] = scoresResponse.data.map((data: any) => scoreFromJson(data));

            this.beatmap = beatmap;
            this.scores = scores;
        } catch (error) {
            console.log(error);
        }

        this.isLoading = false;
    }
}
