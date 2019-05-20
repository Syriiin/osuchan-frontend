import { ThunkAction } from "redux-thunk";
import axios from "axios";

import { MeActionType, MeRequest, MeSuccess, MeFailure, MeState, MeAction, UserData } from "./types";

// Actions

export function meRequest(): MeRequest {
    return {
        type: MeActionType.Request
    }
}

export function meSuccess(userData: UserData): MeSuccess {
    return {
        type: MeActionType.Success,
        userData
    }
}

export function meFailure(): MeFailure {
    return {
        type: MeActionType.Failure
    }
}

// Thunks

export function meThunkFetch(): ThunkAction<void, MeState, null, MeAction> {
    return async function(dispatch, getState) {
        dispatch(meRequest());

        try {
            const response = await axios.get("/osuauth/me");

            const userData: UserData = {
                id: response.data["id"],
                username: response.data["username"],
                country: response.data["country"],
                joinDate: new Date(response.data["join_date"])
            }

            dispatch(meSuccess(userData));
        } catch (error) {
            dispatch(meFailure());
        }
    }
}
