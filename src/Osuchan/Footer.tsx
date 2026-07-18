import { Link } from "react-router-dom";
import styled from "styled-components";

const FooterWrapper = styled.footer`
    padding: 20px;
    text-align: center;
    color: ${(props) => props.theme.colours.currant};
`;

const FooterLink = styled(Link)`
    color: ${(props) => props.theme.colours.currant};
    text-decoration: none;

    &:hover {
        text-decoration: underline;
    }
`;

const Footer = () => (
    <FooterWrapper>
        <span>&copy; osu!chan 2026</span>
        <span> | </span>
        <FooterLink to="/about">About</FooterLink>
    </FooterWrapper>
);

export default Footer;
