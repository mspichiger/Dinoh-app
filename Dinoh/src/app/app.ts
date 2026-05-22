import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface AppCard {
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

interface StatCard {
    label: string;
    value: string;
    delta: string;
    icon: string;
    accent: string;
}

interface ExploreItem {
    type: 'GEM' | 'NOTEBOOK' | 'PROMPT';
    title: string;
    author: string;
    description: string;
    tags: string[];
    extraTags: number;
    confidentiality: 'C1' | 'C2' | 'C3' | 'C4';
    rating: number;
    reviews: number;
    bookmarks: number;
}

@Component({
    selector: 'app-root',
    imports: [CommonModule, FormsModule],
    templateUrl: './app.html',
    styleUrl: './app.css'
})
export class App {
    protected readonly title = signal('Dinoh');
    protected readonly sidebarOpen = signal(false);
    protected readonly submitOpen = signal(false);

    protected readonly availableTags = [
        'Automation', 'Biostatistics', 'Clinical', 'Coding', 'Collaboration', 'Commercial',
        'Compliance', 'Computational Toxicology', 'Creative', 'Data', 'Drug Discovery',
        'Education', 'GSuite', 'Manufacturing', 'Marketing', 'PKPD Modeling', 'Productivity',
        'Regulatory', 'Training', 'Writing'
    ];

    protected readonly functions = [
        'IT', 'Data Science', 'Clinical Development', 'Pharma Research',
        'Commercial', 'Manufacturing', 'Regulatory Affairs', 'Other'
    ];

    protected readonly confidentialityLevels = ['C1', 'C2', 'C3', 'C4'];

    protected readonly currentUser = {
        name: 'Mara Spichiger',
        email: 'mara.spichiger@roche.com'
    };

    protected readonly maxDescription = 300;
    protected readonly maxTags = 5;

    protected submitForm = {
        url: '',
        name: '',
        description: '',
        tags: [] as string[],
        function: '',
        department: '',
        confidentiality: 'C2'
    };

    protected toggleSidebar() {
        this.sidebarOpen.update(v => !v);
    }

    protected closeSidebar() {
        this.sidebarOpen.set(false);
    }

    protected openSubmit() {
        this.submitOpen.set(true);
    }

    protected closeSubmit() {
        this.submitOpen.set(false);
    }

    protected toggleTag(tag: string) {
        const i = this.submitForm.tags.indexOf(tag);
        if (i >= 0) {
            this.submitForm.tags.splice(i, 1);
        } else if (this.submitForm.tags.length < this.maxTags) {
            this.submitForm.tags.push(tag);
        }
    }

    protected isTagSelected(tag: string): boolean {
        return this.submitForm.tags.includes(tag);
    }

    protected isFormValid(): boolean {
        const f = this.submitForm;
        return !!(f.url && f.name && f.description && f.tags.length > 0 && f.function && f.confidentiality);
    }

    protected handleSubmit() {
        if (!this.isFormValid()) return;
        console.log('App submitted:', { ...this.submitForm, submittedBy: this.currentUser });
        alert(`Danke! "${this.submitForm.name}" wurde eingereicht.`);
        this.submitForm = {
            url: '', name: '', description: '', tags: [],
            function: '', department: '', confidentiality: 'C2'
        };
        this.closeSubmit();
    }

    protected readonly sidebarCollapsed = signal(false);

    protected toggleSidebarCollapsed() {
        this.sidebarCollapsed.update(v => !v);
    }

    protected readonly homeItem = {
        label: 'Home', icon: '🏠', active: true
    };

    protected readonly browseItems = [
        { label: 'Prompt Library', icon: '📄', iconImg: null as string | null, badge: 7 as number | null, active: false },
        { label: 'Top Rated', icon: '', iconImg: 'dino-gold.svg', badge: null as number | null, active: false }
    ];

    protected readonly categoryItems = [
        { label: 'Coding', icon: '💻' },
        { label: 'Writing & Creative', icon: '✍️' },
        { label: 'Productivity', icon: '⚡' },
        { label: 'Data & Analytics', icon: '📊' },
        { label: 'Education', icon: '🎓' },
        { label: 'Drug Development', icon: '💊' },
        { label: 'Clinical & Regulatory', icon: '🩺' },
        { label: 'Commercial', icon: '💼' }
    ];

    protected readonly stats: StatCard[] = [
        { label: 'Total Apps', value: '42', delta: '+12%', icon: '📦', accent: '#22c55e' },
        { label: 'Active Users', value: '2.4k', delta: '+23%', icon: '👥', accent: '#22c55e' },
        { label: 'Golden Tier Apps', value: '7', delta: '+3', icon: '🏅', accent: '#f59e0b' },
        { label: 'Trending Apps', value: '12', delta: '+8%', icon: '📈', accent: '#22c55e' }
    ];

    protected readonly topRated: AppCard[] = [
        {
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

    protected readonly exploreSearch = signal('');

    protected readonly exploreItems: ExploreItem[] = [
        {
            type: 'GEM',
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
            type: 'GEM',
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
            type: 'GEM',
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
            type: 'GEM',
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
            type: 'NOTEBOOK',
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
            type: 'GEM',
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

    protected filteredExplore(): ExploreItem[] {
        const q = this.exploreSearch().toLowerCase().trim();
        if (!q) return this.exploreItems;
        return this.exploreItems.filter(i =>
            i.title.toLowerCase().includes(q) ||
            i.description.toLowerCase().includes(q) ||
            i.author.toLowerCase().includes(q) ||
            i.tags.some(t => t.toLowerCase().includes(q))
        );
    }
}
