import { UsersState, UsersAction, UsersActionType } from "./types";

const initialState: UsersState = {
    currentUserStatsId: null,
    scoreIds: [],
    leaderboardIds: [],
    isFetching: false
}

function profileReducer(state: UsersState = initialState, action: UsersAction): UsersState {
    switch (action.type) {
        case UsersActionType.Request:
            return {
                ...state,
                currentUserStatsId: null,
                scoreIds: [],
                leaderboardIds: [],
                isFetching: true
            }
        case UsersActionType.Success:
            return {
                ...state,
                currentUserStatsId: action.userStatsId,
                scoreIds: action.scoreIds,
                leaderboardIds: action.leaderboardIds,
                isFetching: false
            }
        case UsersActionType.Failure:
            return {
                ...state,
                currentUserStatsId: null,
                scoreIds: [],
                leaderboardIds: [],
                isFetching: false
            }
        default:
            return state;
    }
}

export default profileReducer;
