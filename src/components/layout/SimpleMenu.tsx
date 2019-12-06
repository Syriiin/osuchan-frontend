import React, { useState, ReactNode, ReactNodeArray } from "react";
import styled from "styled-components";

const Menu = styled.div`
    position: absolute;
    left: calc(50% - 50px);
    top: calc(100% + 10px);
    z-index: 100;

    background-color: ${props => props.theme.colours.midground};
    border: 1px solid ${props => props.theme.colours.currant};
    border-radius: 5px;

    a, a:hover {
        text-decoration: none;
    }
`;

export const SimpleMenuItem = styled.div<SimpleMenuItemProps>`
    padding: 10px;
    width: 100px;
    color: #fff;

    &:hover {
        background-color: ${props => props.theme.colours.currant};
    }
`;

interface SimpleMenuItemProps {
    disabled?: boolean;
}

export const DisabledSimpleMenuItem = styled(SimpleMenuItem)`
    color: #777;
    cursor: default;

    &:hover {
        background-color: unset;
    }
`;

const MenuTriggerWrapper = styled.div`
    position: relative;
    text-align: center;
    cursor: pointer;
`;

export function SimpleMenu(props: SimpleMenuProps) {
    const [menuOpen, setMenuOpen] = useState(false);
    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => setMenuOpen(!menuOpen);

    return (
        <MenuTriggerWrapper onClick={handleMenuOpen}>
            {props.triggerElement}
            {menuOpen && (
                <Menu>
                    {props.children.length > 0 ? props.children : (
                        <DisabledSimpleMenuItem>{props.emptyText || "Nothing here!"}</DisabledSimpleMenuItem>
                    )}
                </Menu>
            )}
        </MenuTriggerWrapper>
    );
}

export interface SimpleMenuProps {
    triggerElement: ReactNode;
    children: ReactNodeArray;
    emptyText?: string;
}
