import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

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
    imports: [CommonModule],
    templateUrl: './app.html',
    styleUrl: './app.css'
})
export class App {
    protected readonly title = signal('Dinoh');
    protected readonly sidebarOpen = signal(false);

    protected toggleSidebar() {
        this.sidebarOpen.update(v => !v);
    }

    protected closeSidebar() {
        this.sidebarOpen.set(false);
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
