import React from "react";
import { Segment, Container, List } from "semantic-ui-react";
import styled from "styled-components";

const FooterSegment = styled(Segment)`
    &&& {
        margin-top: 5em;
        padding-top: 2em;
        padding-bottom: 2em;
    }
`;

function Footer() {
    return (
        <FooterSegment inverted vertical>
            <Container textAlign="center">
                <List horizontal inverted divided>
                    <List.Item>&copy; osu!chan 2019</List.Item>
                    <List.Item>Made by Syrin</List.Item>
                </List>
            </Container>
        </FooterSegment>
    );
}

export default Footer;