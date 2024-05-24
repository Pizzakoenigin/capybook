export interface Post {
    id: number;
    author: string;
    content: string;
    hashtags: string;
    source: string;
    likes: number;
    liked: boolean;
    commentPossible: boolean;
    editComment: boolean;
    comments: string[];
    userComment: string[];
}
