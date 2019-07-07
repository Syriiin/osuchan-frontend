import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { RouteComponentProps } from "react-router";
import { Link } from "react-router-dom";
import { Header, Segment, List, Divider, Table, Loader, Button, Modal, Form } from "semantic-ui-react";

import { StoreState } from "../../../store/reducers";
import { ProfilesDataState } from "../../../store/data/profiles/types";
import { LeaderboardsDataState } from "../../../store/data/leaderboards/types";
import { LeaderboardsDetailState } from "../../../store/leaderboards/detail/types";
import { leaderboardsDetailGetThunk, leaderboardsDetailDeleteThunk, leaderboardsDetailPostInviteThunk } from "../../../store/leaderboards/detail/actions";
import { formatGamemodeName, formatMods } from "../../../utils/formatting";
import { MeState } from "../../../store/me/types";
import { meJoinLeaderboardPostThunk, meLeaveLeaderboardDeleteThunk } from "../../../store/me/actions";

function LeaderboardHome(props: LeaderboardHomeProps) {
    // use effect to fetch leaderboards data
    const leaderboardId = parseInt(props.match.params.leaderboardId);
    const { leaderboardsDetailGetThunk: leaderboardsDetailThunkFetch } = props;
    useEffect(() => {
        leaderboardsDetailThunkFetch(leaderboardId);
    }, [leaderboardsDetailThunkFetch, leaderboardId]);

    const leaderboard = props.leaderboardsDetail.leaderboardId ? props.leaderboardsData.leaderboards[props.leaderboardsDetail.leaderboardId] : null;

    // use effect to update title
    const { isFetching } = props.leaderboardsDetail;
    useEffect(() => {
        if (isFetching) {
            document.title = "Loading...";
        } else if (leaderboard) {
            document.title = `${leaderboard.name} - osu!chan`;
        } else {
            document.title = "Leaderboard not found - osu!chan";
        }
    }, [isFetching, leaderboard]);

    const handleDelete = () => props.leaderboardsDetailDeleteThunk(leaderboard!.id);
    const handleJoin = () => props.meJoinLeaderboardPostThunk(leaderboard!.id);
    const handleLeave = () => props.meLeaveLeaderboardDeleteThunk(leaderboard!.id);
    
    const [modalOpen, setModelOpen] = useState(false);
    const [inviteUserId, setInviteUserId] = useState();

    const handleSubmit = () => {
        props.leaderboardsDetailPostInviteThunk(leaderboard!.id, inviteUserId);

        setModelOpen(false);
    }

    return (
        <>
            <Segment inverted placeholder={props.leaderboardsDetail.isFetching}>
                {props.leaderboardsDetail.isFetching && (
                    <Loader active size="massive">Loading</Loader>
                )}
                {leaderboard && (
                    <>
                        {/* Name, mode, type (owner) */}
                        <Header inverted as="h1">
                            {leaderboard.name}
                            <Header.Subheader>
                                <List horizontal inverted divided>
                                    <List.Item>{formatGamemodeName(leaderboard.gamemode)}</List.Item>
                                    {leaderboard.accessType === 0 ? (
                                        <List.Item>Global</List.Item>
                                    ) : (
                                        <>
                                            <List.Item>{props.profilesData.osuUsers[leaderboard.ownerId!].username}</List.Item>
                                            {leaderboard.accessType === 2 && (
                                                <List.Item>INVITE-ONLY</List.Item>
                                            )}
                                            {leaderboard.accessType === 3 && (
                                                <List.Item>PRIVATE</List.Item>
                                            )}
                                        </>
                                    )}
                                </List>
                            </Header.Subheader>
                        </Header>

                        {/* Description */}
                        <p>{leaderboard.description}</p>

                        {/* Score criteria */}
                        <List bulleted>
                            {/* Allow past scores */}
                            {!leaderboard.allowPastScores && (
                                <List.Item>Scores must be made after joining leaderboard</List.Item>
                            )}
                            {/* Mods */}
                            {leaderboard.requiredMods !== 0 && (
                                <List.Item>Required Mods: {formatMods(leaderboard.requiredMods)}</List.Item>
                            )}
                            {leaderboard.disqualifiedMods !== 0 && (
                                <List.Item>Disqualified Mods: {formatMods(leaderboard.disqualifiedMods)}</List.Item>
                            )}
                            {/* Beatmap status */}
                            {leaderboard.allowedBeatmapStatus === 0 && (
                                <List.Item>Beatmap Status: Ranked or Loved</List.Item>
                            )}
                            {leaderboard.allowedBeatmapStatus === 2 && (
                                <List.Item>Beatmap Status: Loved</List.Item>
                            )}
                            {/* Beatmap date */}
                            {leaderboard.oldestBeatmapDate !== null && (
                                <List.Item>Oldest Beatmap Date: {leaderboard.oldestBeatmapDate.toLocaleDateString()}</List.Item>
                            )}
                            {leaderboard.newestBeatmapDate !== null && (
                                <List.Item>Newest Beatmap Date: {leaderboard.newestBeatmapDate.toLocaleDateString()}</List.Item>
                            )}
                            {/* Accuracy */}
                            {leaderboard.lowestAccuracy !== null && (
                                <List.Item>Lowest Accuracy: {leaderboard.lowestAccuracy}</List.Item>
                            )}
                            {leaderboard.highestAccuracy !== null && (
                                <List.Item>Highest Accuracy: {leaderboard.highestAccuracy}</List.Item>
                            )}
                            {/* CS */}
                            {leaderboard.lowestCs !== null && (
                                <List.Item>Lowest CS: {leaderboard.lowestCs}</List.Item>
                            )}
                            {leaderboard.highestCs !== null && (
                                <List.Item>Highest CS: {leaderboard.highestCs}</List.Item>
                            )}
                            {/* AR */}
                            {leaderboard.lowestAr !== null && (
                                <List.Item>Lowest AR: {leaderboard.lowestAr}</List.Item>
                            )}
                            {leaderboard.highestAr !== null && (
                                <List.Item>Highest AR: {leaderboard.highestAr}</List.Item>
                            )}
                            {/* OD */}
                            {leaderboard.lowestOd !== null && (
                                <List.Item>Lowest OD: {leaderboard.lowestOd}</List.Item>
                            )}
                            {leaderboard.highestOd !== null && (
                                <List.Item>Highest OD: {leaderboard.highestOd}</List.Item>
                            )}
                        </List>

                        {leaderboard.accessType !== 0 && props.me.osuUserId && (
                            <>
                                {/* Delete button if owner */}
                                {leaderboard.ownerId === props.me.osuUserId && (
                                    <>
                                        <Button color="red" onClick={handleDelete}>Delete Leaderboard</Button>

                                        {/* Either private or public invite-only */}
                                        {(leaderboard.accessType === 2 || leaderboard.accessType === 3) && (
                                            <Button color="blue" onClick={() => setModelOpen(true)}>Invite Player</Button>
                                        )}
                                    </>
                                )}


                                {/* Join button if not member */}
                                {!props.me.leaderboardIds.includes(leaderboard.id) && (
                                    <Button color="blue" onClick={handleJoin}>Join Leaderboard</Button>
                                )}

                                {/* Leave button if member and not owner */}
                                {leaderboard.ownerId !== props.me.osuUserId && props.me.leaderboardIds.includes(leaderboard.id) && (
                                    <Button color="red"  onClick={handleLeave}>Leave Leaderboard</Button>
                                )}
                            </>
                        )}

                        <Divider horizontal inverted>Rankings</Divider>

                        {/* player rankings table */}
                        <Table fixed singleLine selectable inverted>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell width={1}></Table.HeaderCell>
                                    <Table.HeaderCell width={8}>Player</Table.HeaderCell>
                                    <Table.HeaderCell width={3}>Score Count</Table.HeaderCell>
                                    <Table.HeaderCell width={4}>Performance</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {props.leaderboardsDetail.rankingIds.map((membershipId, i) => {
                                    const membership = props.leaderboardsData.memberships[membershipId];
                                    const osuUser = props.profilesData.osuUsers[membership.osuUserId];
                                    return (
                                        <Table.Row>
                                            <Table.Cell>{i + 1}</Table.Cell>
                                            <Table.Cell>
                                                <Link to={`/leaderboards/${leaderboardId}/users/${osuUser.id}`}>{osuUser.username}</Link></Table.Cell>
                                            <Table.Cell>{membership.scoreCount}</Table.Cell>
                                            <Table.Cell>{membership.pp.toFixed(0)}pp</Table.Cell>
                                        </Table.Row>
                                    );
                                })}
                            </Table.Body>
                        </Table>
                    </>
                )}
            </Segment>
            <Modal open={modalOpen} onClose={() => setModelOpen(false)}>
                <Modal.Header>Invite a player</Modal.Header>
                <Modal.Content>
                    <Form onSubmit={handleSubmit}>
                        <Form.Input onChange={e => setInviteUserId(e.currentTarget.value)} required label="User ID (numbers at the end of osu! profile url)" />
                        <Form.Button>Invite player</Form.Button>
                    </Form>
                </Modal.Content>
            </Modal>
        </>
    );
}

interface RouteParams {
    leaderboardId: string;
}

interface LeaderboardHomeProps extends RouteComponentProps<RouteParams> {
    leaderboardsDetailGetThunk: (leaderboardId: number) => void;
    leaderboardsDetailDeleteThunk: (leaderboardId: number) => void;
    leaderboardsDetailPostInviteThunk: (leaderboardId: number, userId: number) => void;
    meJoinLeaderboardPostThunk: (leaderboardId: number) => void;
    meLeaveLeaderboardDeleteThunk: (leaderboardId: number) => void;
    leaderboardsDetail: LeaderboardsDetailState;
    leaderboardsData: LeaderboardsDataState;
    profilesData: ProfilesDataState;
    me: MeState;
}

function mapStateToProps(state: StoreState) {
    return {
        leaderboardsDetail: state.leaderboards.detail,
        leaderboardsData: state.data.leaderboards,
        profilesData: state.data.profiles,
        me: state.me
    }
}

const mapDispatchToProps = {
    leaderboardsDetailGetThunk,
    leaderboardsDetailDeleteThunk,
    leaderboardsDetailPostInviteThunk,
    meJoinLeaderboardPostThunk,
    meLeaveLeaderboardDeleteThunk
}

export default connect(mapStateToProps, mapDispatchToProps)(LeaderboardHome);
