import { Helmet } from "react-helmet";
import styled from "styled-components";

const UpdateTitle = styled.span`
    color: ${(props) => props.theme.colours.timber};
`;

const Home = () => (
    <>
        <Helmet>
            <title>Home - osu!chan</title>
            <meta
                name="description"
                content="osu!chan - osu! stats, custom leaderboards, and much more!"
            />
        </Helmet>
    </>
);

export default Home;
