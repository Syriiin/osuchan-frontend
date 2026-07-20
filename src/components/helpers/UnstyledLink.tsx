import styled from "styled-components";
import { Link } from "react-router";

export const UnstyledLink = styled(Link)`
    color: unset;

    &:hover {
        text-decoration: unset;
    }
`;
