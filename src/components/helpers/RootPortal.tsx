import React from "react";
import ReactDOM from "react-dom";

export const RootPortal = (props: PortalProps) =>
    ReactDOM.createPortal(props.children, document.getElementById("root")!);

interface PortalProps {
    children: React.ReactNode;
}
