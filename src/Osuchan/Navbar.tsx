import { faEnvelope, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { observer } from "mobx-react-lite";
import React, { useState } from "react";
import { Link, type LinkProps, useMatch, useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";

import {
    Button,
    SimpleMenu,
    SimpleMenuDivider,
    SimpleMenuItem,
    SimpleModal,
    SimpleModalTitle,
    TextField,
    TextInput,
    UnstyledLink,
} from "../components";
import { ResourceStatus } from "../store/status";
import { formatGamemodeNameShort } from "../utils/formatting";
import { useAutorun, useStore } from "../utils/hooks";
import { gamemodeIdFromName } from "../utils/osu";

const NavbarWrapper = styled.nav`
    display: flex;
    align-items: center;
    height: 70px;
    background-color: ${(props) => props.theme.colours.pillow};
    padding: 0 50px;
`;

const NavInner = styled.div`
    max-width: 1000px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    width: 100%;
`;

const LinksContainer = styled.div`
    display: flex;
    align-items: center;
`;

const NavbarLink = styled(Link)<NavbarLinkProps>`
    margin: 10px;
    font-size: 1.1em;
    font-weight: normal;
    color: ${(props) => (props.$active ? props.theme.colours.mango : "#fff")};
    text-decoration: none;
    border-bottom: ${(props) =>
        props.$active ? `2px solid ${props.theme.colours.mango}` : "2px solid transparent"};
    padding-bottom: 2px;

    &:hover {
        text-decoration: none;
        color: ${(props) =>
            props.$active ? props.theme.colours.mango : props.theme.colours.timber};
    }
`;

interface NavbarLinkProps extends LinkProps {
    $active?: boolean;
}

const TitleContainer = styled.div`
    display: flex;
    align-items: center;
    flex-shrink: 0;
    white-space: nowrap;
`;

const Logo = styled.img`
    width: 36px;
    margin-right: 5px;
`;

const Title = styled.h1`
    display: flex;
    align-items: center;
    margin: 10px;
    font-size: 2em;
    font-weight: 400;

    a {
        color: #fff;

        &:hover {
            text-decoration: none;
        }
    }
`;

const TitleText = styled.span`
    transform: translateY(-4px);
`;

const UserMenuContainer = styled.div`
    display: flex;
    flex: 1;
    justify-content: flex-end;
    align-items: center;
`;

const SearchInput = styled(TextInput)`
    margin: 10px;
    padding-right: 30px;
`;

const SearchWrapper = styled.div`
    position: relative;
    display: flex;
    align-items: center;

    svg {
        position: absolute;
        right: 20px;
        color: #757575;
        pointer-events: none;
    }
`;

const LoginLink = styled.a`
    margin: 10px;
    text-decoration: none;
`;

const InviteIconWrapper = styled.div`
    margin: 10px;
    width: 50px;
`;

const NotificationNumber = styled.div`
    position: absolute;
    top: 0;
    right: 10px;
    width: 20px;
    height: 20px;
    border-radius: 10px;
    background-color: ${(props) => props.theme.colours.mystic};
`;

const InviteWrapper = styled.div`
    display: flex;
    align-items: center;
`;

const InviteLeaderboardImage = styled.img`
    height: 20px;
    margin-right: 5px;
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

const Navbar = observer(() => {
    const navigate = useNavigate();
    const location = useLocation();

    const store = useStore();
    const meStore = store.meStore;

    // State hooks
    const [searchValue, setSearchValue] = useState("");
    const [addScoreModalOpen, setAddScoreModalOpen] = useState(false);
    const [addScoreUserUrl, setAddScoreUserUrl] = useState("");
    const [addScoreBeatmapUrl, setAddScoreBeatmapUrl] = useState("");

    // Use effect to initialse form values
    useAutorun(() => {
        setAddScoreUserUrl(`https://osu.ppy.sh/users/${meStore.user?.osuUserId.toString()}` || "");
    });

    // Handlers
    const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        if (searchValue.length >= 2) {
            navigate(`/users/${searchValue}`);
            setSearchValue("");
        }
        event.preventDefault();
    };
    const handleAddScoreSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const userUrlRe = /osu.ppy.sh\/users\/(\d+)/;
        const userUrlMatch = addScoreUserUrl.match(userUrlRe);
        const beatmapUrlRe = new RegExp(
            /osu.ppy.sh\/beatmapsets\/\d+#(osu|taiko|fruits|mania)\/(\d+)/,
            "g",
        );

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
    };

    const osuUserId = meStore.user?.osuUserId;

    const handleAddScoreModalClose = () => {
        setAddScoreModalOpen(false);
        setAddScoreUserUrl(
            osuUserId !== undefined ? `https://osu.ppy.sh/users/${osuUserId.toString()}` : "",
        );
        setAddScoreBeatmapUrl("");
    };

    // Variables
    const { user, invites, isAuthenticated } = meStore;

    const leaderboardsMatch = useMatch("/leaderboards/:leaderboardType/:gamemode/*");

    return (
        <NavbarWrapper>
            <NavInner>
                {/* osu!chan title */}
                <TitleContainer>
                    <UnstyledLink to="/">
                        <Title>
                            <Logo src="/static/icon.svg" />
                            <TitleText>osu!chan</TitleText>
                        </Title>
                    </UnstyledLink>
                </TitleContainer>

                <LinksContainer>
                    {/* Links */}
                    <NavbarLink
                        to="/"
                        $active={
                            location.pathname === "/" || location.pathname.startsWith("/users")
                        }
                    >
                        profiles
                    </NavbarLink>
                    <NavbarLink
                        to={
                            leaderboardsMatch != null
                                ? `/leaderboards/${leaderboardsMatch.params.leaderboardType}/${leaderboardsMatch.params.gamemode}`
                                : "/leaderboards/global/osu"
                        }
                        $active={leaderboardsMatch !== null}
                    >
                        leaderboards
                    </NavbarLink>
                    <NavbarLink to="/events" $active={location.pathname.startsWith("/events")}>
                        events
                    </NavbarLink>
                </LinksContainer>

                <UserMenuContainer>
                    {/* User search */}
                    <form onSubmit={handleSearchSubmit}>
                        <SearchWrapper>
                            <SearchInput
                                id="home-search"
                                placeholder="osu! username"
                                onChange={(e) => setSearchValue(e.currentTarget.value)}
                                value={searchValue}
                            />
                            <FontAwesomeIcon icon={faMagnifyingGlass} />
                        </SearchWrapper>
                    </form>

                    {/* Login button / user menu */}
                    {isAuthenticated ? (
                        <>
                            <SimpleMenu
                                width={150}
                                triggerElement={
                                    <InviteIconWrapper>
                                        {invites.length > 0 && (
                                            <NotificationNumber>
                                                {invites.length}
                                            </NotificationNumber>
                                        )}
                                        <FontAwesomeIcon icon={faEnvelope} size="lg" />
                                    </InviteIconWrapper>
                                }
                            >
                                {invites.slice(0, 5).map((invite, i) => (
                                    <Link
                                        key={i}
                                        to={`/leaderboards/community/${formatGamemodeNameShort(
                                            invite.leaderboard!.gamemode,
                                        )}/${invite.leaderboardId}`}
                                    >
                                        <SimpleMenuItem>
                                            <InviteWrapper>
                                                <InviteLeaderboardImage
                                                    src={invite.leaderboard!.iconUrl}
                                                    alt="Leaderboard icon"
                                                />
                                                <div>{invite.leaderboard!.name}</div>
                                            </InviteWrapper>
                                        </SimpleMenuItem>
                                    </Link>
                                ))}
                                {invites.length === 0 && (
                                    <SimpleMenuItem disabled>No pending invites</SimpleMenuItem>
                                )}
                                {invites.length > 5 && (
                                    <SimpleMenuItem disabled>
                                        and {invites.length - 5} more
                                    </SimpleMenuItem>
                                )}
                                <SimpleMenuDivider />
                                <Link to="/me/invites">
                                    <SimpleMenuItem>See all invites</SimpleMenuItem>
                                </Link>
                            </SimpleMenu>
                            <SimpleMenu
                                width={150}
                                triggerElement={
                                    <UserAvatarWrapper>
                                        <UserAvatar src={`https://a.ppy.sh/${user!.osuUserId}`} />
                                    </UserAvatarWrapper>
                                }
                            >
                                <Link to={`/users/${user!.osuUser!.username}`}>
                                    <SimpleMenuItem>My Profile</SimpleMenuItem>
                                </Link>
                                <SimpleMenuItem onClick={() => setAddScoreModalOpen(true)}>
                                    Add Scores
                                </SimpleMenuItem>
                                <SimpleMenuDivider />
                                <a href="/osuauth/logout">
                                    <SimpleMenuItem>Logout</SimpleMenuItem>
                                </a>
                            </SimpleMenu>

                            {/* Add Scores modal */}
                            <SimpleModal
                                open={addScoreModalOpen}
                                onClose={handleAddScoreModalClose}
                            >
                                <SimpleModalTitle>Add Scores</SimpleModalTitle>
                                <p>
                                    Enter a player's osu! profile URL and beatmap URL(s) to add
                                    scores from those beatmaps.
                                    <br />
                                    URLs must be from the new site so they match the format below.
                                </p>
                                <form onSubmit={handleAddScoreSubmit}>
                                    <label>
                                        osu! Profile URL
                                        <TextInput
                                            fullWidth
                                            required
                                            placeholder="https://osu.ppy.sh/users/5701575"
                                            onChange={(e) =>
                                                setAddScoreUserUrl(e.currentTarget.value)
                                            }
                                            value={addScoreUserUrl}
                                        />
                                    </label>
                                    <label>
                                        Beatmap URL(s)
                                        <TextField
                                            fullWidth
                                            required
                                            placeholder="https://osu.ppy.sh/beatmapsets/235836#osu/546514"
                                            onChange={(e) =>
                                                setAddScoreBeatmapUrl(e.currentTarget.value)
                                            }
                                            value={addScoreBeatmapUrl}
                                        />
                                    </label>
                                    <Button positive type="submit">
                                        Submit
                                    </Button>
                                </form>
                            </SimpleModal>
                        </>
                    ) : (
                        meStore.loadingStatus === ResourceStatus.Loading || (
                            <LoginLink href="/osuauth/login">Login</LoginLink>
                        )
                    )}
                </UserMenuContainer>
            </NavInner>
        </NavbarWrapper>
    );
});

export default Navbar;
