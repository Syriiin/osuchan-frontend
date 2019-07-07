import React, { useEffect } from "react";
import { connect } from "react-redux";
import { RouteComponentProps } from "react-router";
import { Link } from "react-router-dom";
import { Header, Segment, Divider, Table, Statistic, Loader } from "semantic-ui-react";

import { StoreState } from "../../../store/reducers";
import { ProfilesDataState } from "../../../store/data/profiles/types";
import { LeaderboardsDataState } from "../../../store/data/leaderboards/types";
import { LeaderboardsBeatmapState } from "../../../store/leaderboards/beatmap/types";
import { leaderboardsBeatmapThunkFetch } from "../../../store/leaderboards/beatmap/actions";
import { formatTime, formatMods, formatScoreResult } from "../../../utils/formatting";

function LeaderboardBeatmap(props: LeaderboardBeatmapProps) {
    // use effect to fetch leaderboards data
    const leaderboardId = parseInt(props.match.params.leaderboardId);
    const beatmapId = parseInt(props.match.params.beatmapId);
    const { leaderboardsBeatmapThunkFetch } = props;
    useEffect(() => {
        leaderboardsBeatmapThunkFetch(leaderboardId, beatmapId);
    }, [leaderboardsBeatmapThunkFetch, leaderboardId, beatmapId]);

    const beatmap = props.leaderboardsBeatmap.beatmapId ? props.profilesData.beatmaps[props.leaderboardsBeatmap.beatmapId] : null;

    // use effect to update title
    const { isFetching } = props.leaderboardsBeatmap;
    useEffect(() => {
        if (isFetching) {
            document.title = "Loading...";
        } else if (beatmap) {
            document.title = `${beatmap.title} - osu!chan`;
        } else {
            document.title = "Beatmap not found - osu!chan";
        }
    }, [isFetching, beatmap]);

    return (
        <Segment inverted placeholder={props.leaderboardsBeatmap.isFetching}>
            {props.leaderboardsBeatmap.isFetching && (
                <Loader active size="massive">Loading</Loader>
            )}
            {beatmap && (
                <>
                    {/* Title */}
                    <Header inverted textAlign="center" as="h1">
                        {beatmap.artist} - {beatmap.title} [{beatmap.difficultyName}]
                        <Header.Subheader>by {beatmap.creatorName}</Header.Subheader>
                    </Header>

                    {/* Details: star rating, bpm, length, cs, ar, od */}
                    <Statistic.Group inverted widths={6} size="small">
                        <Statistic>
                            <Statistic.Label>Star Rating</Statistic.Label>
                            <Statistic.Value>{beatmap.starRating.toFixed(2)}</Statistic.Value>
                        </Statistic>
                        <Statistic>
                            <Statistic.Label>BPM</Statistic.Label>
                            <Statistic.Value>{beatmap.bpm.toFixed(0)}</Statistic.Value>
                        </Statistic>
                        <Statistic>
                            <Statistic.Label>Length</Statistic.Label>
                            <Statistic.Value>{formatTime(beatmap.drainTime)}</Statistic.Value>
                        </Statistic>
                        <Statistic>
                            <Statistic.Label>Circle Size</Statistic.Label>
                            <Statistic.Value>{beatmap.circleSize.toFixed(1)}</Statistic.Value>
                        </Statistic>
                        <Statistic>
                            <Statistic.Label>Approach Rate</Statistic.Label>
                            <Statistic.Value>{beatmap.approachRate.toFixed(1)}</Statistic.Value>
                        </Statistic>
                        <Statistic>
                            <Statistic.Label>Overall Difficulty</Statistic.Label>
                            <Statistic.Value>{beatmap.overallDifficulty.toFixed(1)}</Statistic.Value>
                        </Statistic>
                    </Statistic.Group>

                    <Divider horizontal inverted>Scores</Divider>

                    {/* Score table */}
                    <Table fixed singleLine selectable inverted>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell width={1}></Table.HeaderCell>
                                <Table.HeaderCell width={8}>Player</Table.HeaderCell>
                                <Table.HeaderCell width={2}>Mods</Table.HeaderCell>
                                <Table.HeaderCell width={2}>Accuracy</Table.HeaderCell>
                                <Table.HeaderCell width={1}>PP</Table.HeaderCell>
                                <Table.HeaderCell width={2}>Result</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {props.leaderboardsBeatmap.scoreIds.map((scoreId, i) => {
                                const score = props.profilesData.scores[scoreId];
                                const userStats = props.profilesData.userStats[score.userStatsId];
                                const osuUser = props.profilesData.osuUsers[userStats.osuUserId];
                                return (
                                    <Table.Row>
                                        <Table.Cell>{i + 1}</Table.Cell>
                                        <Table.Cell>
                                            <Link to={`/leaderboards/${leaderboardId}/users/${osuUser.id}`}>{osuUser.username}</Link>
                                        </Table.Cell>
                                        <Table.Cell>{formatMods(score.mods)}</Table.Cell>
                                        <Table.Cell>{score.accuracy.toFixed(2)}%</Table.Cell>
                                        <Table.Cell>{score.pp.toFixed(0)}pp</Table.Cell>
                                        <Table.Cell>{formatScoreResult(score.result)}</Table.Cell>
                                    </Table.Row>
                                )
                            })}
                        </Table.Body>
                    </Table>
                </>
            )}
        </Segment>
    );
}

interface RouteParams {
    beatmapId: string;
    leaderboardId: string;
}

interface LeaderboardBeatmapProps extends RouteComponentProps<RouteParams> {
    leaderboardsBeatmapThunkFetch: (leaderboardId: number, beatmapId: number) => void;
    leaderboardsBeatmap: LeaderboardsBeatmapState;
    leaderboardsData: LeaderboardsDataState;
    profilesData: ProfilesDataState;
}

function mapStateToProps(state: StoreState) {
    return {
        leaderboardsBeatmap: state.leaderboards.beatmap,
        leaderboardsData: state.data.leaderboards,
        profilesData: state.data.profiles
    }
}

const mapDispatchToProps = {
    leaderboardsBeatmapThunkFetch
}

export default connect(mapStateToProps, mapDispatchToProps)(LeaderboardBeatmap);
