export interface Board {
    title: string;
    lists: List[];
}

export interface List {
    title: string;
    cards: Card[];
}

export interface Card {
    title: string;
    description: string;
    comments: Comment[];
}

export interface Comment {
    comment: string;
    timestamp: string;
}