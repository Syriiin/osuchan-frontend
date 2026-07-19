import { faDiscord, faTwitter } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";

const FooterWrapper = styled.footer`
    padding: 20px;
    text-align: center;
    color: ${(props) => props.theme.colours.currant};
`;

const SocialLinks = styled.div`
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-top: 10px;
`;

const SocialLink = styled.a`
    color: ${(props) => props.theme.colours.currant};
    font-size: 1.3em;

    &:hover {
        color: #fff;
    }
`;

const FooterLink = styled.a`
    color: ${(props) => props.theme.colours.currant};
    text-decoration: none;

    &:hover {
        text-decoration: underline;
    }
`;

const Footer = () => (
    <FooterWrapper>
        <div>
            &copy; osu!chan 2026 -{" "}
            <FooterLink
                href="https://osu.ppy.sh/users/5701575"
                target="_blank"
                rel="noopener noreferrer"
            >
                Syrin
            </FooterLink>
        </div>
        <SocialLinks>
            <SocialLink
                href="https://discord.gg/z7c9tD6"
                target="_blank"
                rel="noopener noreferrer"
            >
                <FontAwesomeIcon icon={faDiscord} />
            </SocialLink>
            <SocialLink
                href="https://twitter.com/Syriiins"
                target="_blank"
                rel="noopener noreferrer"
            >
                <FontAwesomeIcon icon={faTwitter} />
            </SocialLink>
        </SocialLinks>
    </FooterWrapper>
);

export default Footer;
