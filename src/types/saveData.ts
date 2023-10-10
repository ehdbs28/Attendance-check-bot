export type SaveData<T> = {
    data: T,
    dataPath: string,
    filePath: string,
    save: () => void,
    load: () => void,
    clear: () => void,
}