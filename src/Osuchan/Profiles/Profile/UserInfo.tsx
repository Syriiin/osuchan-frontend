import React from "react";
import styled from "styled-components";
import countries from "i18n-iso-countries";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignInAlt } from "@fortawesome/free-solid-svg-icons";

import { OsuUser } from "../../../store/models/profiles/types";
import { Surface } from "../../../components";

countries.registerLocale(require("i18n-iso-countries/langs/en.json"));

const UserInfoSurface = styled(Surface)`
    padding: 20px;
    grid-area: userinfo;
    display: flex;
`;

const Avatar = styled.img`
    border-radius: 15px;
    height: 128px;
    width: 128px;
`;

const UserInfoContainer = styled.div`
    display: flex;
    flex-direction: column;
    margin-left: 20px;
    width: 100%;
`;

const UserInfoRow = styled.div`
    flex-grow: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.3em;
`;

const Username = styled.span`
    font-size: 1.5em;
`;

const Flag = styled.img`
    width: 30px;
    margin-right: 0.5em;
`;

const JoinIcon = styled(FontAwesomeIcon)`
    margin-right: 0.5em;
`;

const UserInfo = (props: UserInfoProps) => {
    const osuUser = props.osuUser;

    return (
        <UserInfoSurface>
            <Avatar src={`https://a.ppy.sh/${osuUser.id}`} />
            <UserInfoContainer>
                <UserInfoRow>
                    <Username>
                        {osuUser.username}
                    </Username>
                </UserInfoRow>
                <UserInfoRow>
                    <Flag src={`https://osu.ppy.sh/images/flags/${osuUser.country}.png`} />
                    {countries.getName(osuUser.country, "en")}
                </UserInfoRow>
                <UserInfoRow>
                    <JoinIcon icon={faSignInAlt} />
                    {osuUser.joinDate.toDateString()}
                </UserInfoRow>
            </UserInfoContainer>
        </UserInfoSurface>
    );
}

interface UserInfoProps {
    osuUser: OsuUser;
}

export default UserInfo;
