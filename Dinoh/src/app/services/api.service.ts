import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AppCard {
    id?: string;
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

export interface ExploreItem {
    id?: string;
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

export interface SubmitPayload {
    url: string;
    name: string;
    description: string;
    tags: string[];
    function: string;
    department: string;
    confidentiality: string;
    submittedBy: { name: string; email: string };
}

export interface SubmittedApp extends SubmitPayload {
    id: string;
    submittedAt: string;
}

const API_BASE = 'http://localhost:4000/api';

@Injectable({ providedIn: 'root' })
export class ApiService {
    private readonly http = inject(HttpClient);

    getStats(): Observable<StatCard[]> {
        return this.http.get<StatCard[]>(`${API_BASE}/stats`);
    }

    getTopRated(): Observable<AppCard[]> {
        return this.http.get<AppCard[]>(`${API_BASE}/apps/top-rated`);
    }

    getExplore(query?: string): Observable<ExploreItem[]> {
        const url = query
            ? `${API_BASE}/explore?q=${encodeURIComponent(query)}`
            : `${API_BASE}/explore`;
        return this.http.get<ExploreItem[]>(url);
    }

    submitApp(payload: SubmitPayload): Observable<SubmittedApp> {
        return this.http.post<SubmittedApp>(`${API_BASE}/submissions`, payload);
    }
}
