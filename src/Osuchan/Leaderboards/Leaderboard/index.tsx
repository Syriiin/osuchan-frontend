import { Route, Routes } from "react-router-dom";

import LeaderboardHome from "./LeaderboardHome";

const LeaderboardRoot = () => {
    return (
        <Routes>
            <Route path="*" element={<LeaderboardHome />} />
        </Routes>
    );
};

export default LeaderboardRoot;
