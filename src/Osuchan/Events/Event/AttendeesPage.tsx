import { useEffect, useMemo, useState } from "react";
import { observer } from "mobx-react-lite";
import { Helmet } from "react-helmet";
import { useParams, useRouteMatch } from "react-router-dom";
import styled, { ThemeProvider, useTheme } from "styled-components";

import {
    Button,
    LoadingPage,
    Surface,
    UnstyledLink,
} from "../../../components";
import { ResourceStatus } from "../../../store/status";
import { useStore } from "../../../utils/hooks";
import { setCssCustomProperties, clearCssCustomProperties } from "../../../utils/general";

const AttendeesSurface = styled(Surface)`
    margin: 20px auto;
    width: 1000px;
    padding: 20px;
`;

const PageHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 15px;
`;

const Title = styled.h3`
    margin: 0;
    font-size: 1.5em;
    font-weight: 700;
`;

const AttendeeRow = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 0;

    > a {
        display: flex;
        align-items: center;
        gap: 10px;
        flex: 1;
        text-decoration: none;
    }
`;

const AttendeeAvatar = styled.img`
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: 2px solid ${(props) => props.theme.colours.midground};
`;



const PaginationBar = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 15px;
    gap: 10px;
`;

const CountInfo = styled.span`
    color: ${(props) => props.theme.colours.timber};
    font-size: 0.9em;
`;

const PAGE_SIZE = 50;

const AttendeesPage = observer(() => {
    const { slug } = useParams<{ slug: string }>();
    const { url } = useRouteMatch();
    const store = useStore();
    const {
        event,
        loadingStatus,
        eventAttendees,
        loadingAttendeesStatus,
        attendeesCount,
        isRemovingAttendee,
    } = store.eventsStore;
    const meStore = store.meStore;

    const [offset, setOffset] = useState(0);

    useEffect(() => {
        store.eventsStore.loadEvent(slug);
    }, [store.eventsStore, slug]);

    useEffect(() => {
        store.eventsStore.loadAttendees(slug, PAGE_SIZE, offset);
    }, [store.eventsStore, slug, offset]);

    const outerTheme = useTheme();
    const mergedTheme = event
        ? {
              ...outerTheme,
              colours: {
                  ...outerTheme.colours,
                  ...event.themeColours,
              },
          }
        : outerTheme;

    const themeColours = useMemo(
        () => (event?.themeColours ? { ...event.themeColours } : undefined),
        [event]
    );
    useEffect(() => {
        if (themeColours) {
            setCssCustomProperties(themeColours);
        }
        return () => {
            if (themeColours) {
                clearCssCustomProperties(themeColours);
            }
        };
    }, [themeColours]);

    const isOrganiser =
        meStore.user &&
        event?.organisers?.some((o) => o.id === meStore.user?.osuUserId);

    const eventUrl = url.replace(/\/attendees$/, "");

    return (
        <>
            <Helmet>
                {loadingStatus === ResourceStatus.Loading && (
                    <title>Loading...</title>
                )}
                {loadingStatus === ResourceStatus.Loaded && event && (
                    <title>{event.name} - Attendees - osu!chan</title>
                )}
                {loadingStatus === ResourceStatus.Error && (
                    <title>Event not found - osu!chan</title>
                )}
            </Helmet>

            {loadingStatus === ResourceStatus.Loading && <LoadingPage />}

            {loadingStatus === ResourceStatus.Error && (
                <h3>Event not found!</h3>
            )}

            {loadingStatus === ResourceStatus.Loaded && event && (
                <ThemeProvider theme={mergedTheme}>
                    <AttendeesSurface>
                        <PageHeader>
                            <Title>Attendees ({attendeesCount})</Title>
                            <UnstyledLink to={eventUrl}>
                                <Button type="button">&larr; Back to Event</Button>
                            </UnstyledLink>
                        </PageHeader>

                        {loadingAttendeesStatus === ResourceStatus.Loading && (
                            <LoadingPage />
                        )}

                        {loadingAttendeesStatus === ResourceStatus.Loaded &&
                            eventAttendees.map((attendee) => (
                                <AttendeeRow key={attendee.id}>
                                    <UnstyledLink
                                        to={`/users/${attendee.user.username}`}
                                    >
                                        <AttendeeAvatar
                                            src={`https://a.ppy.sh/${attendee.user.id}`}
                                            alt={attendee.user.username}
                                        />
                                        <span>
                                            {attendee.user.username}
                                        </span>
                                    </UnstyledLink>
                                    {isOrganiser && (
                                        <Button
                                            negative
                                            type="button"
                                            isLoading={isRemovingAttendee}
                                            action={() =>
                                                store.eventsStore.removeAttendee(
                                                    slug,
                                                    attendee.user.id
                                                )
                                            }
                                            confirmationMessage={`Remove ${attendee.user.username}?`}
                                        >
                                            Remove
                                        </Button>
                                    )}
                                </AttendeeRow>
                            ))}

                        <PaginationBar>
                            <CountInfo>
                                Showing {offset + 1}–
                                {Math.min(offset + PAGE_SIZE, attendeesCount)} of{" "}
                                {attendeesCount}
                            </CountInfo>
                            {attendeesCount > PAGE_SIZE && (
                                <div style={{ display: "flex", gap: "8px" }}>
                                    <Button
                                        type="button"
                                        disabled={offset === 0}
                                        action={() =>
                                            setOffset(
                                                Math.max(0, offset - PAGE_SIZE)
                                            )
                                        }
                                    >
                                        Previous
                                    </Button>
                                    <Button
                                        type="button"
                                        disabled={
                                            offset + PAGE_SIZE >= attendeesCount
                                        }
                                        action={() =>
                                            setOffset(offset + PAGE_SIZE)
                                        }
                                    >
                                        Next
                                    </Button>
                                </div>
                            )}
                        </PaginationBar>
                    </AttendeesSurface>
                </ThemeProvider>
            )}
        </>
    );
});

export default AttendeesPage;
