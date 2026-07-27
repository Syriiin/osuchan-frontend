import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router";
import { observer } from "mobx-react-lite";
import styled, { ThemeProvider, useTheme } from "styled-components";

import { LoadingPage } from "../../components";
import { setCssCustomProperties, clearCssCustomProperties } from "../../utils/general";
import { useEventDashboard } from "../../store/events/api";
import type { DashboardData, LeaderboardDetailData, ChallengeScores } from "../../store/events/api";
import type { BeatmapChallenge } from "../../store/models/events/types";
import LeaderboardSlide from "./LeaderboardSlide";
import ChallengesSlide from "./ChallengesSlide";
import SlideIndicator from "./SlideIndicator";

type DashboardSlide =
    | { type: "leaderboard"; data: LeaderboardDetailData }
    | { type: "challenges"; challenges: BeatmapChallenge[]; challengeScores: ChallengeScores };

const DashboardWrapper = styled.div`
    background-color: ${(props) => props.theme.colours.background};
    display: flex;
    flex-direction: column;
    height: 100vh;
    overflow: hidden;
`;

const Header = styled.div`
    display: flex;
    align-items: center;
    padding: 0.8em 2em;
    flex-shrink: 0;
`;

const HeaderSection = styled.div<{ $align: "left" | "center" | "right" }>`
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: ${(props) =>
        props.$align === "left" ? "flex-start" : props.$align === "center" ? "center" : "flex-end"};
    min-width: 0;
`;

const EventLogo = styled.img`
    width: 3em;
    height: 3em;
    border-radius: 5px;
    object-fit: contain;
    flex-shrink: 0;
`;

const EventName = styled.h1`
    font-size: 1.5em;
    font-weight: 700;
    margin: 0 0 0 0.5em;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

const EventUrl = styled.a`
    font-size: 0.7em;
    color: ${(props) => props.theme.colours.timber};
    text-decoration: none;
    flex-shrink: 0;
    &:hover {
        text-decoration: underline;
    }
`;

const BottomBar = styled.div`
    display: flex;
    align-items: center;
    padding: 0.3em 2em;
    flex-shrink: 0;
`;

const BottomSection = styled.div<{ $align: "left" | "center" | "right" }>`
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: ${(props) =>
        props.$align === "left" ? "flex-start" : props.$align === "center" ? "center" : "flex-end"};
    min-width: 0;
`;

const AttendeeCount = styled.span`
    font-size: 0.7em;
    color: ${(props) => props.theme.colours.timber};
`;

const SlideTitle = styled.div`
    text-align: center;
    overflow: hidden;
`;

const SlideTitleText = styled.h2`
    font-size: 1.6em;
    font-weight: 600;
    margin: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

const SlideSubtitle = styled.span`
    font-size: 0.7em;
    color: ${(props) => props.theme.colours.timber};
    display: block;
    line-height: 1;
`;

const TitleContainer = styled.div`
    display: flex;
    align-items: center;
    flex-shrink: 0;
    white-space: nowrap;
`;

const Logo = styled.img`
    width: 36px;
    margin-right: 10px;
`;

const BrandTitle = styled.h1`
    display: flex;
    align-items: center;
    margin: 10px;
    font-size: 2em;
    font-weight: 400;
`;

const TitleText = styled.span`
    transform: translateY(-4px);
`;

const ProgressBar = styled.div`
    height: 3px;
    background-color: ${(props) => props.theme.colours.midground};
    flex-shrink: 0;
    position: relative;
`;

const ProgressFill = styled.div<{ $progress: number }>`
    height: 100%;
    width: ${(props) => props.$progress * 100}%;
    background-color: ${(props) => props.theme.colours.mango};
    transition: width 0.1s linear;
`;

const SlideContainer = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    position: relative;
`;

const SlideWrapper = styled.div<{ $visible: boolean }>`
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    opacity: ${(props) => (props.$visible ? 1 : 0)};
    transition: opacity 0.5s ease;
    pointer-events: none;
`;

function buildSlides(data: DashboardData): DashboardSlide[] {
    const sorted = [...data.leaderboardDetails].sort(
        (a, b) => a.eventLeaderboardId - b.eventLeaderboardId,
    );
    const slides: DashboardSlide[] = sorted.map((d) => ({
        type: "leaderboard" as const,
        data: d,
    }));

    if (data.challenges.length > 0) {
        slides.push({
            type: "challenges" as const,
            challenges: data.challenges,
            challengeScores: data.challengeScores,
        });
    }

    return slides;
}

const EventDashboard = observer(() => {
    const { slug } = useParams<{ slug: string }>();

    const { data, isLoading, error } = useEventDashboard(slug!);

    const slides = useMemo(() => (data ? buildSlides(data) : []), [data]);

    const SLIDE_DURATION = 30_000;

    const [currentIndex, setCurrentIndex] = useState(0);
    const [progress, setProgress] = useState(0);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const slideStartRef = useRef(Date.now());

    const goToSlide = useCallback(
        (index: number) => {
            if (index === currentIndex) return;
            setCurrentIndex(index);
            slideStartRef.current = Date.now();
            setProgress(0);
        },
        [currentIndex],
    );

    const advanceSlide = useCallback(() => {
        const next = (currentIndex + 1) % slides.length;
        goToSlide(next);
    }, [currentIndex, slides.length, goToSlide]);

    useEffect(() => {
        if (slides.length <= 1) return;

        intervalRef.current = setInterval(advanceSlide, SLIDE_DURATION);
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [advanceSlide, slides.length]);

    const currentSlide = slides[currentIndex] ?? null;
    const slideTitle = currentSlide
        ? currentSlide.type === "leaderboard"
            ? currentSlide.data.leaderboard.name
            : "Challenges"
        : "";

    useEffect(() => {
        if (slides.length <= 1) return;

        let rafId: number;
        const tick = () => {
            const elapsed = Date.now() - slideStartRef.current;
            setProgress(Math.min(elapsed / SLIDE_DURATION, 1));
            rafId = requestAnimationFrame(tick);
        };
        rafId = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(rafId);
    }, [slides.length]);

    const event = data?.event;
    const attendeeCount = data?.attendeeCount ?? 0;

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

    if (isLoading) return <LoadingPage />;
    if (error) return <h3>Failed to load dashboard</h3>;
    if (!data || slides.length === 0) return <h3>No data available</h3>;

    return (
        <ThemeProvider theme={mergedTheme}>
            <DashboardWrapper>
                <Header>
                    <HeaderSection $align="left">
                        {event!.logo && <EventLogo src={event!.logo} alt={event!.name} />}
                        <EventName>{event!.name}</EventName>
                    </HeaderSection>
                    <HeaderSection $align="center">
                        <SlideTitle>
                            <SlideTitleText>{slideTitle}</SlideTitleText>
                            <SlideSubtitle>
                                {currentSlide?.type === "leaderboard" ? "Leaderboard" : ""}
                            </SlideSubtitle>
                        </SlideTitle>
                    </HeaderSection>
                    <HeaderSection $align="right">
                        <TitleContainer>
                            <BrandTitle>
                                <Logo src="/static/icon.svg" />
                                <TitleText>osu!chan</TitleText>
                            </BrandTitle>
                        </TitleContainer>
                    </HeaderSection>
                </Header>
                <SlideContainer>
                    {slides.map((slide, i) => (
                        <SlideWrapper key={i} $visible={i === currentIndex}>
                            {slide.type === "leaderboard" && <LeaderboardSlide data={slide.data} />}
                            {slide.type === "challenges" && (
                                <ChallengesSlide
                                    challenges={slide.challenges}
                                    challengeScores={slide.challengeScores}
                                />
                            )}
                        </SlideWrapper>
                    ))}
                </SlideContainer>
                {slides.length > 1 && (
                    <>
                        <ProgressBar>
                            <ProgressFill $progress={progress} />
                        </ProgressBar>
                        <BottomBar>
                            <BottomSection $align="left">
                                <EventUrl
                                    href={`https://osuchan.syrin.me/events/${slug}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    osuchan.syrin.me/events/{slug}
                                </EventUrl>
                            </BottomSection>
                            <BottomSection $align="center">
                                <SlideIndicator
                                    total={slides.length}
                                    current={currentIndex}
                                    onSelect={goToSlide}
                                />
                            </BottomSection>
                            <BottomSection $align="right">
                                <AttendeeCount>
                                    {attendeeCount} attendee{attendeeCount !== 1 ? "s" : ""}
                                </AttendeeCount>
                            </BottomSection>
                        </BottomBar>
                    </>
                )}
            </DashboardWrapper>
        </ThemeProvider>
    );
});

export default EventDashboard;
