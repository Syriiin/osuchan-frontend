import styled from "styled-components";

export const DataTable = styled.table`
    width: 100%;
`;

export const DataCell = styled.td<DataCellProps>`
    text-align: right;
    color: ${props => props.highlighted ? props.theme.colours.timber : "inherit"};
`;

interface DataCellProps {
    highlighted?: boolean;
}
