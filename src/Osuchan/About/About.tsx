import { Helmet } from "react-helmet";
import styled from "styled-components";

const AboutContainer = styled.div`
    margin: 20px auto;
    width: 1000px;
    padding: 20px;
`;

const About = () => (
    <>
        <Helmet>
            <title>About - osu!chan</title>
            <meta
                name="description"
                content="osu!chan - osu! stats, custom leaderboards, and much more!" />
        </Helmet>

        <AboutContainer>
            <h1>Welcome to osu!chan!</h1>

            <p>
                Here's a few things you can do to get started:
                <br />
                <ul>
                    <li>View a player's profile by searching their username</li>
                    <li>Explore the custom leaderboard system</li>
                </ul>
            </p>

            <p>
                If you run into any bugs, please report them in the #bugs channel of
                the <a href="https://discord.gg/z7c9tD6">discord server</a>.
            </p>

            <p>
                If want to help out with the project at all, check out the #suggestions channel of the{" "}
                <a href="https://discord.gg/z7c9tD6">discord server</a>.
                <br />
                You can also check out the code over at the github repos for the{" "}
                <a href="https://github.com/Syriiin/osuchan-frontend">
                    frontend web app
                </a>{" "}
                and/or the{" "}
                <a href="https://github.com/Syriiin/osuchan-backend">
                    backend server
                </a>
                .
            </p>
        </AboutContainer>
    </>
);

export default About;
