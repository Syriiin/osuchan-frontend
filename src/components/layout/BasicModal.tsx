import React, { useRef } from "react";
import styled from "styled-components";
import { CSSTransition } from "react-transition-group";
import { RootPortal } from "../helpers/RootPortal";

const ModalBase = styled.div`
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
    transition: opacity 200ms;

    &.modal-base-enter {
        opacity: 0;
    }

    &.modal-base-enter-active {
        opacity: 1;
    }
    
    &.modal-base-exit {
        opacity: 1;
    }
    
    &.modal-base-exit-active {
        opacity: 0;
    }
`;

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
        <RootPortal>
            <CSSTransition
                in={props.open}
                timeout={200}
                classNames="modal-base"
                mountOnEnter
                unmountOnExit
            >
                <ModalBase ref={modalBaseEl} onMouseDown={handleCloseClick}>
                    <ModalBody>
                        {props.children}
                    </ModalBody>
                </ModalBase>
            </CSSTransition>
        </RootPortal>
    );
}

export interface BasicModalProps {
    children: React.ReactNode;
    open: boolean;
    onClose: () => void;
}
