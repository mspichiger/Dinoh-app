import { Component, OnInit, PLATFORM_ID, computed, effect, inject, signal } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, AppCard, ExploreItem, StatCard } from './services/api.service';
import { AuthService } from './auth/auth.service';
import { LoginComponent } from './login/login.component';

@Component({
    selector: 'app-root',
    imports: [CommonModule, FormsModule, LoginComponent],
    templateUrl: './app.html',
    styleUrl: './app.css'
})
export class App implements OnInit {
    private readonly api = inject(ApiService);
    private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
    protected readonly auth = inject(AuthService);

    protected readonly currentUser = computed(() => {
        const u = this.auth.user();
        return u ? { name: u.name, email: u.email, picture: u.picture, initials: this.auth.initials() } : null;
    });

    constructor() {
        effect(() => {
            if (this.isBrowser && this.auth.isAuthenticated()) {
                this.loadData();
            }
        });
    }

    ngOnInit(): void {
        // Data loading is triggered by the auth effect once the user is signed in.
    }

    private loadData(): void {
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

    protected logout(): void {
        this.auth.logout();
    }

    protected readonly title = signal('Dinoh');
    protected readonly sidebarOpen = signal(false);
    protected readonly submitOpen = signal(false);
    protected readonly helpOpen = signal(false);
    protected readonly shareOpen = signal(false);
    protected readonly shareTab = signal<'apps' | 'prompts'>('apps');
    protected readonly view = signal<'home' | 'prompts' | 'top-rated' | 'category' | 'gems' | 'notebooks'>('home');
    protected readonly promptsSearch = signal('');
    protected readonly gemsSearch = signal('');
    protected readonly notebooksSearch = signal('');
    protected readonly topRatedSearch = signal('');
    protected readonly topRatedFilter = signal<'all' | 'APP' | 'PROMPT'>('all');
    protected readonly categoryFilter = signal<string | null>(null);
    protected readonly categorySearch = signal('');
    protected readonly selectedApp = signal<AppCard | null>(null);
    protected readonly selectedExplore = signal<ExploreItem | null>(null);

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
        const u = this.currentUser();
        const payload = {
            ...this.submitForm,
            submittedBy: u ? { name: u.name, email: u.email } : { name: 'Anonymous', email: 'anonymous@roche.com' }
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

    protected readonly browseItems = computed(() => {
        const items = this.exploreItems();
        const appCount = items.filter(i => i.type === 'APP').length;
        const promptCount = items.filter(i => i.type === 'PROMPT').length;
        return [
            { label: 'Gems', iconImg: null as string | null, badge: appCount as number | null, target: 'gems' },
            { label: 'Notebooks', iconImg: null as string | null, badge: 0 as number | null, target: 'notebooks' },
            { label: 'Prompt Library', iconImg: null as string | null, badge: promptCount as number | null, target: 'prompts' },
            { label: 'Top Rated', iconImg: 'dino-gold.png' as string | null, badge: null as number | null, target: 'top-rated' }
        ];
    });

    protected isNavActive(target: string): boolean {
        if (this.view() === 'gems') return target === 'gems';
        if (this.view() === 'notebooks') return target === 'notebooks';
        if (this.view() === 'prompts') return target === 'prompts';
        if (this.view() === 'top-rated') return target === 'top-rated';
        return target === 'top';
    }

    protected scrollToSection(id: string) {
        if (id === 'gems') {
            this.view.set('gems');
            if (this.isBrowser) window.scrollTo({ top: 0, behavior: 'smooth' });
            this.closeSidebar();
            return;
        }
        if (id === 'notebooks') {
            this.view.set('notebooks');
            if (this.isBrowser) window.scrollTo({ top: 0, behavior: 'smooth' });
            this.closeSidebar();
            return;
        }
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
        { label: 'Coding', icon: '💻', tags: ['Coding'] },
        { label: 'Writing & Creative', icon: '✍️', tags: ['Writing', 'Creative'] },
        { label: 'Productivity', icon: '⚡', tags: ['Productivity'] },
        { label: 'Data & Analytics', icon: '📊', tags: ['Data', 'Analytics', 'Biostatistics'] },
        { label: 'Education', icon: '🎓', tags: ['Education', 'Training'] },
        { label: 'Drug Development', icon: '💊', tags: ['Drug Discovery', 'PKPD Modeling', 'Computational Toxicology'] },
        { label: 'Clinical & Regulatory', icon: '🩺', tags: ['Clinical', 'Regulatory', 'Compliance'] },
        { label: 'Commercial', icon: '💼', tags: ['Commercial', 'Marketing'] }
    ];

    protected selectCategory(label: string) {
        const next = this.categoryFilter() === label ? null : label;
        this.categoryFilter.set(next);
        this.categorySearch.set('');
        if (next !== null) {
            this.view.set('category');
            if (this.isBrowser) window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            this.view.set('home');
        }
        this.closeSidebar();
    }

    protected clearCategory() {
        this.categoryFilter.set(null);
        this.categorySearch.set('');
        this.view.set('home');
    }

    protected openAppDetails(app: AppCard) {
        this.selectedApp.set(app);
    }

    protected closeAppDetails() {
        this.selectedApp.set(null);
    }

    protected openExploreDetails(item: ExploreItem) {
        this.selectedExplore.set(item);
    }

    protected closeExploreDetails() {
        this.selectedExplore.set(null);
    }

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

    protected readonly filteredGems = computed<ExploreItem[]>(() => {
        const q = this.gemsSearch().toLowerCase().trim();
        const items = this.exploreItems().filter(i => i.type === 'APP');
        if (!q) return items;
        return items.filter(i =>
            i.title.toLowerCase().includes(q) ||
            i.description.toLowerCase().includes(q) ||
            i.author.toLowerCase().includes(q) ||
            i.tags.some(t => t.toLowerCase().includes(q))
        );
    });

    protected readonly filteredNotebooks = computed<ExploreItem[]>(() => []);

    protected readonly topRatedCounts = computed(() => {
        const items = this.exploreItems();
        return {
            all: items.length,
            APP: items.filter(i => i.type === 'APP').length,
            PROMPT: items.filter(i => i.type === 'PROMPT').length
        };
    });

    protected readonly filteredTopRated = computed<ExploreItem[]>(() => {
        // Top Rated ist bewusst NICHT kategoriefiltert — eigene Ansicht
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

    private categoryTags(): string[] {
        const label = this.categoryFilter();
        if (!label) return [];
        return (this.categoryItems.find(c => c.label === label)?.tags ?? []).map(t => t.toLowerCase());
    }

    private readonly categoryMatched = computed<ExploreItem[]>(() => {
        const tags = this.categoryTags();
        if (!tags.length) return [];
        const q = this.categorySearch().toLowerCase().trim();
        let items = this.exploreItems().filter(i => i.tags.some(t => tags.includes(t.toLowerCase())));
        if (q) items = items.filter(i =>
            i.title.toLowerCase().includes(q) ||
            i.description.toLowerCase().includes(q) ||
            i.author.toLowerCase().includes(q) ||
            i.tags.some(t => t.toLowerCase().includes(q))
        );
        return items;
    });

    protected readonly categoryApps = computed<ExploreItem[]>(() => this.categoryMatched().filter(i => i.type === 'APP'));
    protected readonly categoryPrompts = computed<ExploreItem[]>(() => this.categoryMatched().filter(i => i.type === 'PROMPT'));
    protected readonly categoryTotal = computed<number>(() => this.categoryMatched().length);
}