import { MeState, MeAction, MeActionType } from "./types";

const initialState: MeState = {
    osuUserId: null,
    leaderboardIds: [],
    inviteIds: [],
    isFetching: false,
    isPosting: false,
    isDeleting: false
}

function meReducer(state: MeState = initialState, action: MeAction): MeState {
    switch (action.type) {
        case MeActionType.GetRequest:
            return {
                ...state,
                osuUserId: null,
                leaderboardIds: [],
                isFetching: true
            }
        case MeActionType.GetSuccess:
            return {
                ...state,
                osuUserId: action.osuUserId,
                leaderboardIds: action.leaderboardIds,
                inviteIds: action.inviteIds,
                isFetching: false
            }
        case MeActionType.GetFailure:
            return {
                ...state,
                osuUserId: null,
                leaderboardIds: [],
                isFetching: false
            }
        case MeActionType.JoinLeaderboardPostRequest:
            return {
                ...state,
                isPosting: true
            }
        case MeActionType.JoinLeaderboardPostSuccess:
            return {
                ...state,
                leaderboardIds: [
                    ...state.leaderboardIds,
                    action.leaderboardId
                ],
                isPosting: false
            }
        case MeActionType.JoinLeaderboardPostFailure:
            return {
                ...state,
                isPosting: false
            }
        case MeActionType.LeaveLeaderboardDeleteRequest:
            return {
                ...state,
                isDeleting: true
            }
        case MeActionType.LeaveLeaderboardDeleteSuccess:
            return {
                ...state,
                leaderboardIds: state.leaderboardIds.filter(id => id !== action.leaderboardId),
                isDeleting: false
            }
        case MeActionType.LeaveLeaderboardDeleteFailure:
            return {
                ...state,
                isDeleting: false
            }
        default:
            return state;
    }
}

export default meReducer;
