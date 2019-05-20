import { MeState, MeAction, MeActionType } from "./types";

const initialState: MeState = {
    userData: null,
    isFetching: false
}

function meReducer(state: MeState = initialState, action: MeAction): MeState {
    switch (action.type) {
        case MeActionType.Request:
            return {
                ...state,
                userData: null,
                isFetching: true
            }
        case MeActionType.Success:
            return {
                ...state,
                userData: action.userData,
                isFetching: false
            }
        case MeActionType.Failure:
            return {
                ...state,
                userData: null,
                isFetching: false
            }
        default:
            return state;
    }
}

export default meReducer;
