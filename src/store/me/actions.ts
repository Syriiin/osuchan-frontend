import { Action } from "redux";
import { ThunkAction } from "redux-thunk";
import axios from "axios";

import { StoreState } from "../reducers";
import { OsuUser } from "../data/profiles/types";
import { addOsuUsers } from "../data/profiles/actions";
import { osuUserFromJson } from "../data/profiles/deserialisers";
import { MeActionType, MeRequest, MeSuccess, MeFailure } from "./types";

// Actions

export function meRequest(): MeRequest {
    return {
        type: MeActionType.Request
    }
}

export function meSuccess(osuUserId: number): MeSuccess {
    return {
        type: MeActionType.Success,
        osuUserId
    }
}

export function meFailure(): MeFailure {
    return {
        type: MeActionType.Failure
    }
}

// Thunks

export function meThunkFetch(): ThunkAction<void, StoreState, null, Action> {
    return async function(dispatch, getState) {
        dispatch(meRequest());

        try {
            const response = await axios.get("/osuauth/me");

            const osuUser: OsuUser = osuUserFromJson(response.data);

            dispatch(addOsuUsers(osuUser));

            dispatch(meSuccess(osuUser.id));
        } catch (error) {
            dispatch(meFailure());
        }
    }
}
