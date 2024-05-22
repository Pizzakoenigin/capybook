export interface Post {
    id: number;
    author: string;
    content: string;
    hashtags: string;
    source: string;
    likes: number;
    liked: boolean;
    comments: string[];
    // newComment: string
}
