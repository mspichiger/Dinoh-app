export interface AppCard {
    id: string;
    name: string;
    author: string;
    description: string;
    rating: number;
    reviews: number;
    value: number;
    users: number;
    tags: string[];
    rank: number;
    emoji: string;
}

export interface StatCard {
    label: string;
    value: string;
    delta: string;
    icon: string;
    accent: string;
}

export type ExploreType = 'APP' | 'PROMPT';
export type Confidentiality = 'C1' | 'C2' | 'C3' | 'C4';

export interface ExploreItem {
    id: string;
    type: ExploreType;
    title: string;
    author: string;
    description: string;
    tags: string[];
    extraTags: number;
    confidentiality: Confidentiality;
    rating: number;
    reviews: number;
    bookmarks: number;
}

export interface SubmittedApp {
    id: string;
    url: string;
    name: string;
    description: string;
    tags: string[];
    function: string;
    department: string;
    confidentiality: Confidentiality;
    submittedBy: { name: string; email: string };
    submittedAt: string;
}
