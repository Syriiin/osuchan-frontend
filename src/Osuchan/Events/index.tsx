import { Route, Routes } from "react-router-dom";

import EventList from "./EventList";
import EventRoot from "./Event";

const EventsRoot = () => {
    return (
        <Routes>
            <Route index element={<EventList />} />
            <Route path=":slug/*" element={<EventRoot />} />
        </Routes>
    );
};

export default EventsRoot;
