import { Switch, Route, Redirect, useRouteMatch } from "react-router-dom";

import EventHome from "./EventHome";
import AttendeesPage from "./AttendeesPage";

const EventRoot = () => {
    const match = useRouteMatch();

    return (
        <Switch>
            <Route exact path={match.path}>
                <EventHome />
            </Route>
            <Route path={`${match.path}/attendees`}>
                <AttendeesPage />
            </Route>
            <Redirect to={match.url} />
        </Switch>
    );
};

export default EventRoot;
