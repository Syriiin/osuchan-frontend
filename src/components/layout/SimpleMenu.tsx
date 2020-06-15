import React, { useState, ReactNode, ReactNodeArray } from "react";
import styled from "styled-components";

const Menu = styled.div<MenuProps>`
    position: absolute;
    left: calc(50% - ${props => props.width / 2}px);
    top: calc(100% + 10px);
    z-index: 100;
    width: ${props => props.width}px;

    background-color: ${props => props.theme.colours.midground};
    border: 1px solid ${props => props.theme.colours.currant};
    border-radius: 5px;

    a, a:hover {
        text-decoration: none;
    }
`;

interface MenuProps {
    width: number;
}

export const SimpleMenuItem = styled.div<SimpleMenuItemProps>`
    padding: 10px;
    width: 100%;
    color: ${props => props.disabled ? "#777" : "#fff"};
    cursor: ${props => props.disabled ? "default" : "unset"};

    &:hover {
        background-color: ${props => !props.disabled && props.theme.colours.currant};
    }
`;

interface SimpleMenuItemProps {
    disabled?: boolean;
}

const MenuTriggerWrapper = styled.div`
    position: relative;
    text-align: center;
    cursor: pointer;
`;

export const SimpleMenu = (props: SimpleMenuProps) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => setMenuOpen(!menuOpen);

    return (
        <MenuTriggerWrapper onClick={handleMenuOpen}>
            {props.triggerElement}
            {menuOpen && (
                <Menu width={props.width ?? 100}>
                    {props.children.length > 0 ? props.children : (
                        <SimpleMenuItem disabled>{props.emptyText || "Nothing here!"}</SimpleMenuItem>
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
    width?: number;
}
