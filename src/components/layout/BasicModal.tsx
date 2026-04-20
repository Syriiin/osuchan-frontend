import React, { useRef } from "react";
import styled from "styled-components";
import { RootPortal } from "../helpers/RootPortal";

const ModalBase = styled.div<{ $isVisible: boolean }>`
    position: fixed;
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 1;
    background-color: rgba(0, 0, 0, 0.5);
    opacity: ${(props) => (props.$isVisible ? 1 : 0)};
    visibility: ${(props) => (props.$isVisible ? "visible" : "hidden")};
    transition: opacity 200ms ease-out, visibility 200ms ease-out;
    pointer-events: ${(props) => (props.$isVisible ? "auto" : "none")};
`;

const ModalBody = styled.div`
    margin-left: auto;
    margin-right: auto;
    min-width: 600px;
    max-height: 90vh;
    overflow-y: auto;
    border-radius: 5px;
    background-color: ${(props) => props.theme.colours.midground};
`;

export const BasicModal = (props: BasicModalProps) => {
    const modalBaseEl = useRef<HTMLDivElement>(null);

    const handleCloseClick = (e: React.MouseEvent) => {
        if (e.target === modalBaseEl.current) {
            props.onClose();
        }
    };

    return (
        <RootPortal>
            <ModalBase ref={modalBaseEl} $isVisible={props.open} onMouseDown={handleCloseClick}>
                <ModalBody>{props.children}</ModalBody>
            </ModalBase>
        </RootPortal>
    );
};

export interface BasicModalProps {
    children: React.ReactNode;
    open: boolean;
    onClose: () => void;
}
