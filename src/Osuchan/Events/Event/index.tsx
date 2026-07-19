import { Navigate, Route, Routes } from "react-router-dom";

import EventHome from "./EventHome";
import AttendeesPage from "./AttendeesPage";

const EventRoot = () => {
    return (
        <Routes>
            <Route index element={<EventHome />} />
            <Route path="attendees" element={<AttendeesPage />} />
            <Route path="*" element={<Navigate to="." replace />} />
        </Routes>
    );
};

export default EventRoot;
