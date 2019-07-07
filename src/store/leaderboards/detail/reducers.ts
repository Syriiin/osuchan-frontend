import { LeaderboardsDetailState, LeaderboardsDetailAction, LeaderboardsDetailActionType } from "./types";

const initialState: LeaderboardsDetailState = {
    leaderboardId: null,
    rankingIds: [],
    isFetching: false,
    isDeleting: false,
    isPostingInvite: false
}

function leaderboardsDetailReducer(state: LeaderboardsDetailState = initialState, action: LeaderboardsDetailAction): LeaderboardsDetailState {
    switch (action.type) {
        case LeaderboardsDetailActionType.GetRequest:
            return {
                ...state,
                leaderboardId: null,
                rankingIds: [],
                isFetching: true
            }
        case LeaderboardsDetailActionType.GetSuccess:
            return {
                ...state,
                leaderboardId: action.leaderboardId,
                rankingIds: action.rankingIds,
                isFetching: false
            }
        case LeaderboardsDetailActionType.GetFailure:
            return {
                ...state,
                leaderboardId: null,
                rankingIds: [],
                isFetching: false
            }
        case LeaderboardsDetailActionType.DeleteRequest:
            return {
                ...state,
                isDeleting: true
            }
        case LeaderboardsDetailActionType.DeleteSuccess:
            return {
                ...state,
                leaderboardId: null,
                rankingIds: [],
                isDeleting: false
            }
        case LeaderboardsDetailActionType.DeleteFailure:
            return {
                ...state,
                isDeleting: false
            }
        case LeaderboardsDetailActionType.PostInviteRequest:
            return {
                ...state,
                isPostingInvite: true
            }
        case LeaderboardsDetailActionType.PostInviteSuccess:
            return {
                ...state,
                isPostingInvite: false
            }
        case LeaderboardsDetailActionType.PostInviteFailure:
            return {
                ...state,
                isPostingInvite: false
            }
        default:
            return state;
    }
}

export default leaderboardsDetailReducer;
