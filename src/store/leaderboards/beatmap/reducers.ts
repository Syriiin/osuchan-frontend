import { LeaderboardsBeatmapState, LeaderboardsBeatmapAction, LeaderboardsBeatmapActionType } from "./types";

const initialState: LeaderboardsBeatmapState = {
    leaderboardId: null,
    beatmapId: null,
    scoreIds: [],
    isFetching: false
}

function leaderboardsBeatmapReducer(state: LeaderboardsBeatmapState = initialState, action: LeaderboardsBeatmapAction): LeaderboardsBeatmapState {
    switch (action.type) {
        case LeaderboardsBeatmapActionType.Request:
            return {
                ...state,
                leaderboardId: null,
                beatmapId: null,
                scoreIds: [],
                isFetching: true
            }
        case LeaderboardsBeatmapActionType.Success:
            return {
                ...state,
                leaderboardId: action.leaderboardId,
                beatmapId: action.beatmapId,
                scoreIds: action.scoreIds,
                isFetching: false
            }
        case LeaderboardsBeatmapActionType.Failure:
            return {
                ...state,
                leaderboardId: null,
                scoreIds: [],
                isFetching: false
            }
        default:
            return state;
    }
}

export default leaderboardsBeatmapReducer;
