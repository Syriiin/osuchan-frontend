import React, { useState, useContext, useEffect } from "react";
import { Link, withRouter, LinkProps, RouteComponentProps, matchPath } from "react-router-dom";
import { observer } from "mobx-react-lite";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";

import { gamemodeIdFromName } from "../utils/osu";
import { StoreContext } from "../store";
import { SimpleMenu, SimpleMenuItem, SimpleModal, SimpleModalTitle, TextInput, Button } from "../components";

const NavbarWrapper = styled.nav`
    display: flex;
    align-items: center;
    height: 70px;
    background-color: ${props => props.theme.colours.pillow};
    padding: 0 50px;
`;

const LinksContainer = styled.div`
    flex: 1;
`;

const NavbarLink = styled(Link)<NavbarLinkProps>`
    margin: 10px;
    font-size: 1.5em;
    font-weight: ${props => props.active ? "normal" : "lighter"};
    color: ${props => props.active ? props.theme.colours.mango : "#fff"};
    text-decoration: none;

    &:hover {
        text-decoration: none;
        color: ${props => props.active ? props.theme.colours.mango : props.theme.colours.timber};
    }
`;

interface NavbarLinkProps extends LinkProps {
    active?: boolean;
}

const TitleHeader = styled.h1`
    margin: 10px;
    flex: 1;
    font-size: 2em;
    font-weight: 400;
    text-align: center;

    a {
        color: #fff;

        &:hover {
            text-decoration: none;
        }
    }
`;

const UserMenuContainer = styled.div`
    display: flex;
    flex: 1;
    justify-content: flex-end;
    align-items: center;
`;

const SearchInput = styled(TextInput)`
    margin: 10px;
`;

const LoginLink = styled.a`
    margin: 10px;
    text-decoration: none;
`;

const InviteIconWrapper = styled.div`
    margin: 10px;
    width: 50px;
`;

const UserAvatarWrapper = styled.div`
    margin: 10px;
    width: 50px;
`;

const UserAvatar = styled.img`
    height: 50px;
    width: 50px;
    border-radius: 25px;

    &:hover {
        cursor: pointer;
    }
`;

const Navbar = (props: NavbarProps) => {
    const store = useContext(StoreContext);
    const meStore = store.meStore;
    
    // State hooks
    const [searchValue, setSearchValue] = useState("");
    const [addScoreModalOpen, setAddScoreModalOpen] = useState(false);
    const [addScoreUserUrl, setAddScoreUserUrl] = useState("");
    const [addScoreBeatmapUrl, setAddScoreBeatmapUrl] = useState("");

    // Use effect to initialse form values
    useEffect(() => {
        setAddScoreUserUrl(`https://osu.ppy.sh/users/${meStore.user?.osuUserId.toString()}` || "");
    }, [meStore.user])

    // Handlers
    const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        if (searchValue.length >= 2) {
            props.history.push(`/users/${searchValue}`);
            setSearchValue("");
        }
        event.preventDefault();
    }
    const handleAddScoreSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const userUrlRe = /osu.ppy.sh\/users\/(\d+)/;
        const userUrlMatch = addScoreUserUrl.match(userUrlRe);
        const beatmapUrlRe = new RegExp(/osu.ppy.sh\/beatmapsets\/\d+#(osu|taiko|fruits|mania)\/(\d+)/, "g");
        
        let match;
        let gamemode;
        const beatmapIds = [];
        while ((match = beatmapUrlRe.exec(addScoreBeatmapUrl)) !== null) {
            gamemode = match[1];
            beatmapIds.push(parseInt(match[2]));
        }

        if (userUrlMatch !== null && beatmapIds.length > 0) {
            const userId = parseInt(userUrlMatch[1]);
            const gamemodeId = gamemodeIdFromName(gamemode);
            meStore.addScores(userId, beatmapIds, gamemodeId);
            handleAddScoreModalClose();
        }
    }
    const handleAddScoreModalClose = () => {
        setAddScoreModalOpen(false);
        setAddScoreUserUrl(`https://osu.ppy.sh/users/${meStore.user?.osuUserId.toString()}` || "");
        setAddScoreBeatmapUrl("");
    }

    // Variables
    const osuUser = meStore.user?.osuUser;
    const invites = meStore.invites;

    return (
        <NavbarWrapper>
            <LinksContainer>
                {/* Links */}
                <NavbarLink to="/" active={props.location.pathname === "/"}>Home</NavbarLink>
                <NavbarLink to="/leaderboards" active={matchPath(props.location.pathname, {path: "/leaderboards"}) !== null}>Leaderboards</NavbarLink>
            </LinksContainer>

            {/* osu!chan title */}
            <TitleHeader>
                <Link to="/">osu!chan</Link>
            </TitleHeader>

            <UserMenuContainer>
                {/* User search */}
                <form onSubmit={handleSearchSubmit}>
                    <SearchInput placeholder="osu! username" onChange={e => setSearchValue(e.currentTarget.value)} value={searchValue} />
                </form>
                
                {/* Login button / user menu */}
                {osuUser ? (
                    <>
                        <SimpleMenu triggerElement={
                            <InviteIconWrapper>
                                <FontAwesomeIcon icon={faEnvelope} size="lg" />
                            </InviteIconWrapper>
                        } emptyText="No pending invites">
                            {invites.map((invite, i) => (
                                <Link key={i} to={`/leaderboards/${invite.leaderboardId}`}>
                                    <SimpleMenuItem>{invite.leaderboard!.name}</SimpleMenuItem>
                                </Link>
                            ))}
                        </SimpleMenu>
                        <SimpleMenu triggerElement={
                            <UserAvatarWrapper>
                                <UserAvatar src={`https://a.ppy.sh/${osuUser.id}`} />
                            </UserAvatarWrapper>
                        }>
                            <Link to={`/users/${osuUser.username}`}>
                                <SimpleMenuItem>My Profile</SimpleMenuItem>
                            </Link>
                            <SimpleMenuItem onClick={() => setAddScoreModalOpen(true)}>Add Scores</SimpleMenuItem>
                            <a href="/osuauth/logout">
                                <SimpleMenuItem>Logout</SimpleMenuItem>
                            </a>
                        </SimpleMenu>

                        {/* Add Scores modal */}
                        <SimpleModal open={addScoreModalOpen} onClose={handleAddScoreModalClose}>
                            <SimpleModalTitle>Add Scores</SimpleModalTitle>
                            <p>
                                Enter a player's osu! profile URL and beatmap URL(s) to add scores from those beatmaps.
                                <br />
                                URLs must be from the new site so they match the format below.
                            </p>
                            <form onSubmit={handleAddScoreSubmit}>
                                <label>
                                    osu! Profile URL
                                    <TextInput fullWidth required placeholder="https://osu.ppy.sh/users/5701575" onChange={e => setAddScoreUserUrl(e.currentTarget.value)} value={addScoreUserUrl} />
                                </label>
                                <label>
                                    Beatmap URL(s)
                                    <TextInput fullWidth required placeholder="https://osu.ppy.sh/beatmapsets/235836#osu/546514" onChange={e => setAddScoreBeatmapUrl(e.currentTarget.value)} value={addScoreBeatmapUrl} />
                                </label>
                                <Button type="submit">Submit</Button>
                            </form>
                        </SimpleModal>
                    </>
                ) : (
                    <LoginLink href="/osuauth/login">Login</LoginLink>
                )}
            </UserMenuContainer>
            
        </NavbarWrapper>
    );
}

interface NavbarProps extends RouteComponentProps {}

export default withRouter(observer(Navbar));
