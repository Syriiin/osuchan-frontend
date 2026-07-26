import type { Minigame } from "../../store/models/minigames/types";
import registry from "./games/registry";

interface SettingsModalProps {
    open: boolean;
    onClose: () => void;
    minigame: Minigame;
}

const SettingsModal = (props: SettingsModalProps) => {
    const implementation = registry[props.minigame.gameType];
    if (implementation === undefined) return null;
    return <implementation.SettingsComponent {...props} />;
};

export default SettingsModal;
