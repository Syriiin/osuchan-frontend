import { Switch, Route, useRouteMatch } from "react-router-dom";

import EventList from "./EventList";
import EventRoot from "./Event";

const EventsRoot = () => {
    const match = useRouteMatch();

    return (
        <Switch>
            <Route exact path={match.path}>
                <EventList />
            </Route>
            <Route path={`${match.path}/:slug`}>
                <EventRoot />
            </Route>
        </Switch>
    );
};

export default EventsRoot;
