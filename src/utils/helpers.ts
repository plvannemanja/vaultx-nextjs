export const trimString = (trimString: string) => {
    if (!trimString) return "";
    return trimString.length > 30
        ? trimString.slice(0, 5) + "..." + trimString.slice(-4)
        : trimString;
};