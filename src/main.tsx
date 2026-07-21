import ReactDOM from "react-dom";
import { createRoot } from "react-dom/client";
import App from "./App";

// React 19 removed findDOMNode, but react-transition-group v4 (used by react-select) still needs it
(ReactDOM as Record<string, unknown>).findDOMNode = (() => null) as unknown;

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(<App />);
