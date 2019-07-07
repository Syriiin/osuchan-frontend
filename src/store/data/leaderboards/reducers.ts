import { LeaderboardsDataState, LeaderboardsAction, LeaderboardsActionType, Leaderboard, Membership, Invite } from "./types";

const initialState: LeaderboardsDataState = {
    leaderboards: {},
    memberships: {},
    invites: {}
}

function leaderboardsReducer(state: LeaderboardsDataState = initialState, action: LeaderboardsAction): LeaderboardsDataState {
    switch (action.type) {
        case LeaderboardsActionType.AddLeaderboards:
            const leaderboards: { [id: number]: Leaderboard } = {};
            for (const leaderboard of action.leaderboards) {
                leaderboards[leaderboard.id] = leaderboard;
            }
            return {
                ...state,
                leaderboards: {
                    ...state.leaderboards,
                    ...leaderboards
                }
            }
        case LeaderboardsActionType.AddMemberships:
            const memberships: { [id: number]: Membership } = {};
            for (const membership of action.memberships) {
                memberships[membership.id] = membership;
            }
            return {
                ...state,
                memberships: {
                    ...state.memberships,
                    ...memberships
                }
            }
        case LeaderboardsActionType.AddInvites:
            const invites: { [id: number]: Invite } = {};
            for (const invite of action.invites) {
                invites[invite.id] = invite;
            }
            return {
                ...state,
                invites: {
                    ...state.invites,
                    ...invites
                }
            }
        default:
            return state;
    }
}

export default leaderboardsReducer;
