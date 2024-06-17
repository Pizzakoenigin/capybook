import  {Comment} from "./comment"

export interface Post {
    id: number;
    // author: string;
    date: Date;
    content: string;
    hashtags?: string;
    source?: string;
    likes: number;
    liked: boolean;
    commentPossible: boolean;
    editComment: boolean;
    editPost?: boolean;
    comments: Comment[];
    userComment: string[];
}
