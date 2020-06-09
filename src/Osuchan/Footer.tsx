import React from "react";
import styled from "styled-components";

const FooterWrapper = styled.footer`
    padding: 20px;
    text-align: center;
    color: ${props => props.theme.colours.currant};
`;

const Footer = () => {
    return (
        <FooterWrapper>
            <span>&copy; osu!chan 2019 | Team osu!chan</span>
        </FooterWrapper>
    );
}

export default Footer;
