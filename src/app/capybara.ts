import { Post } from "./post";

export interface Capybara {
    id: number;
    name: string;
    description?: string;
    image?: string;
    hobbies?: string;
    age?: number;
    canFollow: boolean;
    posts?: any[];
    friends?: any[]
}

// ? sorgt dafür das die Eigenschaft optional ist und nicht für jedes Element angegeben werden muss.