export const chunkArray = <T>(array: T[], chunkSize: number): T[][] => {
    let result = [];
    for (var i = 0; i < array.length; i += chunkSize) {
        result.push(array.slice(i, i + chunkSize));
    }
    return result;
}