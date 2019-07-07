import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { NavLink } from "react-router-dom";
import { Header, Segment, Card, Item, Label, Image, Loader, Button, Divider, Modal, Form } from "semantic-ui-react";

import { StoreState } from "../../store/reducers";
import { LeaderboardsListState } from "../../store/leaderboards/list/types";
import { leaderboardsListGetThunk, leaderboardsListPostThunk } from "../../store/leaderboards/list/actions"
import { LeaderboardsDataState } from "../../store/data/leaderboards/types";
import { ProfilesDataState } from "../../store/data/profiles/types";
import styled from "styled-components";
import { MeState } from "../../store/me/types";

// temp styled component to create makeshift inverted SUI Items
const WhiteSpan = styled.span`
    color: #fff;
`;

function LeaderboardList(props: LeaderboardListProps) {
    // use effect to fetch leaderboards data
    const { leaderboardsListGetThunk } = props;
    useEffect(() => {
        leaderboardsListGetThunk();
    }, [leaderboardsListGetThunk]);

    // use effect to update title
    const { isFetching } = props.leaderboardsList;
    useEffect(() => {
        if (isFetching) {
            document.title = "Loading...";
        } else {
            document.title = "Leaderboards - osu!chan";
        }
    }, [isFetching]);

    const [gamemode, setGamemode] = useState();
    const [accessType, setAccessType] = useState();
    const [name, setName] = useState();
    const [description, setDescription] = useState();
    const [allowPastScores, setAllowPastScores] = useState();
    const [allowedBeatmapStatus, setAllowedBeatmapStatus] = useState();
    const [oldestBeatmapDate, setOldestBeatmapDate] = useState();
    const [newestBeatmapDate, setNewestBeatmapDate] = useState();
    const [lowestAr, setLowestAr] = useState();
    const [highestAr, setHighestAr] = useState();
    const [lowestOd, setLowestOd] = useState();
    const [highestOd, setHighestOd] = useState();
    const [lowestCs, setLowestCs] = useState();
    const [highestCs, setHighestCs] = useState();
    const [requiredMods, setRequiredMods] = useState();
    const [disqualifiedMods, setDisqualifiedMods] = useState();
    const [lowestAccuracy, setLowestAccuracy] = useState();
    const [highestAccuracy, setHighestAccuracy] = useState();

    const handleSubmit = () => {
        // dispatch create action
        props.leaderboardsListPostThunk(
            parseInt(gamemode),
            parseInt(accessType),
            name,
            description || "",
            allowPastScores ? allowPastScores === "true" : null,
            parseInt(allowedBeatmapStatus) || 0,
            oldestBeatmapDate ? new Date(oldestBeatmapDate) : null,
            newestBeatmapDate ? new Date(newestBeatmapDate) : null,
            lowestAr ? parseFloat(lowestAr) : null,
            highestAr ? parseFloat(highestAr) : null,
            lowestOd ? parseFloat(lowestOd) : null,
            highestOd ? parseFloat(highestOd) : null,
            lowestCs ? parseFloat(lowestCs) : null,
            highestCs ? parseFloat(highestCs) : null,
            parseInt(requiredMods) || 0,
            parseInt(disqualifiedMods) || 0,
            lowestAccuracy ? parseFloat(lowestAccuracy) : null,
            highestAccuracy ? parseFloat(highestAccuracy) : null
        )

        setModalOpen(false);
    }

    const [modalOpen, setModalOpen] = useState(false);

    const leaderboards = props.leaderboardsList.leaderboardIds.map(id => props.leaderboardsData.leaderboards[id]);

    return (
        <>
            <Header as="h2" inverted attached="top" textAlign="center">Featured Leaderboards</Header>
            <Segment inverted attached placeholder={props.leaderboardsList.isFetching}>
                {props.leaderboardsList.isFetching ? (
                    <Loader active size="massive">Loading</Loader>
                ) : (
                    <Card.Group centered>
                        {leaderboards.filter(leaderboard => leaderboard.accessType === 0).map((leaderboard, i) => (
                            <Card key={i} as={NavLink} to={`/leaderboards/${leaderboard.id}`}>
                                <Card.Content>
                                    <Image size="tiny" floated="right" src="https://syrin.me/static/img/osu!next_icons/mod-HD.png" />
                                    <Card.Header>{leaderboard.name}</Card.Header>
                                    <Card.Meta>Global</Card.Meta>
                                    <Card.Description>{leaderboard.description}</Card.Description>
                                </Card.Content>
                            </Card>
                        ))}
                    </Card.Group>
                )}
            </Segment>

            <Header as="h2" inverted attached="top" textAlign="center">Community Leaderboards</Header>
            <Segment inverted attached placeholder={props.leaderboardsList.isFetching}>
                {props.leaderboardsList.isFetching ? (
                    <Loader active size="massive">Loading</Loader>
                ) : (
                    <>
                        {props.me.osuUserId && (
                            <>
                                <Button onClick={() => setModalOpen(true)}>Create</Button>
                                <Divider />
                            </>
                        )}
                        <Item.Group divided>
                            {leaderboards.filter(leaderboard => leaderboard.accessType !== 0).map((leaderboard, i) => {
                                const owner = props.profilesData.osuUsers[leaderboard.ownerId!];
                                return (
                                    <Item key={i} as={NavLink} to={`/leaderboards/${leaderboard.id}`}>
                                        <Item.Image size="tiny" src="https://syrin.me/static/img/osu!next_icons/mod-EZ.png" />
                                        <Item.Content verticalAlign="middle">
                                            <Item.Header>
                                                <WhiteSpan>{leaderboard.name}</WhiteSpan>
                                            </Item.Header>
                                            <Item.Description>
                                                <Label as="a" image>
                                                    <img alt="Avatar" src={`https://a.ppy.sh/${owner.id}`} />
                                                    {owner.username}
                                                </Label>
                                                {leaderboard.accessType === 2 && (
                                                    <Label color="grey">INVITE-ONLY</Label>
                                                )}
                                                {leaderboard.accessType === 3 && (
                                                    <Label color="grey">PRIVATE</Label>
                                                )}
                                            </Item.Description>
                                        </Item.Content>
                                    </Item>
                                );
                            })}
                        </Item.Group>
                    </>
                )}
            </Segment>

            <Modal open={modalOpen} onClose={() => setModalOpen(false)} small="true">
                <Modal.Header>Create a leaderboard</Modal.Header>
                <Modal.Content>
                    <Form onSubmit={handleSubmit}>
                        {/* Basic details */}
                        <Form.Input onChange={e => setName(e.currentTarget.value)} required name="name" label="Name" />
                        <Form.Select onChange={(e, { value }) => setGamemode(value)} required name="gamemode" label="Gamemode" options={[
                            { text: "osu!", value: 0},
                            { text: "osu!taiko", value: 1},
                            { text: "osu!catch", value: 2},
                            { text: "osu!mania", value: 3}
                        ]} />
                        <Form.Select onChange={(e, { value }) => setAccessType(value)} required name="accessType" label="Type" options={[
                            { text: "Public", value: 1},
                            { text: "Public (Invite-only)", value: 2},
                            { text: "Private", value: 3}
                        ]} />
                        <Form.TextArea onChange={e => setDescription(e.currentTarget.value)} name="description" label="Description" />

                        {/* Score filters */}
                        <Header>Score filters</Header>
                        <Form.Input onChange={e => setAllowPastScores(e.currentTarget.value)} label="Include scores before member joins" />
                        <Form.Input onChange={e => setAllowedBeatmapStatus(e.currentTarget.value)} label="Beatmap Status" />
                        <Form.Input onChange={e => setOldestBeatmapDate(e.currentTarget.value)} label="Oldest Beatmap Date" placeholder="YYYY-MM-DD" />
                        <Form.Input onChange={e => setNewestBeatmapDate(e.currentTarget.value)} label="Newest Beatmap Date" placeholder="YYYY-MM-DD" />
                        <Form.Input onChange={e => setRequiredMods(e.currentTarget.value)} label="Required Mods" />
                        <Form.Input onChange={e => setDisqualifiedMods(e.currentTarget.value)} label="Disqualified Mods" />
                        <Form.Input onChange={e => setLowestAr(e.currentTarget.value)} label="Min AR" />
                        <Form.Input onChange={e => setHighestAr(e.currentTarget.value)} label="Max AR" />
                        <Form.Input onChange={e => setLowestOd(e.currentTarget.value)} label="Min OD" />
                        <Form.Input onChange={e => setHighestOd(e.currentTarget.value)} label="Max OD" />
                        <Form.Input onChange={e => setLowestCs(e.currentTarget.value)} label="Min CS" />
                        <Form.Input onChange={e => setHighestCs(e.currentTarget.value)} label="Max CS" />
                        <Form.Input onChange={e => setLowestAccuracy(e.currentTarget.value)} label="Min Accuracy" />
                        <Form.Input onChange={e => setHighestAccuracy(e.currentTarget.value)} label="Max Accuracy" />

                        <Form.Button>Create Leaderboard</Form.Button>
                    </Form>
                </Modal.Content>
            </Modal>
        </>
    );
}

interface LeaderboardListProps {
    leaderboardsListGetThunk: () => void;
    leaderboardsListPostThunk: (
        gamemode: number,
        accessType: number,
        name: string,
        description: string,
        allowPastScores: boolean | null,
        allowedBeatmapStatus: number,
        oldestBeatmapDate: Date | null,
        newestBeatmapDate: Date | null,
        lowestAr: number | null,
        highestAr: number | null,
        lowestOd: number | null,
        highestOd: number | null,
        lowestCs: number | null,
        highestCs: number | null,
        requiredMods: number,
        disqualifiedMods: number,
        lowestAccuracy: number | null,
        highestAccuracy: number | null
    ) => void;
    leaderboardsList: LeaderboardsListState;
    leaderboardsData: LeaderboardsDataState;
    profilesData: ProfilesDataState;
    me: MeState;
}

function mapStateToProps(state: StoreState) {
    return {
        leaderboardsList: state.leaderboards.list,
        leaderboardsData: state.data.leaderboards,
        profilesData: state.data.profiles,
        me: state.me
    }
}

const mapDispatchToProps = {
    leaderboardsListGetThunk,
    leaderboardsListPostThunk
}

export default connect(mapStateToProps, mapDispatchToProps)(LeaderboardList);
