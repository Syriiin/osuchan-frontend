export function hasFlag(value: number, bitmask: number) {
    return (value & bitmask) === value;
}

export function setCssCustomProperties(
    colours: Record<string, string>,
    prefix = "colours"
) {
    const root = document.documentElement;
    Object.entries(colours).forEach(([key, value]) => {
        root.style.setProperty(`--${prefix}-${key}`, value);
    });
}

export function clearCssCustomProperties(
    colours: Record<string, string>,
    prefix = "colours"
) {
    const root = document.documentElement;
    Object.keys(colours).forEach((key) => {
        root.style.removeProperty(`--${prefix}-${key}`);
    });
}
