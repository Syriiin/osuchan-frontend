import { Navigate, Route, Routes } from "react-router";

import Invites from "./Invites";

const Me = () => (
    <Routes>
        <Route path="invites" element={<Invites />} />
        <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
);

export default Me;
