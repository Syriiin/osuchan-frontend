import { ProfileState, ProfileAction, ProfileActionType } from "./types";

const initialState: ProfileState = {
    profileData: null,
    scores: [],
    isFetching: false
}

function profileReducer(state: ProfileState = initialState, action: ProfileAction): ProfileState {
    switch (action.type) {
        case ProfileActionType.Request:
            return {
                ...state,
                profileData: null,
                isFetching: true
            }
        case ProfileActionType.Success:
            return {
                ...state,
                profileData: action.profileData,
                scores: action.scores,
                isFetching: false
            }
        case ProfileActionType.Failure:
            return {
                ...state,
                profileData: null,
                isFetching: false
            }
        default:
            return state;
    }
}

export default profileReducer;
