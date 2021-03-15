import React, { ComponentProps } from "react";
import styled from "styled-components";

export const DataTable = (props: DataTableProps & ComponentProps<typeof DataTableContainer>) => (
    <DataTableContainer {...props}>
        <tbody>
            {props.children}
        </tbody>
    </DataTableContainer>
);

interface DataTableProps {
    children: React.ReactNode;
}

const DataTableContainer = styled.table`
    width: 100%;
`;

export const DataCell = styled.td<DataCellProps>`
    text-align: right;
    color: ${props => props.highlighted ? props.theme.colours.timber : "inherit"};
`;

interface DataCellProps {
    highlighted?: boolean;
}
