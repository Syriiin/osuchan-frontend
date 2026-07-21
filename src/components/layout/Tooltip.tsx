import { useState, cloneElement } from "react";
import {
    useFloating,
    autoUpdate,
    offset,
    flip,
    shift,
    useHover,
    useFocus,
    useDismiss,
    useRole,
    useInteractions,
    FloatingPortal,
} from "@floating-ui/react";
import styled from "styled-components";

const TooltipContent = styled.div`
    background-color: ${(props) => props.theme.colours.background};
    color: #fff;
    font-style: normal;
    min-height: 35px;
    padding: 8px 12px;
    border-radius: 4px;
    font-size: 14px;
    line-height: 1.4;
    pointer-events: none;
    z-index: 9999;
    display: flex;
    align-items: center;
`;

interface TooltipProps {
    content: React.ReactNode;
    children: React.ReactElement;
    place?: "top" | "bottom" | "left" | "right";
}

export const Tooltip = ({ content, children, place = "top" }: TooltipProps) => {
    const [isOpen, setIsOpen] = useState(false);

    const { refs, floatingStyles, context } = useFloating({
        open: isOpen,
        onOpenChange: setIsOpen,
        placement: place,
        middleware: [offset(6), flip(), shift()],
        whileElementsMounted: autoUpdate,
    });

    const hover = useHover(context, { move: false });
    const focus = useFocus(context);
    const dismiss = useDismiss(context);
    const role = useRole(context, { role: "tooltip" });

    const { getReferenceProps, getFloatingProps } = useInteractions([hover, focus, dismiss, role]);

    const trigger = cloneElement(children, {
        ...getReferenceProps(),
        ref: refs.setReference,
    } as Record<string, unknown>);

    return (
        <>
            {trigger}
            {isOpen && (
                <FloatingPortal>
                    <TooltipContent
                        ref={refs.setFloating}
                        style={floatingStyles}
                        {...getFloatingProps()}
                    >
                        {content}
                    </TooltipContent>
                </FloatingPortal>
            )}
        </>
    );
};
