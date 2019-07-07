import { LeaderboardsUserState, LeaderboardsUserAction, LeaderboardsUserActionType } from "./types";

const initialState: LeaderboardsUserState = {
    leaderboardId: null,
    membershipId: null,
    scoreIds: [],
    isFetching: false
}

function leaderboardsUserReducer(state: LeaderboardsUserState = initialState, action: LeaderboardsUserAction): LeaderboardsUserState {
    switch (action.type) {
        case LeaderboardsUserActionType.Request:
            return {
                ...state,
                leaderboardId: null,
                membershipId: null,
                scoreIds: [],
                isFetching: true
            }
        case LeaderboardsUserActionType.Success:
            return {
                ...state,
                leaderboardId: action.leaderboardId,
                membershipId: action.membershipId,
                scoreIds: action.scoreIds,
                isFetching: false
            }
        case LeaderboardsUserActionType.Failure:
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

export default leaderboardsUserReducer;
