import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { Helmet } from "react-helmet";
import styled from "styled-components";

import {
    AbsoluteDate,
    LoadingSection,
    Row,
    Surface,
    SurfaceHeaderContainer,
    SurfaceTitle,
    UnstyledLink,
} from "../../components";
import { PaginatedResourceStatus } from "../../store/status";
import { useStore } from "../../utils/hooks";

const EventsSurface = styled(Surface)`
    margin: 20px auto;
    width: 1000px;
    padding: 20px;
`;

const EventIconContainer = styled.div`
    width: 86px;
    height: 86px;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const EventIcon = styled.img`
    border-radius: 5px;
    max-width: 100%;
    max-height: 100%;
`;

const EventTitleContainer = styled.div`
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    margin-left: 10px;
    gap: 4px;
`;

const EventTitle = styled.span`
    font-size: 1.5em;
`;

const EventSubtitle = styled.span`
    color: ${(props) => props.theme.colours.timber};
`;

const EventList = observer(() => {
    const store = useStore();
    const { events, eventsStatus } = store.eventsStore;

    useEffect(() => {
        store.eventsStore.loadEvents();
    }, [store.eventsStore]);

    return (
        <>
            <Helmet>
                <title>Events - osu!chan</title>
            </Helmet>
            <EventsSurface>
                <SurfaceHeaderContainer>
                    <SurfaceTitle>Events</SurfaceTitle>
                </SurfaceHeaderContainer>

                {eventsStatus === PaginatedResourceStatus.LoadingInitial && <LoadingSection />}

                {eventsStatus === PaginatedResourceStatus.Loaded &&
                    events.map((event) => (
                        <UnstyledLink key={event.id} to={`/events/${event.slug}`}>
                            <Row hoverable>
                                <EventIconContainer>
                                    <EventIcon src={event.logo || "/static/icon-64.png"} />
                                </EventIconContainer>
                                <EventTitleContainer>
                                    <EventTitle>{event.name}</EventTitle>
                                    <EventSubtitle>
                                        <AbsoluteDate date={event.startDate} /> -{" "}
                                        <AbsoluteDate date={event.endDate} />
                                    </EventSubtitle>
                                </EventTitleContainer>
                            </Row>
                        </UnstyledLink>
                    ))}

                {eventsStatus === PaginatedResourceStatus.Loaded && events.length === 0 && (
                    <p>No events found.</p>
                )}
            </EventsSurface>
        </>
    );
});

export default EventList;
