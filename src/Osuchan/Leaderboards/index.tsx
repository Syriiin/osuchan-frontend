import { Navigate, Route, Routes } from "react-router-dom";

import LeaderboardList from "./LeaderboardList";
import LeaderboardRoot from "./Leaderboard";

const Leaderboards = () => {
    return (
        <Routes>
            <Route index element={<LeaderboardList />} />
            <Route path=":leaderboardId/*" element={<LeaderboardRoot />} />
        </Routes>
    );
};

const LeaderboardsRoot = () => {
    return (
        <Routes>
            <Route path=":leaderboardType/:gamemode/*" element={<Leaderboards />} />
            <Route path="*" element={<Navigate to="/leaderboards/global/osu" replace />} />
        </Routes>
    );
};

export default LeaderboardsRoot;
