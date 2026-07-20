import { Route, Routes } from "react-router";

import EventList from "./EventList";
import EventRoot from "./Event";

const EventsRoot = () => {
    return (
        <Routes>
            <Route index element={<EventList />} />
            <Route path=":slug">
                <Route path="*" element={<EventRoot />} />
            </Route>
        </Routes>
    );
};

export default EventsRoot;
