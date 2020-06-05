import axios from "axios";
import { observable, action } from "mobx";

import { Score, Beatmap } from "../../models/profiles/types";
import { beatmapFromJson, scoreFromJson } from "../../models/profiles/deserialisers";
import { unchokeForScoreSet } from "../../../utils/osu";
import { Leaderboard } from "../../models/leaderboards/types";
import { leaderboardFromJson } from "../../models/leaderboards/deserialisers";

export class BeatmapStore {
    @observable leaderboard: Leaderboard | null = null;
    @observable beatmap: Beatmap | null = null;
    @observable scores: Score[] = [];
    @observable isLoading: boolean = false;

    @action
    loadBeatmap = async (leaderboardId: number, beatmapId: number) => {
        this.isLoading = true;

        try {
            const leaderboardResponse = await axios.get(`/api/leaderboards/leaderboards/${leaderboardId}`);
            const leaderboard: Leaderboard = leaderboardFromJson(leaderboardResponse.data);
            
            const beatmapResponse = await axios.get(`/api/profiles/beatmaps/${beatmapId}`);
            const beatmap: Beatmap = beatmapFromJson(beatmapResponse.data);
            
            const scoresResponse = await axios.get(`/api/leaderboards/leaderboards/${leaderboardId}/beatmaps/${beatmapId}/scores`);
            const scores: Score[] = scoresResponse.data.map((data: any) => scoreFromJson(data));

            this.beatmap = beatmap;
            // transform scores into their intended form for abnormal score sets
            this.scores = unchokeForScoreSet(scores, leaderboard.scoreSet);
        } catch (error) {
            console.log(error);
        }

        this.isLoading = false;
    }
}
