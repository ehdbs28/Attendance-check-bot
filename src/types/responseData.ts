export type ResponseData<T> = {
    responseData: T,
};

export type CommitData = {
    author: {
        name: string,
        email: string,
        date: string,
    },
    committer: {
        name: string,
        email: string,
        date: string,
    },
    message: string,
};