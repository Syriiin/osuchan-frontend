import styled from "styled-components";

const FooterWrapper = styled.footer`
    padding: 20px;
    text-align: center;
    color: ${(props) => props.theme.colours.currant};
`;

const Footer = () => (
    <FooterWrapper>
        <span>&copy; osu!chan 2026</span>
    </FooterWrapper>
);

export default Footer;
