import { useState } from "react";
import { Helmet } from "react-helmet";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { Button, Surface, TextInput } from "../../components";

const HomeWrapper = styled.div`
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    height: 100%;
    justify-content: center;
    margin: 20px auto;
`;

const Title = styled.h1`
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 6em;
    font-weight: 400;
    margin-top: 0px;
`;

const Logo = styled.img`
    width: 150px;
    margin-right: 50px;
`;

const HomeSurface = styled(Surface)`
    width: 1000px;
    padding: 20px;
`;

const SearchContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
`;

const SearchInput = styled(TextInput)`
    font-size: 4em;
    text-align: center;
`;

const SearchButton = styled(Button)`
    margin-top: 20px;
    font-size: 1.5em;
    padding: 1em 2em;
`;

const Home = () => {
    const history = useHistory();

    const [searchValue, setSearchValue] = useState("");

    const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        if (searchValue.length >= 2) {
            history.push(`/users/${searchValue}`);
            setSearchValue("");
        }
        event.preventDefault();
    };

    return (
        <>
            <Helmet>
                <title>Home - osu!chan</title>
                <meta
                    name="description"
                    content="osu!chan - osu! stats, custom leaderboards, and much more!" />
            </Helmet>

            <HomeWrapper>
                <Title>
                    <Logo src="/static/icon.svg" />
                    <span>osu!chan</span>
                </Title>
                <HomeSurface>
                    <form onSubmit={handleSearchSubmit}>
                        <SearchContainer>
                            <h2>Enter an osu! username to begin...</h2>
                            <SearchInput
                                id="home-search"
                                placeholder="osu! username"
                                autoComplete="off"
                                onChange={(e) => setSearchValue(e.currentTarget.value)}
                                value={searchValue} />
                            <SearchButton type="submit">Search</SearchButton>
                        </SearchContainer>
                    </form>
                </HomeSurface>
            </HomeWrapper>
        </>
    );
};

export default Home;
