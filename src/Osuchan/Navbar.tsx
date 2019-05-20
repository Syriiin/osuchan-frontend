import React, { useState } from "react";
import { connect } from "react-redux";
import { Link, withRouter, matchPath } from "react-router-dom";
import { RouteComponentProps } from "react-router";
import { Menu, Input, Image } from "semantic-ui-react";

import { MeState } from "../store/me/types";
import { StoreState } from "../store/reducers";

function Navbar(props: NavbarProps) {
    const [searchValue, setSearchValue] = useState("");

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(event.target.value);
    }

    const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        if (searchValue.length < 2) {
            return;
        }
        props.history.push(`/users/${searchValue}`);
        setSearchValue("");
        event.preventDefault();
    }

    return (
        // active item checking based on current path checking with matchPath instead of a <Route />. kinda messy but works for this scenario
        <Menu inverted>
            <Menu.Item as={Link} to="/" name="home" active={props.location.pathname === "/"}>
                Home
            </Menu.Item>
            <Menu.Item as={Link} to="/leaderboards" name="leaderboards" active={matchPath(props.location.pathname, {path: "/leaderboards", exact: true}) != null}>
                Leaderboards
            </Menu.Item>

            <Menu.Menu position="right">
                <Menu.Item>
                    <form onSubmit={handleSearchSubmit}>
                        <Input inverted transparent className="icon" icon="search" placeholder="osu! username" value={searchValue} onChange={handleSearchChange} />
                    </form>
                </Menu.Item>
                {props.me.userData ? (
                    <Menu.Item name="user">
                        <Image src={`https://a.ppy.sh/${props.me.userData.id}`} avatar />
                        <span>{props.me.userData.username}</span>
                    </Menu.Item>
                ) : (
                    <Menu.Item as="a" href="/osuauth/login" name="user">
                        Login with osu!
                    </Menu.Item>
                )}
            </Menu.Menu>
        </Menu>
    );
}

interface NavbarProps extends RouteComponentProps {
    me: MeState
}

function mapStateToProps(state: StoreState) {
    return {
        me: state.me
    }
}

export default withRouter(connect(mapStateToProps, null)(Navbar));
