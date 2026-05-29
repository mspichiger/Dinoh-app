import { AppCard, ExploreItem, StatCard, SubmittedApp } from '../types';

export const stats: StatCard[] = [
    { label: 'Total Apps', value: '42', delta: '+12%', icon: '📦', accent: '#22c55e' },
    { label: 'Active Users', value: '2.4k', delta: '+23%', icon: '👥', accent: '#22c55e' },
    { label: 'Golden Tier Apps', value: '7', delta: '+3', icon: '🏅', accent: '#f59e0b' },
    { label: 'Trending Apps', value: '12', delta: '+8%', icon: '📈', accent: '#22c55e' }
];

export const topRated: AppCard[] = [
    {
        id: 'app-1',
        name: 'Roche Icon Generator',
        author: 'ITOT KAU',
        description: 'Generate beautiful icons from text using AI-powered generation',
        rating: 5.0,
        reviews: 127,
        value: 9.8,
        users: 490,
        tags: ['AI Tools', 'AI', 'Icons'],
        rank: 1,
        emoji: '🦕'
    },
    {
        id: 'app-2',
        name: 'CDM smartAI Agent',
        author: 'CDM Team',
        description: 'AI-powered assistant for clinical data management with commercial roles',
        rating: 5.0,
        reviews: 89,
        value: 9.5,
        users: 377,
        tags: ['AI Tools', 'Clinical', 'AI'],
        rank: 2,
        emoji: '🦖'
    },
    {
        id: 'app-3',
        name: 'Adversarial Analysis',
        author: 'Analytics Team',
        description: 'Produces a rigorous, automated and effective process to analyze your data',
        rating: 5.0,
        reviews: 143,
        value: 9.2,
        users: 131,
        tags: ['Analytics', 'Analysis', 'Automation'],
        rank: 3,
        emoji: '🦕'
    }
];

export const exploreItems: ExploreItem[] = [
    {
        id: 'ex-1',
        type: 'APP',
        title: 'J.A.R.V.I.S',
        author: 'mohsin_ahmed.khan@roche.com',
        description: 'J.A.R.V.I.S. leverages Gemini AI to transform raw voice notes from the field into structured, EPIX-ready insights in seconds.',
        tags: ['Commercial', 'Productivity'],
        extraTags: 3,
        confidentiality: 'C2',
        rating: 0,
        reviews: 0,
        bookmarks: 1
    },
    {
        id: 'ex-2',
        type: 'APP',
        title: 'Applause writing',
        author: 'angie.ofarrell@roche.com',
        description: 'Helps you easily draft Applause feedback for a colleague based on an informal description of their work and contributions.',
        tags: ['Productivity', 'Writing'],
        extraTags: 0,
        confidentiality: 'C2',
        rating: 4.0,
        reviews: 1,
        bookmarks: 4
    },
    {
        id: 'ex-3',
        type: 'APP',
        title: 'Workday goal progress updater',
        author: 'angie.ofarrell@roche.com',
        description: 'This Gem will take the input of a goal (Title + Description) and search your Workday account for matching goals.',
        tags: ['Productivity'],
        extraTags: 0,
        confidentiality: 'C2',
        rating: 0,
        reviews: 0,
        bookmarks: 2
    },
    {
        id: 'ex-4',
        type: 'APP',
        title: 'FPS BxGEM',
        author: 'resheeban.selvarajah@roche.com',
        description: 'BxGEM is an AI partner uniting global strategy and local insights to create compliant marketing solutions. Powered by Gemini.',
        tags: ['Creative', 'Commercial'],
        extraTags: 2,
        confidentiality: 'C3',
        rating: 5.0,
        reviews: 1,
        bookmarks: 0
    },
    {
        id: 'ex-5',
        type: 'APP',
        title: 'CGM smartAID Notebook',
        author: 'cdm.team@roche.com',
        description: 'A NotebookLM workspace with curated CGM clinical references and onboarding material for new commercial roles.',
        tags: ['Clinical', 'Education'],
        extraTags: 1,
        confidentiality: 'C2',
        rating: 4.8,
        reviews: 6,
        bookmarks: 9
    },
    {
        id: 'ex-6',
        type: 'PROMPT',
        title: 'Adversarial Review',
        author: 'analytics.team@roche.com',
        description: 'A multi-step prompt template that challenges your idea from opposing angles to surface weaknesses.',
        tags: ['Analytics', 'Productivity'],
        extraTags: 0,
        confidentiality: 'C2',
        rating: 5.0,
        reviews: 3,
        bookmarks: 5
    },
    {
        id: 'ex-7',
        type: 'APP',
        title: 'Roche Icon Generator',
        author: 'itot.kau@roche.com',
        description: 'Generates icons that follow the style of Roche icons from branding.roche.com.',
        tags: ['Creative', 'Productivity'],
        extraTags: 0,
        confidentiality: 'C2',
        rating: 4.8,
        reviews: 38,
        bookmarks: 12
    },
    {
        id: 'ex-8',
        type: 'PROMPT',
        title: 'Meeting Summarizer',
        author: 'mara.spichiger@roche.com',
        description: 'Turns long meeting transcripts into bullet-point summaries with action items and owners.',
        tags: ['Productivity'],
        extraTags: 0,
        confidentiality: 'C1',
        rating: 4.5,
        reviews: 12,
        bookmarks: 7
    }
];

export const submissions: SubmittedApp[] = [];
