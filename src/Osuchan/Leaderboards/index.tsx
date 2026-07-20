import { Navigate, Route, Routes } from "react-router";

import LeaderboardList from "./LeaderboardList";
import LeaderboardRoot from "./Leaderboard";

const Leaderboards = () => {
    return (
        <Routes>
            <Route index element={<LeaderboardList />} />
            <Route path=":leaderboardId">
                <Route path="*" element={<LeaderboardRoot />} />
            </Route>
        </Routes>
    );
};

const LeaderboardsRoot = () => {
    return (
        <Routes>
            <Route path=":leaderboardType/:gamemode">
                <Route path="*" element={<Leaderboards />} />
            </Route>
            <Route path="*" element={<Navigate to="/leaderboards/global/osu" replace />} />
        </Routes>
    );
};

export default LeaderboardsRoot;
