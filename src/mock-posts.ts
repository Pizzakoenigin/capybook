import { Post } from "./app/post";
import { CAPYBARAS } from "./mock-capybara";
import { Comment } from "./app/comment";

export const POSTS: Post[] = [
    {
        id: 1,
        date: new Date(2024, 5, 1),
        // author: 'Carlos',
        content: '📷🌿 Hallo Freunde! Hier ist ein niedlicher Moment aus meinem gemütlichen Leben. 😍🍽️ Ihr wisst ja, wie sehr ich Essen liebe, aber habt ihr schon einmal gesehen, wo ich am liebsten schlafe? In meiner Futterschüssel! 🥰 Sie ist so weich und bequem, dass ich einfach nicht widerstehen kann. 😴💤 Wer braucht schon ein Bett, wenn man eine Futterschüssel hat, oder? 😄🐾 Lasst mich wissen, wo ihr am liebsten schlaft! Euer gemütliches Capybara. 🐾💕 ',
        hashtags: '#CapybaraLife #GemütlichSchlafen #FutterschüsselLiebe',
        source: 'assets/img/capybara5.webp',
        likes: 23,
        liked: false,
        commentPossible: false,
        editComment: false,
        comments: [
            {
                user: CAPYBARAS[8].name,
                userID: CAPYBARAS[8].id,
                image: CAPYBARAS[8].image,
                comment: "Was für eine tolle Schüssel 😍"
            }],
        userComment: []
    },
    {
        id: 2,
        date: new Date(2024, 5, 2),
        // author: 'Horst',
        content: '🌿 Hey Leute! Hier ist euer liebenswertes Capybara, das euch mitteilen möchte, wie sehr ich Gras liebe! 🌱💚 Es gibt nichts Besseres als einen saftigen Grashalm zu knabbern und den frischen Geschmack zu genießen. Das ist mein ultimativer Genuss! 😋🌿',
        hashtags: '#Grasliebe #CapybaraLife #GenussimGras',
        source: 'assets/img/capybara3.jpg',
        likes: 12,
        liked: false,
        commentPossible: false,
        editComment: false,
        comments: [{
            user: CAPYBARAS[6].name,
            userID: CAPYBARAS[6].id,
            image: CAPYBARAS[6].image,
            comment: "Langes Gras schmeckt am besten"
        }, {
            user: CAPYBARAS[3].name,
            userID: CAPYBARAS[3].id,
            image: CAPYBARAS[3].image,
            comment: "Da kriege ich richtig Appetit 🤤"
        }],
        userComment: []
    }, {
        id: 3,
        date: new Date(2024, 5, 3),
        // author: 'Frederik',
        content: '📷🌿 Hallo Freunde! Ich bin ein Capybara, das größte Nagetier der Welt 🌎 und ich möchte euch mein Leben zeigen! 🥰 Heute möchte ich euch mein Lieblingsgras zeigen - es ist so lecker, dass ich nicht widerstehen kann! 🌾🍃 Ich liebe es, Zeit mit meinen Freunden zu verbringen, sei es beim Plantschen im Wasser 💦 oder beim Kuscheln unter der Sonne ☀️. Wir Capybaras sind sehr soziale Tiere und lieben es, in Gruppen zu leben. Zusammen sind wir stark! 💪Was sind eure Lieblingsbeschäftigungen? Schreibt sie in die Kommentare und lasst uns darüber plaudern! Ich bin neugierig, was ihr so macht! 😄Folgt mir, um mehr von meinem aufregenden Capybara-Leben zu erfahren! Bleibt gespannt auf weitere Abenteuer und lustige Momente aus meinem Alltag! 🐾💚',
        hashtags: '#CapybaraLeben #Grasliebe #BesteFreunde #Abenteuer #Tierliebe #CapybaraLiebe',
        source: 'assets/img/capybara6.jpg',
        likes: 7,
        liked: false,
        commentPossible: false,
        editComment: false,
        comments: [{
            user: CAPYBARAS[3].name,
            userID: CAPYBARAS[3].id,
            image: CAPYBARAS[3].image,
            comment: "Ich verabrede mich gerne mit meinen Freunden zum essen 🥰 🍽️ 🌱"

        }],
        userComment: []
    }, {
        id: 4,
        date: new Date(2024, 5, 4),
        // author: 'Matilde',
        content: 'Hey, bist du auch ein Capybara?',
        hashtags: '#CapybaraLeben #BesteFreunde #CapybaraLiebe',
        source: 'assets/img/capybara4.jpg',
        likes: 5,
        liked: false,
        commentPossible: false,
        editComment: false,
        comments: [],
        userComment: []
    },
]


