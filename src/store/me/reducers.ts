import { MeState, MeAction, MeActionType } from "./types";

const initialState: MeState = {
    osuUserId: null,
    isFetching: false
}

function meReducer(state: MeState = initialState, action: MeAction): MeState {
    switch (action.type) {
        case MeActionType.Request:
            return {
                ...state,
                osuUserId: null,
                isFetching: true
            }
        case MeActionType.Success:
            return {
                ...state,
                osuUserId: action.osuUserId,
                isFetching: false
            }
        case MeActionType.Failure:
            return {
                ...state,
                osuUserId: null,
                isFetching: false
            }
        default:
            return state;
    }
}

export default meReducer;
