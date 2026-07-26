import { observer } from "mobx-react-lite";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router";
import styled, { ThemeProvider, useTheme } from "styled-components";

import {
    AbsoluteDate,
    Button,
    CommunityLeaderboardRow,
    LoadingPage,
    Surface,
    UnstyledLink,
} from "../../../components";
import { ResourceStatus } from "../../../store/status";
import { useStore } from "../../../utils/hooks";
import { formatGamemodeNameShort } from "../../../utils/formatting";
import { setCssCustomProperties, clearCssCustomProperties } from "../../../utils/general";
import AddAttendeeModal from "./AddAttendeeModal";
import ChallengesSection from "./ChallengesSection";
import CreateLeaderboardModal from "./CreateLeaderboardModal";

const EventSurface = styled(Surface)`
    margin: 20px auto;
    width: 1000px;
    padding: 20px;
`;

const EventHeader = styled.div`
    display: flex;
    align-items: center;
    gap: 20px;
`;

const EventLogo = styled.img`
    width: 128px;
    height: 128px;
    border-radius: 5px;
    object-fit: contain;
`;

const EventInfo = styled.div`
    flex: 1;
`;

const EventName = styled.div`
    font-size: 2em;
    font-weight: bold;
`;

const EventDates = styled.div`
    color: ${(props) => props.theme.colours.timber};
    margin-top: 5px;
`;

const EventDescription = styled.div`
    margin-top: 15px;
    color: ${(props) => props.theme.colours.timber};
`;

const SectionTitle = styled.h3`
    margin: 0 0 15px 0;
    font-size: 1.5em;
    font-weight: 700;
`;

const SectionHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 15px;
`;

const MAX_VISIBLE_AVATARS = 10;

const AvatarStack = styled.div`
    display: flex;
    align-items: center;
`;

const AvatarWrapper = styled.div<{ $index: number }>`
    width: 40px;
    height: 40px;
    margin-left: ${(props) => (props.$index === 0 ? "0" : "-10px")};
    opacity: ${(props) => Math.max(0.3, 1 - props.$index / MAX_VISIBLE_AVATARS)};
    transition: opacity 0.2s;

    &:hover {
        opacity: 1;
    }
`;

const AvatarImage = styled.img`
    width: 100%;
    height: 100%;
    border-radius: 50%;
    border: 2px solid ${(props) => props.theme.colours.midground};
`;

const ExtraCount = styled.div`
    margin-left: 8px;
    font-size: 0.9em;
    color: ${(props) => props.theme.colours.timber};
    white-space: nowrap;
`;

const LeaderboardRow = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    margin: 5px 0;

    > a {
        flex: 1;
        text-decoration: none;
    }
`;

const EventHome = observer(() => {
    const params = useParams<{ slug: string }>();
    const slug = params.slug!;

    const store = useStore();
    const {
        event,
        loadingStatus,
        eventAttendees,
        loadingAttendeesStatus,
        attendeesCount,
        eventLeaderboards,
        loadingLeaderboardsStatus,
        challenges,
        challengeScores,
        loadingChallengesStatus,
        isDeletingLeaderboard,
    } = store.eventsStore;
    const meStore = store.meStore;

    const [addAttendeeModalOpen, setAddAttendeeModalOpen] = useState(false);
    const [createLeaderboardModalOpen, setCreateLeaderboardModalOpen] = useState(false);

    useEffect(() => {
        store.eventsStore.loadEvent(slug);
        store.eventsStore.loadAttendees(slug, MAX_VISIBLE_AVATARS);
        store.eventsStore.loadLeaderboards(slug);
        store.eventsStore.loadChallenges(slug);
    }, [store.eventsStore, slug]);

    useEffect(() => {
        return () => {
            store.eventsStore.unload();
        };
    }, [store.eventsStore]);

    const themeColours = useMemo(
        () => (event?.themeColours ? { ...event.themeColours } : undefined),
        [event],
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

    const isOrganiser =
        meStore.user && event?.organisers?.some((o) => o.id === meStore.user?.osuUserId);

    return (
        <>
            <title>
                {loadingStatus === ResourceStatus.Loading
                    ? "Loading..."
                    : loadingStatus === ResourceStatus.Loaded && event
                      ? `${event.name} - osu!chan`
                      : loadingStatus === ResourceStatus.Error
                        ? "Event not found - osu!chan"
                        : "osu!chan"}
            </title>
            {loadingStatus === ResourceStatus.Loading && <LoadingPage />}

            {loadingStatus === ResourceStatus.Error && <h3>Event not found!</h3>}

            {loadingStatus === ResourceStatus.Loaded && event && (
                <ThemeProvider theme={mergedTheme}>
                    <EventSurface>
                        <EventHeader>
                            {event.logo && <EventLogo src={event.logo} alt={event.name} />}
                            <EventInfo>
                                <EventName>{event.name}</EventName>
                                <EventDates>
                                    <AbsoluteDate date={event.startDate} /> -{" "}
                                    <AbsoluteDate date={event.endDate} />
                                </EventDates>
                                {event.description && (
                                    <EventDescription>{event.description}</EventDescription>
                                )}
                            </EventInfo>
                        </EventHeader>
                    </EventSurface>

                    <EventSurface>
                        <SectionHeader>
                            <SectionTitle>Attendees ({attendeesCount})</SectionTitle>
                            {isOrganiser && (
                                <Button type="button" action={() => setAddAttendeeModalOpen(true)}>
                                    Add Attendee
                                </Button>
                            )}
                        </SectionHeader>
                        {loadingAttendeesStatus === ResourceStatus.Loading && <LoadingPage />}
                        {loadingAttendeesStatus === ResourceStatus.Loaded && (
                            <AvatarStack>
                                {eventAttendees
                                    .slice(0, MAX_VISIBLE_AVATARS)
                                    .map((attendee, index) => (
                                        <AvatarWrapper key={attendee.id} $index={index}>
                                            <UnstyledLink to={`/users/${attendee.user.username}`}>
                                                <AvatarImage
                                                    src={`https://a.ppy.sh/${attendee.user.id}`}
                                                    alt={attendee.user.username}
                                                />
                                            </UnstyledLink>
                                        </AvatarWrapper>
                                    ))}
                                {attendeesCount > MAX_VISIBLE_AVATARS && (
                                    <UnstyledLink to="attendees">
                                        <ExtraCount>
                                            +{attendeesCount - MAX_VISIBLE_AVATARS} more
                                        </ExtraCount>
                                    </UnstyledLink>
                                )}
                                {attendeesCount > 0 && attendeesCount <= MAX_VISIBLE_AVATARS && (
                                    <UnstyledLink to="attendees">
                                        <ExtraCount>View all</ExtraCount>
                                    </UnstyledLink>
                                )}
                            </AvatarStack>
                        )}
                        {loadingAttendeesStatus === ResourceStatus.Loaded &&
                            eventAttendees.length === 0 && <p>No attendees yet.</p>}
                    </EventSurface>

                    <EventSurface>
                        <SectionHeader>
                            <SectionTitle>Leaderboards</SectionTitle>
                            {isOrganiser && (
                                <Button
                                    type="button"
                                    action={() => setCreateLeaderboardModalOpen(true)}
                                >
                                    Create Leaderboard
                                </Button>
                            )}
                        </SectionHeader>
                        {loadingLeaderboardsStatus === ResourceStatus.Loading && <LoadingPage />}
                        {loadingLeaderboardsStatus === ResourceStatus.Loaded &&
                            eventLeaderboards.map((lb) => (
                                <LeaderboardRow key={lb.id}>
                                    <UnstyledLink
                                        to={`/leaderboards/community/${formatGamemodeNameShort(
                                            lb.leaderboard.gamemode,
                                        )}/${lb.leaderboard.id}`}
                                    >
                                        <CommunityLeaderboardRow leaderboard={lb.leaderboard} />
                                    </UnstyledLink>
                                    {isOrganiser && (
                                        <Button
                                            $negative
                                            type="button"
                                            isLoading={isDeletingLeaderboard}
                                            action={() =>
                                                store.eventsStore.deleteLeaderboard(slug, lb.id)
                                            }
                                            confirmationMessage={`Delete leaderboard "${lb.leaderboard.name}"?`}
                                        >
                                            Delete
                                        </Button>
                                    )}
                                </LeaderboardRow>
                            ))}
                        {loadingLeaderboardsStatus === ResourceStatus.Loaded &&
                            eventLeaderboards.length === 0 && <p>No leaderboards yet.</p>}
                    </EventSurface>

                    <ChallengesSection
                        challenges={challenges}
                        challengeScores={challengeScores}
                        loadingStatus={loadingChallengesStatus}
                        isOrganiser={isOrganiser}
                        slug={slug}
                    />

                    <AddAttendeeModal
                        open={addAttendeeModalOpen}
                        onClose={() => setAddAttendeeModalOpen(false)}
                        slug={slug}
                    />
                    <CreateLeaderboardModal
                        open={createLeaderboardModalOpen}
                        onClose={() => setCreateLeaderboardModalOpen(false)}
                        slug={slug}
                    />
                </ThemeProvider>
            )}
        </>
    );
});

export default EventHome;
