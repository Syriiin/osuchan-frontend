import React, { useEffect, useRef } from "react";
import { connect } from "react-redux";
import { RouteComponentProps } from "react-router";
import { Header, Image, Segment, Menu, Grid, Sticky, Ref, Divider, Statistic, Table, Icon, Loader } from "semantic-ui-react";
import { NavLink } from "react-router-dom";
import countries from "i18n-iso-countries";

import { formatTime, formatMods, formatScoreResult } from "../../utils/formatting";
import { gamemodeIdFromName } from "../../utils/osu";
import { profileThunkFetch } from "../../store/profile/actions";
import { ProfileState } from "../../store/profile/types";
import { StoreState } from "../../store/reducers";

countries.registerLocale(require("i18n-iso-countries/langs/en.json"));

function Profile(props: ProfileProps) {
    // use effect to fetch profile data
    const { profileThunkFetch } = props;
    const { userString } = props.match.params;
    const gamemodeId = gamemodeIdFromName(props.match.params.gamemodeName);
    useEffect(() => {
        profileThunkFetch(userString, gamemodeId);
    }, [profileThunkFetch, userString, gamemodeId]);

    // use effect to update title
    const { isFetching, profileData } = props.profile;
    useEffect(() => {
        if (isFetching) {
            document.title = "Loading...";
        } else if (profileData && profileData.userData) {
            document.title = `${profileData.userData.username} - osu!chan`;
        } else {
            document.title = "User not found - osu!chan";
        }
    }, [isFetching, profileData]);

    const contextRef = useRef();

    // TODO: split into smaller components
    return (
        <Segment inverted placeholder={props.profile.isFetching}>
            {props.profile.isFetching && (
                <Loader active size="massive">Loading</Loader>
            )}
            {props.profile.profileData && props.profile.profileData.userData && (
                <Grid inverted divided>
                    <Grid.Row>
                        <Grid.Column columns={2} width={3}>
                            <Sticky context={contextRef} offset={15}>
                                <Image centered rounded size="small" src={`https://a.ppy.sh/${props.profile.profileData.userData.id}`} />
                                <Header textAlign="center" inverted as="h1">
                                    {props.profile.profileData.userData.username}
                                </Header>
                                <Header textAlign="center" inverted size="small">
                                    <Image src={`https://osu.ppy.sh/images/flags/${props.profile.profileData.userData.country}.png`} />
                                    {countries.getName(props.profile.profileData.userData.country, "en")}
                                </Header>
                                <Header textAlign="center" inverted size="tiny">
                                    <Icon name="calendar" />
                                    {props.profile.profileData.userData.joinDate.toDateString()}
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
                                        <Statistic.Value>{props.profile.profileData.pp.toFixed(0)}</Statistic.Value>
                                    </Statistic>
                                    <Statistic>
                                        <Statistic.Label>Global Rank</Statistic.Label>
                                        <Statistic.Value>#{props.profile.profileData.rank}</Statistic.Value>
                                    </Statistic>
                                    <Statistic>
                                        <Statistic.Label>Country Rank</Statistic.Label>
                                        <Statistic.Value>#{props.profile.profileData.countryRank}</Statistic.Value>
                                    </Statistic>
                                    <Statistic>
                                        <Statistic.Label>No-choke Performance</Statistic.Label>
                                        <Statistic.Value>{props.profile.profileData.nochokePp.toFixed(0)}</Statistic.Value>
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
                                    <Statistic.Value>{props.profile.profileData.scoreStyleBpm.toFixed(0)}</Statistic.Value>
                                </Statistic>
                                <Statistic>
                                    <Statistic.Label>Circle Size</Statistic.Label>
                                    <Statistic.Value>{props.profile.profileData.scoreStyleCs.toFixed(1)}</Statistic.Value>
                                </Statistic>
                                <Statistic>
                                    <Statistic.Label>Approach Rate</Statistic.Label>
                                    <Statistic.Value>{props.profile.profileData.scoreStyleAr.toFixed(1)}</Statistic.Value>
                                </Statistic>
                                <Statistic>
                                    <Statistic.Label>Overall Difficulty</Statistic.Label>
                                    <Statistic.Value>{props.profile.profileData.scoreStyleOd.toFixed(1)}</Statistic.Value>
                                </Statistic>
                                <Statistic>
                                    <Statistic.Label>Length</Statistic.Label>
                                    <Statistic.Value>{formatTime(props.profile.profileData.scoreStyleLength)}</Statistic.Value>
                                </Statistic>
                                <Statistic>
                                    <Statistic.Label>Visibility</Statistic.Label>
                                    <Statistic.Value>-</Statistic.Value>
                                </Statistic>
                                <Statistic>
                                    <Statistic.Label>Accuracy</Statistic.Label>
                                    <Statistic.Value>{props.profile.profileData.scoreStyleAccuracy.toFixed(2)}%</Statistic.Value>
                                </Statistic>
                            </Statistic.Group>

                            <Divider horizontal inverted>
                                Scores
                            </Divider>

                            <Table singleLine selectable inverted>
                                <Table.Header>
                                    <Table.Row>
                                        <Table.HeaderCell></Table.HeaderCell>
                                        <Table.HeaderCell>Beatmap</Table.HeaderCell>
                                        <Table.HeaderCell>Mods</Table.HeaderCell>
                                        <Table.HeaderCell>Accuracy</Table.HeaderCell>
                                        <Table.HeaderCell>PP</Table.HeaderCell>
                                        <Table.HeaderCell>Result</Table.HeaderCell>
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    {props.profile.scores.map((score, i) => (
                                        <Table.Row key={i}>
                                            <Table.Cell>{i+1}</Table.Cell>
                                            <Table.Cell>{score.beatmap.artist} - {score.beatmap.title} [{score.beatmap.difficultyName}]</Table.Cell>
                                            <Table.Cell>{formatMods(score.mods)}</Table.Cell>
                                            <Table.Cell>{score.accuracy.toFixed(2)}%</Table.Cell>
                                            <Table.Cell>{score.pp.toFixed(0)}pp</Table.Cell>
                                            <Table.Cell>{formatScoreResult(score.result)}</Table.Cell>
                                        </Table.Row>
                                    ))}
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
    profileThunkFetch: (userString: string, gamemode: number) => void;
    profile: ProfileState
}

function mapStateToProps(state: StoreState) {
    return {
        profile: state.profile
    }
}

const mapDispatchToProps = {
    profileThunkFetch
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
