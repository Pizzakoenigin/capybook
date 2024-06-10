import { Post } from "./post";

export interface Capybara {
    id: number;
    name: string;
    description?: string;
    image?: string;
    hobbies?: string;
    age?: number;
    canFollow: boolean;
    posts?: Post[];
    friends?: any[]
}