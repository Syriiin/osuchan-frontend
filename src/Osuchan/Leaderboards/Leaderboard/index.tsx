import { Route, Routes } from "react-router";

import LeaderboardHome from "./LeaderboardHome";

const LeaderboardRoot = () => {
    return (
        <Routes>
            <Route path="*" element={<LeaderboardHome />} />
        </Routes>
    );
};

export default LeaderboardRoot;
