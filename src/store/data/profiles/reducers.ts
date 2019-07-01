import { ProfilesDataState, ProfilesAction, ProfilesActionType, Beatmap, Score, UserStats, OsuUser } from "./types";

const initialState: ProfilesDataState = {
    osuUsers: {},
    userStats: {},
    beatmaps: {},
    scores: {}
}

function profilesReducer(state: ProfilesDataState = initialState, action: ProfilesAction): ProfilesDataState {
    switch (action.type) {
        case ProfilesActionType.AddOsuUsers:
            const osuUsers: { [id: number]: OsuUser } = {};
            for (const osuUser of action.osuUsers) {
                osuUsers[osuUser.id] = osuUser;
            }
            return {
                ...state,
                osuUsers: {
                    ...state.osuUsers,
                    ...osuUsers
                }
            }
        case ProfilesActionType.AddUserStats:
            const userStats: { [id: number]: UserStats } = {};
            for (const stats of action.userStats) {
                userStats[stats.id] = stats;
            }
            return {
                ...state,
                userStats: {
                    ...state.userStats,
                    ...userStats
                }
            }
        case ProfilesActionType.AddBeatmaps:
            const beatmaps: { [id: number]: Beatmap } = {};
            for (const beatmap of action.beatmaps) {
                beatmaps[beatmap.id] = beatmap;
            }
            return {
                ...state,
                beatmaps: {
                    ...state.beatmaps,
                    ...beatmaps
                }
            }
        case ProfilesActionType.AddScores:
            const scores: { [id: number]: Score } = {};
            for (const score of action.scores) {
                scores[score.id] = score;
            }
            return {
                ...state,
                scores: {
                    ...state.scores,
                    ...scores
                }
            }
        default:
            return state;
    }
}

export default profilesReducer;
