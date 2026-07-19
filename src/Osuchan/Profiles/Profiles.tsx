import { Navigate, Route, Routes } from "react-router-dom";

import Profile from "./Profile/Profile";

const Profiles = () => (
    <Routes>
        <Route path=":userString" element={<Profile />} />
        <Route path=":userString/:gamemodeName" element={<Profile />} />
        <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
);

export default Profiles;
