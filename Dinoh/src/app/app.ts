import { Component, OnInit, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, AppCard, ExploreItem, StatCard } from './services/api.service';

@Component({
    selector: 'app-root',
    imports: [CommonModule, FormsModule],
    templateUrl: './app.html',
    styleUrl: './app.css'
})
export class App implements OnInit {
    private readonly api = inject(ApiService);
    private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

    ngOnInit(): void {
        // Skip HTTP during SSR/prerender — data will be fetched on the client.
        if (!this.isBrowser) return;

        this.api.getStats().subscribe({
            next: data => this.stats.set(data),
            error: err => console.error('Failed to load stats', err)
        });
        this.api.getTopRated().subscribe({
            next: data => this.topRated.set(data),
            error: err => console.error('Failed to load top rated', err)
        });
        this.api.getExplore().subscribe({
            next: data => this.exploreItems.set(data),
            error: err => console.error('Failed to load explore items', err)
        });
    }

    protected readonly title = signal('Dinoh');
    protected readonly sidebarOpen = signal(false);
    protected readonly submitOpen = signal(false);
    protected readonly helpOpen = signal(false);
    protected readonly shareOpen = signal(false);
    protected readonly shareTab = signal<'apps' | 'prompts'>('apps');
    protected readonly view = signal<'home' | 'prompts' | 'top-rated'>('home');
    protected readonly promptsSearch = signal('');
    protected readonly topRatedSearch = signal('');
    protected readonly topRatedFilter = signal<'all' | 'APP' | 'PROMPT'>('all');

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

    protected openHelp() {
        this.helpOpen.set(true);
    }

    protected closeHelp() {
        this.helpOpen.set(false);
    }

    protected openShare() {
        this.shareOpen.set(true);
    }

    protected closeShare() {
        this.shareOpen.set(false);
    }

    protected setShareTab(tab: 'apps' | 'prompts') {
        this.shareTab.set(tab);
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
        const payload = {
            ...this.submitForm,
            submittedBy: this.currentUser
        };
        this.api.submitApp(payload).subscribe({
            next: () => {
                alert(`Danke! "${this.submitForm.name}" wurde eingereicht.`);
                this.submitForm = {
                    url: '', name: '', description: '', tags: [],
                    function: '', department: '', confidentiality: 'C2'
                };
                this.closeSubmit();
            },
            error: err => {
                console.error('Submit failed', err);
                alert('Submit fehlgeschlagen. Bitte versuche es erneut.');
            }
        });
    }

    protected readonly sidebarCollapsed = signal(false);

    protected toggleSidebarCollapsed() {
        this.sidebarCollapsed.update(v => !v);
    }

    protected readonly homeItem = {
        label: 'Home', icon: '🏠', active: true, target: 'top'
    };

    protected readonly browseItems = [
        { label: 'Prompt Library', icon: '📄', iconImg: null as string | null, badge: 7 as number | null, active: false, target: 'prompts' },
        { label: 'Top Rated', icon: '', iconImg: 'dino-gold.png', badge: null as number | null, active: false, target: 'top-rated' }
    ];

    protected isNavActive(target: string): boolean {
        if (this.view() === 'prompts') return target === 'prompts';
        if (this.view() === 'top-rated') return target === 'top-rated';
        return target === 'top';
    }

    protected scrollToSection(id: string) {
        if (id === 'prompts') {
            this.view.set('prompts');
            if (this.isBrowser) window.scrollTo({ top: 0, behavior: 'smooth' });
            this.closeSidebar();
            return;
        }
        if (id === 'top-rated') {
            this.view.set('top-rated');
            if (this.isBrowser) window.scrollTo({ top: 0, behavior: 'smooth' });
            this.closeSidebar();
            return;
        }
        this.view.set('home');
        if (!this.isBrowser) { this.closeSidebar(); return; }
        if (id === 'top') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            setTimeout(() => {
                const el = document.getElementById(id);
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 0);
        }
        this.closeSidebar();
    }

    protected setTopRatedFilter(f: 'all' | 'APP' | 'PROMPT') {
        this.topRatedFilter.set(f);
    }

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

    protected readonly stats = signal<StatCard[]>([]);

    protected readonly topRated = signal<AppCard[]>([]);

    protected readonly exploreSearch = signal('');

    protected readonly exploreItems = signal<ExploreItem[]>([]);

    protected readonly filteredExplore = computed<ExploreItem[]>(() => {
        const q = this.exploreSearch().toLowerCase().trim();
        const items = this.exploreItems();
        if (!q) return items;
        return items.filter(i =>
            i.title.toLowerCase().includes(q) ||
            i.description.toLowerCase().includes(q) ||
            i.author.toLowerCase().includes(q) ||
            i.tags.some(t => t.toLowerCase().includes(q))
        );
    });

    protected readonly filteredPrompts = computed<ExploreItem[]>(() => {
        const q = this.promptsSearch().toLowerCase().trim();
        const items = this.exploreItems().filter(i => i.type === 'PROMPT');
        if (!q) return items;
        return items.filter(i =>
            i.title.toLowerCase().includes(q) ||
            i.description.toLowerCase().includes(q) ||
            i.author.toLowerCase().includes(q) ||
            i.tags.some(t => t.toLowerCase().includes(q))
        );
    });

    protected readonly topRatedCounts = computed(() => {
        const items = this.exploreItems();
        return {
            all: items.length,
            APP: items.filter(i => i.type === 'APP').length,
            PROMPT: items.filter(i => i.type === 'PROMPT').length
        };
    });

    protected readonly filteredTopRated = computed<ExploreItem[]>(() => {
        const q = this.topRatedSearch().toLowerCase().trim();
        const f = this.topRatedFilter();
        let items = [...this.exploreItems()].sort((a, b) => b.rating - a.rating || b.reviews - a.reviews);
        if (f !== 'all') items = items.filter(i => i.type === f);
        if (q) items = items.filter(i =>
            i.title.toLowerCase().includes(q) ||
            i.description.toLowerCase().includes(q) ||
            i.author.toLowerCase().includes(q) ||
            i.tags.some(t => t.toLowerCase().includes(q))
        );
        return items;
    });
}