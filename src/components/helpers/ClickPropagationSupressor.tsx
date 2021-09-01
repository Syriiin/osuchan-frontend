import React from "react";

export const ClickPropagationSupressor = (
    props: ClickPropagationSupressorProps
) => <div onClick={(e) => e.stopPropagation()}>{props.children}</div>;

interface ClickPropagationSupressorProps {
    children: React.ReactNode;
}
