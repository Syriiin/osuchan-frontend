import React, { useEffect } from "react";
import { connect } from "react-redux";
import { RouteComponentProps } from "react-router";
import { Link } from "react-router-dom";
import { Header, Segment, Divider, Table, Statistic, Loader } from "semantic-ui-react";

import { StoreState } from "../../../store/reducers";
import { ProfilesDataState } from "../../../store/data/profiles/types";
import { LeaderboardsDataState } from "../../../store/data/leaderboards/types";
import { LeaderboardsUserState } from "../../../store/leaderboards/user/types";
import { leaderboardsUserThunkFetch } from "../../../store/leaderboards/user/actions";
import { formatMods, formatScoreResult } from "../../../utils/formatting";

function LeaderboardUser(props: LeaderboardUserProps) {
    // use effect to fetch leaderboards data
    const leaderboardId = parseInt(props.match.params.leaderboardId);
    const userId = parseInt(props.match.params.userId);
    const { leaderboardsUserThunkFetch } = props;
    useEffect(() => {
        leaderboardsUserThunkFetch(leaderboardId, userId);
    }, [leaderboardsUserThunkFetch, leaderboardId, userId]);

    const membership = props.leaderboardsUser.membershipId ? props.leaderboardsData.memberships[props.leaderboardsUser.membershipId] : null;
    const osuUser = membership ? props.profilesData.osuUsers[membership.osuUserId] : null;

    // use effect to update title
    const { isFetching } = props.leaderboardsUser;
    useEffect(() => {
        if (isFetching) {
            document.title = "Loading...";
        } else if (osuUser) {
            document.title = `${osuUser.username} - osu!chan`;
        } else {
            document.title = "User not found - osu!chan";
        }
    }, [isFetching, osuUser]);

    return (
        <Segment inverted placeholder={props.leaderboardsUser.isFetching}>
            {props.leaderboardsUser.isFetching && (
                <Loader active size="massive">Loading</Loader>
            )}
            {membership && osuUser && (
                <>
                    {/* Name */}
                    <Header inverted textAlign="center" as="h1">
                        {osuUser.username}
                    </Header>

                    {/* Stats: pp, rank, score count */}
                    <Statistic.Group inverted widths={3}>
                        <Statistic>
                            <Statistic.Label>Performance</Statistic.Label>
                            <Statistic.Value>{membership.pp.toFixed(0)}</Statistic.Value>
                        </Statistic>
                        <Statistic>
                            <Statistic.Label>Rank</Statistic.Label>
                            <Statistic.Value>-</Statistic.Value>
                        </Statistic>
                        <Statistic>
                            <Statistic.Label>Scores</Statistic.Label>
                            <Statistic.Value>{membership.scoreCount}</Statistic.Value>
                        </Statistic>
                    </Statistic.Group>            

                    <Divider horizontal inverted>Scores</Divider>

                    {/* Score table */}
                    <Table fixed singleLine selectable inverted>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell width={1}></Table.HeaderCell>
                                <Table.HeaderCell width={8}>Beatmap</Table.HeaderCell>
                                <Table.HeaderCell width={2}>Mods</Table.HeaderCell>
                                <Table.HeaderCell width={2}>Accuracy</Table.HeaderCell>
                                <Table.HeaderCell width={1}>PP</Table.HeaderCell>
                                <Table.HeaderCell width={2}>Result</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {props.leaderboardsUser.scoreIds.map((scoreId, i) => {
                                const score = props.profilesData.scores[scoreId];
                                const beatmap = props.profilesData.beatmaps[score.beatmapId];
                                return (
                                    <Table.Row key={i}>
                                        <Table.Cell>{i+1}</Table.Cell>
                                        <Table.Cell>
                                            <Link to={`/leaderboards/${leaderboardId}/beatmaps/${beatmap.id}`}>{beatmap.artist} - {beatmap.title} [{beatmap.difficultyName}]</Link>
                                        </Table.Cell>
                                        <Table.Cell>{formatMods(score.mods)}</Table.Cell>
                                        <Table.Cell>{score.accuracy.toFixed(2)}%</Table.Cell>
                                        <Table.Cell>{score.pp.toFixed(0)}pp</Table.Cell>
                                        <Table.Cell>{formatScoreResult(score.result)}</Table.Cell>
                                    </Table.Row>
                                );
                            })}
                        </Table.Body>
                    </Table>
                </>
            )}
        </Segment>
    );
}

interface RouteParams {
    userId: string;
    leaderboardId: string;
}

interface LeaderboardUserProps extends RouteComponentProps<RouteParams> {
    leaderboardsUserThunkFetch: (leaderboardId: number, userId: number) => void;
    leaderboardsUser: LeaderboardsUserState;
    leaderboardsData: LeaderboardsDataState;
    profilesData: ProfilesDataState;
}

function mapStateToProps(state: StoreState) {
    return {
        leaderboardsUser: state.leaderboards.user,
        leaderboardsData: state.data.leaderboards,
        profilesData: state.data.profiles
    }
}

const mapDispatchToProps = {
    leaderboardsUserThunkFetch
}

export default connect(mapStateToProps, mapDispatchToProps)(LeaderboardUser);
