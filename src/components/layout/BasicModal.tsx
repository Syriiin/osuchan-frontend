import React, { ReactNode, useRef } from "react";
import styled from "styled-components";

const ModalBase = styled.div<ModalBaseProps>`
    position: fixed;
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: ${props => props.open ? "1" : "-1"};
    opacity: ${props => props.open ? "1" : "0"};
    transition: all 200ms;
`;

interface ModalBaseProps {
    open: boolean;
}

const ModalBody = styled.div`
    margin-left: auto;
    margin-right: auto;
    min-width: 600px;
    max-height: 90vh;
    overflow-y: auto;
    border-radius: 5px;
    background-color: ${props => props.theme.colours.midground};
`;

export const BasicModal = (props: BasicModalProps) => {
    const modalBaseEl = useRef(null);

    const handleCloseClick = (e: React.MouseEvent) => {
        if (e.target === modalBaseEl.current) {
            props.onClose();
        }
    }

    return (
        <ModalBase ref={modalBaseEl} open={props.open} onMouseDown={handleCloseClick}>
            <ModalBody>
                {props.children}
            </ModalBody>
        </ModalBase>
    );
}

export interface BasicModalProps {
    children: ReactNode;
    open: boolean;
    onClose: () => void;
}
