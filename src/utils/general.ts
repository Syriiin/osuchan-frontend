export function hasFlag(value: number, bitmask: number) {
    return (value & bitmask) === value;
}
