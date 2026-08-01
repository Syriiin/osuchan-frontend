import { observer } from "mobx-react-lite";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router";
import styled, { ThemeProvider, useTheme } from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";

import {
    AbsoluteDate,
    Button,
    LoadingPage,
    NumberFormat,
    ScoreModal,
    Surface,
    Tooltip,
    UnstyledLink,
} from "../../../components";
import type { Score } from "../../../store/models/profiles/types";
import type { EventStats } from "../../../store/models/events/types";
import { ShortTimeAgo } from "../../../components/layout/TimeAgo";
import { ResourceStatus } from "../../../store/status";
import { useStore } from "../../../utils/hooks";
import {
    formatGamemodeName,
    formatGamemodeNameShort,
    gamemodeIcon,
    formatPlayTime,
} from "../../../utils/formatting";
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

const StatsGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    gap: 12px;

    @media (min-width: 600px) {
        grid-template-columns: 1fr 1fr;
    }

    @media (min-width: 900px) {
        grid-template-columns: repeat(3, 1fr);
    }
`;

const StatCard = styled.div`
    background-color: ${(props) => props.theme.colours.foreground};
    border-radius: 8px;
    padding: 12px;
    text-align: center;
`;

const StatValue = styled.div`
    font-size: 1.4em;
    font-weight: 700;
`;

const StatLabel = styled.div`
    font-size: 0.8em;
    color: ${(props) => props.theme.colours.timber};
    margin-top: 4px;
`;

const InfoIcon = styled(FontAwesomeIcon)`
    color: ${(props) => props.theme.colours.timber};
    cursor: help;
`;

const EventStatsPanel = ({ stats }: { stats: EventStats }) => (
    <>
        <StatsGrid>
            <StatCard>
                <StatValue>
                    <NumberFormat value={stats.totalScores} />
                </StatValue>
                <StatLabel>Scores</StatLabel>
            </StatCard>
            <StatCard>
                <StatValue>
                    <NumberFormat value={stats.totalPp} decimalPlaces={0} />
                </StatValue>
                <StatLabel>
                    Total PP{" "}
                    <Tooltip content="Sum of the pp of every submitted score, not weighted.">
                        <InfoIcon icon={faCircleInfo} />
                    </Tooltip>
                </StatLabel>
            </StatCard>
            <StatCard>
                <StatValue>
                    <NumberFormat value={stats.totalRegularHits} />
                </StatValue>
                <StatLabel>
                    Circles Clicked{" "}
                    <Tooltip content="+ fruits caught, drums hit, keys played.">
                        <InfoIcon icon={faCircleInfo} />
                    </Tooltip>
                </StatLabel>
            </StatCard>
            <StatCard>
                <StatValue>{formatPlayTime(stats.totalPlayTime)}</StatValue>
                <StatLabel>Played</StatLabel>
            </StatCard>
            <StatCard>
                <StatValue>
                    <NumberFormat value={stats.uniqueCountries} />
                </StatValue>
                <StatLabel>Countries</StatLabel>
            </StatCard>
            <StatCard>
                <StatValue>
                    <NumberFormat value={stats.uniqueMaps} />
                </StatValue>
                <StatLabel>Unique Beatmaps Played</StatLabel>
            </StatCard>
        </StatsGrid>
    </>
);

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

const LeaderboardCardGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    gap: 12px;

    @media (min-width: 600px) {
        grid-template-columns: 1fr 1fr;
    }

    @media (min-width: 900px) {
        grid-template-columns: repeat(4, 1fr);
    }
`;

const LeaderboardCard = styled.div`
    background-color: ${(props) => props.theme.colours.foreground};
    border-radius: 8px;
    overflow: hidden;
    display: flex;
    flex-direction: column;

    > a {
        flex: 1;
        display: flex;
        flex-direction: column;
        text-decoration: none;
        color: unset;
        transition: background-color 0.15s;

        &:hover {
            background-color: ${(props) => props.theme.colours.pillow};
        }
    }
`;

const LeaderboardCardIconWrapper = styled.div`
    display: flex;
    justify-content: center;
    padding: 16px 16px 8px;
`;

const LeaderboardCardIcon = styled.img`
    width: 64px;
    height: 64px;
    border-radius: 5px;
    object-fit: contain;
`;

const LeaderboardCardBody = styled.div`
    padding: 0 12px 12px;
    text-align: center;
`;

const LeaderboardCardName = styled.div`
    font-weight: 700;
    font-size: 1.1em;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

const LeaderboardGamemodeRow = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
    margin-top: 4px;
`;

const LeaderboardGamemodeIcon = styled.img`
    width: 14px;
    height: 14px;
    filter: brightness(0) invert(1);
`;

const LeaderboardGamemodeName = styled.span`
    font-size: 0.85em;
    color: ${(props) => props.theme.colours.timber};
`;

const LeaderboardDeleteWrapper = styled.div`
    padding: 8px 12px 12px;
    text-align: center;
`;

const ScoreRow = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 4px 12px;
    cursor: pointer;
    transition: background-color 0.15s;

    &:hover {
        background-color: ${(props) => props.theme.colours.midground};
    }
`;

const ScoreRank = styled.span`
    font-size: 0.8em;
    font-weight: 600;
    color: ${(props) => props.theme.colours.timber};
    width: 24px;
    text-align: center;
    flex-shrink: 0;
`;

const ScoreAvatar = styled.img`
    width: 24px;
    height: 24px;
    border-radius: 4px;
    flex-shrink: 0;
`;

const ScoreUsername = styled.span`
    font-size: 0.85em;
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

const ScoreTime = styled.span`
    font-size: 0.8em;
    color: ${(props) => props.theme.colours.timber};
    white-space: nowrap;
`;

const ScorePpValue = styled.span`
    font-size: 0.85em;
    font-weight: 600;
    white-space: nowrap;
`;

const NoScores = styled.p`
    color: ${(props) => props.theme.colours.timber};
    font-size: 0.8em;
    margin: 4px 12px 8px;
`;

const LbScoreRow = ({ score, rank }: { score: Score; rank: number }) => {
    const [modalOpen, setModalOpen] = useState(false);
    const userStats = score.userStats!;
    const osuUser = userStats.osuUser!;

    return (
        <>
            <ScoreRow onClick={() => setModalOpen(true)}>
                <ScoreRank>#{rank}</ScoreRank>
                <ScoreAvatar src={`https://a.ppy.sh/${userStats.osuUserId}`} />
                <ScoreUsername>{osuUser.username}</ScoreUsername>
                <ScoreTime>
                    <ShortTimeAgo date={score.date} />
                </ScoreTime>
                <ScorePpValue>
                    <NumberFormat value={score.performanceTotal} decimalPlaces={0} />
                    pp
                </ScorePpValue>
            </ScoreRow>
            <ScoreModal score={score} open={modalOpen} onClose={() => setModalOpen(false)} />
        </>
    );
};

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
        leaderboardScores,
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

                    {event.stats && (
                        <EventSurface>
                            <SectionHeader>
                                <SectionTitle>Event Stats</SectionTitle>
                            </SectionHeader>
                            <EventStatsPanel stats={event.stats} />
                        </EventSurface>
                    )}

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
                        {loadingLeaderboardsStatus === ResourceStatus.Loaded && (
                            <LeaderboardCardGrid>
                                {[...eventLeaderboards]
                                    .sort((a, b) => a.id - b.id)
                                    .map((lb) => (
                                        <LeaderboardCard key={lb.id}>
                                            <UnstyledLink
                                                to={`/leaderboards/community/${formatGamemodeNameShort(
                                                    lb.leaderboard.gamemode,
                                                )}/${lb.leaderboard.id}`}
                                            >
                                                <LeaderboardCardIconWrapper>
                                                    <LeaderboardCardIcon
                                                        src={
                                                            lb.leaderboard.iconUrl ||
                                                            "/static/icon.svg"
                                                        }
                                                    />
                                                </LeaderboardCardIconWrapper>
                                                <LeaderboardCardBody>
                                                    <LeaderboardCardName>
                                                        {lb.leaderboard.name}
                                                    </LeaderboardCardName>
                                                    <LeaderboardGamemodeRow>
                                                        <LeaderboardGamemodeIcon
                                                            src={gamemodeIcon(
                                                                lb.leaderboard.gamemode,
                                                            )}
                                                            alt=""
                                                        />
                                                        <LeaderboardGamemodeName>
                                                            {formatGamemodeName(
                                                                lb.leaderboard.gamemode,
                                                            )}
                                                        </LeaderboardGamemodeName>
                                                    </LeaderboardGamemodeRow>
                                                </LeaderboardCardBody>
                                            </UnstyledLink>
                                            {(leaderboardScores.get(lb.leaderboard.id) ?? [])
                                                .length > 0 ? (
                                                leaderboardScores
                                                    .get(lb.leaderboard.id)!
                                                    .slice(0, 5)
                                                    .map((score, i) => (
                                                        <LbScoreRow
                                                            key={score.id}
                                                            score={score}
                                                            rank={i + 1}
                                                        />
                                                    ))
                                            ) : (
                                                <NoScores>No scores yet.</NoScores>
                                            )}
                                            {isOrganiser && (
                                                <LeaderboardDeleteWrapper>
                                                    <Button
                                                        $negative
                                                        type="button"
                                                        isLoading={isDeletingLeaderboard}
                                                        action={() =>
                                                            store.eventsStore.deleteLeaderboard(
                                                                slug,
                                                                lb.id,
                                                            )
                                                        }
                                                        confirmationMessage={`Delete leaderboard "${lb.leaderboard.name}"?`}
                                                    >
                                                        Delete
                                                    </Button>
                                                </LeaderboardDeleteWrapper>
                                            )}
                                        </LeaderboardCard>
                                    ))}
                            </LeaderboardCardGrid>
                        )}
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
