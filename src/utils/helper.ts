export const removeDuplicates = (arr: string[]): string[] => {
    const uniqueValues = Array.from(new Set(arr));
    return uniqueValues;
};