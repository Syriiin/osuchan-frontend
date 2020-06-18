import React, { useState } from "react";
import styled from "styled-components";
import { LoadingSpinner } from "../layout/Loading";
import { SimpleModal, SimpleModalTitle } from "../layout/SimpleModal";

const StyledButton = styled.button<StyledButtonProps>`
    padding: 10px;
    border-radius: 10px;
    color: #fff;
    background-color: ${props => 
        props.negative ? props.theme.colours.negative :
        props.positive ? props.theme.colours.positive :
        props.theme.colours.currant
    };
    border: none;
    cursor: pointer;
    width: ${props => props.fullWidth ? "100%" : "unset"};
    min-width: ${props => props.minWidth ?? 100}px;

    &:hover {
        filter: brightness(1.2);
    }

    &:focus {
        outline: none;
        box-shadow: 0 0 0 1px #fff; 
    }
`;

interface StyledButtonProps {
    fullWidth?: boolean;
    minWidth?: number;
    negative?: boolean;
    positive?: boolean;
}

export const Button = (props: ButtonProps) => {
    const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.stopPropagation();
        
        if (props.action) {
            if (props.confirmationMessage) {
                setConfirmationModalOpen(true);
            } else {
                props.action();
            }
        }
    }

    return (
        <>
            <StyledButton {...props} onClick={handleClick}>
                {props.isLoading ? <LoadingSpinner scale={0.15} /> : props.children}
            </StyledButton>
            {props.confirmationMessage && props.action && (
                <ConfirmationModal open={confirmationModalOpen} onClose={() => setConfirmationModalOpen(false)} action={props.action} message={props.confirmationMessage} />
            )}
        </>
    );
}

interface ButtonProps extends StyledButtonProps {
    children: React.ReactNode;
    type?: "submit" | "reset" | "button";
    isLoading?: boolean;
    action?: () => void;
    confirmationMessage?: string;
}

const YesButton = styled(Button)`
    margin-left: 5px;
`;

const ConfirmationModal = (props: ConfirmationModalProps) => (
    <SimpleModal open={props.open} onClose={props.onClose}>
        <SimpleModalTitle>Are you sure?</SimpleModalTitle>
        <p>{props.message}</p>
        <Button type="button" action={() => props.onClose()}>No</Button>
        <YesButton type="button" negative action={() => { props.action(); props.onClose(); }}>Yes</YesButton>
    </SimpleModal>
);

interface ConfirmationModalProps {
    open: boolean;
    onClose: () => void;
    message: string;
    action: () => void;
}
