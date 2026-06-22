import { Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export interface AuthUser {
    sub: string;
    email: string;
    name: string;
    picture: string;
}

const USER_KEY = 'dinoh.user';

const DEFAULT_USER: AuthUser = {
    sub: 'local-mara',
    email: 'mara.spichiger@roche.com',
    name: 'Mara Spichiger',
    picture: ''
};

@Injectable({ providedIn: 'root' })
export class AuthService {
    private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
    private readonly _user = signal<AuthUser | null>(null);

    readonly user = this._user.asReadonly();
    readonly isAuthenticated = computed(() => this._user() !== null);

    constructor() {
        if (this.isBrowser) {
            const raw = localStorage.getItem(USER_KEY);
            if (raw) {
                try { this._user.set(JSON.parse(raw) as AuthUser); } catch { /* ignore */ }
            }
        }
    }

    login(user: AuthUser = DEFAULT_USER): void {
        this._user.set(user);
        if (this.isBrowser) {
            localStorage.setItem(USER_KEY, JSON.stringify(user));
        }
    }

    logout(): void {
        this._user.set(null);
        if (this.isBrowser) {
            localStorage.removeItem(USER_KEY);
        }
    }

    initials(): string {
        const u = this._user();
        if (!u) return '';
        const parts = u.name.trim().split(/\s+/);
        const first = parts[0]?.[0] ?? '';
        const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
        return (first + last).toUpperCase();
    }
}
