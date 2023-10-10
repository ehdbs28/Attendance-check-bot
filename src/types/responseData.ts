export type ResponseData<T> = {
    responseData: T,
};

export type GitCommitData = {
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

export type GitUserData = {
    login: string,
    avatar_url: string,
    html_url: string,
    company: string,
    location: string,
    name: string,
    blog: string,
    bio: string,
    followers: number,
    following: number,
    created_at: string,
}