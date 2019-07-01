import React, { useEffect, useRef } from "react";
import { connect } from "react-redux";
import { RouteComponentProps } from "react-router";
import { Header, Image, Segment, Menu, Grid, Sticky, Ref, Divider, Statistic, Table, Icon, Loader } from "semantic-ui-react";
import { NavLink } from "react-router-dom";
import countries from "i18n-iso-countries";

import { formatTime, formatMods, formatScoreResult } from "../../utils/formatting";
import { gamemodeIdFromName } from "../../utils/osu";
import { StoreState } from "../../store/reducers";
import { UsersState } from "../../store/users/types";
import { usersThunkFetch } from "../../store/users/actions";
import { ProfilesState } from "../../store/data/profiles/types";

countries.registerLocale(require("i18n-iso-countries/langs/en.json"));

function Profile(props: ProfileProps) {
    // use effect to fetch profile data
    const { usersThunkFetch } = props;
    const { userString } = props.match.params;
    const gamemodeId = gamemodeIdFromName(props.match.params.gamemodeName);
    useEffect(() => {
        usersThunkFetch(userString, gamemodeId);
    }, [usersThunkFetch, userString, gamemodeId]);

    const userStats = props.users.currentUserStatsId ? props.profiles.userStats[props.users.currentUserStatsId] : null;
    const osuUser = userStats ? props.profiles.osuUsers[userStats.osuUserId] : null;

    // use effect to update title
    const { isFetching } = props.users;
    useEffect(() => {
        if (isFetching) {
            document.title = "Loading...";
        } else if (osuUser) {
            document.title = `${osuUser.username} - osu!chan`;
        } else {
            document.title = "User not found - osu!chan";
        }
    }, [isFetching, osuUser]);

    const contextRef = useRef();

    // TODO: split into smaller components
    return (
        <Segment inverted placeholder={props.users.isFetching}>
            {props.users.isFetching && (
                <Loader active size="massive">Loading</Loader>
            )}
            {userStats && osuUser && (
                <Grid inverted divided>
                    <Grid.Row>
                        <Grid.Column columns={2} width={3}>
                            <Sticky context={contextRef} offset={15}>
                                <Image centered rounded size="small" src={`https://a.ppy.sh/${osuUser.id}`} />
                                <Header textAlign="center" inverted as="h1">
                                    {osuUser.username}
                                </Header>
                                <Header textAlign="center" inverted size="small">
                                    <Image src={`https://osu.ppy.sh/images/flags/${osuUser.country}.png`} />
                                    {countries.getName(osuUser.country, "en")}
                                </Header>
                                <Header textAlign="center" inverted size="tiny">
                                    <Icon name="calendar" />
                                    {osuUser.joinDate.toDateString()}
                                </Header>
                            </Sticky>
                        </Grid.Column>
                        <Ref innerRef={contextRef}>
                            <Grid.Column width={13}>
                                <Menu widths={4} inverted pointing secondary>
                                    <Menu.Item as={NavLink} to={`/users/${props.match.params.userString}/osu`} active={gamemodeId === 0}>osu!</Menu.Item>
                                    <Menu.Item as={NavLink} to={`/users/${props.match.params.userString}/taiko`} active={gamemodeId === 1}>osu!taiko</Menu.Item>
                                    <Menu.Item as={NavLink} to={`/users/${props.match.params.userString}/catch`} active={gamemodeId === 2}>osu!catch</Menu.Item>
                                    <Menu.Item as={NavLink} to={`/users/${props.match.params.userString}/mania`} active={gamemodeId === 3}>osu!mania</Menu.Item>
                                </Menu>
                                <Statistic.Group inverted size="small" widths={3}>
                                    <Statistic>
                                        <Statistic.Label>Performance</Statistic.Label>
                                        <Statistic.Value>{userStats.pp.toFixed(0)}</Statistic.Value>
                                    </Statistic>
                                    <Statistic>
                                        <Statistic.Label>Global Rank</Statistic.Label>
                                        <Statistic.Value>#{userStats.rank}</Statistic.Value>
                                    </Statistic>
                                    <Statistic>
                                        <Statistic.Label>Country Rank</Statistic.Label>
                                        <Statistic.Value>#{userStats.countryRank}</Statistic.Value>
                                    </Statistic>
                                    <Statistic>
                                        <Statistic.Label>No-choke Performance</Statistic.Label>
                                        <Statistic.Value>{userStats.gamemode === 0 ? userStats.nochokePp.toFixed(0) : "-"}</Statistic.Value>
                                    </Statistic>
                                    <Statistic>
                                        <Statistic.Label>No-choke Global Rank</Statistic.Label>
                                        <Statistic.Value>-</Statistic.Value>
                                    </Statistic>
                                    <Statistic>
                                        <Statistic.Label>No-choke Country Rank</Statistic.Label>
                                        <Statistic.Value>-</Statistic.Value>
                                    </Statistic>
                                </Statistic.Group>
                            </Grid.Column>
                        </Ref>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column>
                            <Divider horizontal inverted>
                                Score Style
                            </Divider>

                            <Statistic.Group inverted size="tiny" widths={4}>
                                <Statistic>
                                    <Statistic.Label>BPM</Statistic.Label>
                                    <Statistic.Value>{userStats.scoreStyleBpm.toFixed(0)}</Statistic.Value>
                                </Statistic>
                                <Statistic>
                                    <Statistic.Label>Circle Size</Statistic.Label>
                                    <Statistic.Value>{userStats.scoreStyleCs.toFixed(1)}</Statistic.Value>
                                </Statistic>
                                <Statistic>
                                    <Statistic.Label>Approach Rate</Statistic.Label>
                                    <Statistic.Value>{userStats.scoreStyleAr.toFixed(1)}</Statistic.Value>
                                </Statistic>
                                <Statistic>
                                    <Statistic.Label>Overall Difficulty</Statistic.Label>
                                    <Statistic.Value>{userStats.scoreStyleOd.toFixed(1)}</Statistic.Value>
                                </Statistic>
                                <Statistic>
                                    <Statistic.Label>Length</Statistic.Label>
                                    <Statistic.Value>{formatTime(userStats.scoreStyleLength)}</Statistic.Value>
                                </Statistic>
                                <Statistic>
                                    <Statistic.Label>Visibility</Statistic.Label>
                                    <Statistic.Value>-</Statistic.Value>
                                </Statistic>
                                <Statistic>
                                    <Statistic.Label>Accuracy</Statistic.Label>
                                    <Statistic.Value>{userStats.scoreStyleAccuracy.toFixed(2)}%</Statistic.Value>
                                </Statistic>
                            </Statistic.Group>

                            <Divider horizontal inverted>
                                Scores
                            </Divider>

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
                                    {props.users.scoreIds.map(id => props.profiles.scores[id]).map((score, i) => {
                                        const beatmap = props.profiles.beatmaps[score.beatmapId];
                                        return (
                                            <Table.Row key={i}>
                                                <Table.Cell>{i+1}</Table.Cell>
                                                <Table.Cell>{beatmap.artist} - {beatmap.title} [{beatmap.difficultyName}]</Table.Cell>
                                                <Table.Cell>{formatMods(score.mods)}</Table.Cell>
                                                <Table.Cell>{score.accuracy.toFixed(2)}%</Table.Cell>
                                                <Table.Cell>{score.pp.toFixed(0)}pp</Table.Cell>
                                                <Table.Cell>{formatScoreResult(score.result)}</Table.Cell>
                                            </Table.Row>
                                        )
                                    })}
                                </Table.Body>
                            </Table>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            )}
        </Segment>
    );
}

interface RouteParams {
    userString: string;
    gamemodeName?: string;
}

interface ProfileProps extends RouteComponentProps<RouteParams> {
    usersThunkFetch: (userString: string, gamemode: number) => void;
    users: UsersState;
    profiles: ProfilesState;
}

function mapStateToProps(state: StoreState) {
    return {
        users: state.users,
        profiles: state.data.profiles
    }
}

const mapDispatchToProps = {
    usersThunkFetch
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
