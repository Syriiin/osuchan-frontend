import { LeaderboardsListState, LeaderboardsListAction, LeaderboardsListActionType } from "./types";

const initialState: LeaderboardsListState = {
    leaderboardIds: [],
    isFetching: false,
    isPosting: false
}

function leaderboardsListReducer(state: LeaderboardsListState = initialState, action: LeaderboardsListAction): LeaderboardsListState {
    switch (action.type) {
        case LeaderboardsListActionType.GetRequest:
            return {
                ...state,
                leaderboardIds: [],
                isFetching: true
            }
        case LeaderboardsListActionType.GetSuccess:
            return {
                ...state,
                leaderboardIds: action.leaderboardIds,
                isFetching: false
            }
        case LeaderboardsListActionType.GetFailure:
            return {
                ...state,
                leaderboardIds: [],
                isFetching: false
            }
        case LeaderboardsListActionType.PostRequest:
            return {
                ...state,
                isPosting: true
            }
        case LeaderboardsListActionType.PostSuccess:
            return {
                ...state,
                leaderboardIds: [
                    ...state.leaderboardIds,
                    action.leaderboardId
                ],
                isPosting: false
            }
        case LeaderboardsListActionType.PostFailure:
            return {
                ...state,
                isPosting: false
            }
        default:
            return state;
    }
}

export default leaderboardsListReducer;
