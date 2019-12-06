import styled from "styled-components";
import { Link } from "react-router-dom";

export const UnstyledLink = styled(Link)`
    color: unset;

    &:hover {
        text-decoration: unset;
    }
`;
