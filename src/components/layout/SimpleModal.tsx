import React, { ReactNode } from "react";
import styled from "styled-components";

import { BasicModal } from "./BasicModal";

const SimpleModalWrapper = styled.div`
    padding: 20px;
`;

export const SimpleModalTitle = styled.h1`
    margin: 0 0 20px 0;
`;

export function SimpleModal(props: SimpleModalProps) {
    return (
        <BasicModal open={props.open} onClose={props.onClose}>
            <SimpleModalWrapper>
                {props.children}
            </SimpleModalWrapper>
        </BasicModal>
    );
}

export interface SimpleModalProps {
    children: ReactNode;
    open: boolean;
    onClose: () => void;
}
