import { Capybara } from "./app/capybara";
import { POSTS } from "./mock-posts";

export const CAPYBARAS: Capybara[] = [] // capybara needs to be declared befored declaring capybaras. after that the data get pushed into the Capybaras object
CAPYBARAS.push(    {
        id: 0,
        name: 'Capybara',
        description: 'Das bist du',
        image: 'assets/img/capybara12.jpg',
        hobbies: 'Capybook',
        age: 5,
        canFollow: false,
        posts: [],
        friends: []
    },
    {
        id: 1,
        name: 'Patrick',
        description: 'taucht gerne',
        image: 'assets/img/capybara5.jpg',
        hobbies: 'tauchen',
        age: 5,
        canFollow: false,
        posts: [],
        friends: []
    }, {
        id: 2,
        name: 'Daniel',
        description: 'spielt',
        image: 'assets/img/capybara6.jpg',
        hobbies: 'spielen',
        age: 5,
        canFollow: true,
        posts: [],
        friends: []
    }, {
        id: 3,
        name: 'Rebecca',
        description: 'freundlich',
        image: 'assets/img/capybara7.jpg',
        hobbies: 'Capybaras treffen',
        age: 5,
        canFollow: true,
        posts: [],
        friends: []
    }, {
        id: 4,
        name: 'Peter',
        description: 'haarig',
        image: 'assets/img/capybara8.jpg',
        hobbies: 'Capybook',
        age: 5,
        canFollow: true,
        posts: [],
        friends: []
    }, {
        id: 5,
        name: 'Carlos',
        description: 'schläft',
        image: 'assets/img/capybara13.jpeg',
        hobbies: 'Schüsseln',
        age: 5,
        canFollow: true,
        posts: POSTS[0],
        friends: []
    }, {
        id: 6,
        name: 'Horst',
        description: 'isst',
        image: 'assets/img/capybara2.jpg',
        hobbies: 'Gras',
        age: 5,
        canFollow: true,
        posts: POSTS[1],
        friends: []
    }, {
        id: 7,
        name: 'Frederik',
        description: 'müde',
        image: 'assets/img/capybara3.jpg',
        hobbies: 'Capybook',
        age: 5,
        canFollow: true,
        posts: POSTS[2],
        friends: []
    }, {
        id: 8,
        name: 'Matilde',
        description: 'unterwegs',
        image: 'assets/img/capybara4.jpg',
        hobbies: 'Capybook',
        age: 5,
        canFollow: true,
        posts: POSTS[3],
        friends: []
    }

)