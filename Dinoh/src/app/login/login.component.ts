import { Component, inject } from '@angular/core';
import { AuthService } from '../auth/auth.service';

@Component({
    selector: 'app-login',
    standalone: true,
    host: { ngSkipHydration: 'true' },
    templateUrl: './login.component.html',
    styleUrl: './login.component.css'
})
export class LoginComponent {
    private readonly auth = inject(AuthService);

    signIn(): void {
        this.auth.login();
    }
}
