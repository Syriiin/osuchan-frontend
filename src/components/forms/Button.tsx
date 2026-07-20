import React, { useState } from "react";
import type { ComponentProps } from "react";
import styled from "styled-components";
import { LoadingSpinner } from "../layout/Loading";
import { SimpleModal, SimpleModalTitle } from "../layout/SimpleModal";

const StyledButton = styled.button<StyledButtonProps>`
    padding: 10px;
    border-radius: 10px;
    font-size: 14px;
    text-align: center;
    display: inline-block;
    color: #fff;
    background-color: ${(props) =>
        props.$negative
            ? props.theme.colours.negative
            : props.$positive
              ? props.theme.colours.positive
              : props.$active
                ? props.theme.colours.mystic
                : props.theme.colours.currant};
    border: none;
    cursor: pointer;
    width: ${(props) => (props.$fullWidth ? "100%" : "unset")};
    min-width: ${(props) => props.$minWidth ?? 100}px;

    &:hover {
        filter: brightness(1.2);
    }

    &:focus {
        outline: none;
        box-shadow: 0 0 0 1px #fff;
    }
`;

interface StyledButtonProps {
    $fullWidth?: boolean;
    $minWidth?: number;
    $negative?: boolean;
    $positive?: boolean;
    $active?: boolean;
}

export const Button = (props: ButtonProps & ComponentProps<typeof StyledButton>) => {
    const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
    const { action, confirmationMessage, isLoading, ...rest } = props;

    const handleClick = () => {
        if (action) {
            if (confirmationMessage) {
                setConfirmationModalOpen(true);
            } else {
                action();
            }
        }
    };

    return (
        <>
            <StyledButton {...rest} onClick={handleClick}>
                {isLoading ? <LoadingSpinner $scale={0.15} /> : props.children}
            </StyledButton>
            {confirmationMessage && props.action && (
                <ConfirmationModal
                    open={confirmationModalOpen}
                    onClose={() => setConfirmationModalOpen(false)}
                    action={props.action}
                    message={confirmationMessage}
                />
            )}
        </>
    );
};

interface ButtonProps {
    children: React.ReactNode;
    type?: "submit" | "reset" | "button";
    isLoading?: boolean;
    action?: () => void;
    confirmationMessage?: string;
    to?: string;
}

const YesButton = styled(Button)`
    margin-left: 5px;
`;

const ConfirmationModal = (props: ConfirmationModalProps) => (
    <SimpleModal open={props.open} onClose={props.onClose}>
        <SimpleModalTitle>Are you sure?</SimpleModalTitle>
        <p>{props.message}</p>
        <Button type="button" action={props.onClose}>
            No
        </Button>
        <YesButton
            type="button"
            $negative
            action={() => {
                props.action();
                props.onClose();
            }}
        >
            Yes
        </YesButton>
    </SimpleModal>
);

interface ConfirmationModalProps {
    open: boolean;
    onClose: () => void;
    message: string;
    action: () => void;
}

export const ButtonGroup = styled.div`
    > ${StyledButton} {
        border-radius: 0;
    }

    /* Direct child buttons */
    > ${StyledButton}:first-child {
        border-top-left-radius: 10px;
        border-bottom-left-radius: 10px;
    }

    > ${StyledButton}:last-child {
        border-top-right-radius: 10px;
        border-bottom-right-radius: 10px;
    }
`;

export const VerticalButtonGroup = styled.div`
    display: flex;
    flex-direction: column;

    /* Direct child buttons */
    > ${StyledButton} {
        border-radius: 0;
        width: 100%;
    }

    > ${StyledButton}:first-child {
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
    }

    > ${StyledButton}:last-child {
        border-bottom-left-radius: 10px;
        border-bottom-right-radius: 10px;
    }
`;
