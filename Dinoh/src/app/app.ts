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

    protected readonly navItems = [
        { label: 'Home', icon: '🏠', badge: null as number | null, active: true },
        { label: 'All Apps', icon: '📦', badge: 42 as number | null, active: false },
        { label: 'Golden Tier', icon: '🏅', badge: 7 as number | null, active: false },
        { label: 'Hubs', icon: '📁', badge: 3 as number | null, active: false },
        { label: 'Reports', icon: '📄', badge: null as number | null, active: false },
        { label: 'Settings', icon: '⚙️', badge: null as number | null, active: false }
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
}
