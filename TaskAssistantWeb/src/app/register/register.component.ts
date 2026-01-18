import { Component, inject } from "@angular/core";
import { AuthService } from "../shared/data-access/auth.service";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { toSignal } from "@angular/core/rxjs-interop";
import { Router, RouterLink } from "@angular/router";


@Component({
    selector: 'app-register',
    standalone: true,
    template: `
        <div class="login-container">
        <form [formGroup]="registerForm" (ngSubmit)="handleSubmit()">
            <h2>New User Registration!</h2>
            <div class="input-group">
                <input type="text" formControlName="firstname" placeholder="First Name" />
            </div>
            <div class="input-group">
            <input type="text" formControlName="lastname" placeholder="Last Name" />
            </div>
            <div class="input-group">
                <input type="text" formControlName="email" placeholder="Email" />
            </div>
            <div class="input-group">
                <input type="password" formControlName="password" placeholder="Password" />
            </div>
            <button class="btn-primary" type="submit">Register</button>
            <div class="input-group">
            <button [routerLink]="['/login']" class="btn-secondary" type="submit">Cancel</button>
            </div>
        </form>        
        </div>
    `,
    imports: [ReactiveFormsModule, RouterLink]
})

export default class RegisterComponent {
    authService = inject(AuthService);
    private fb = inject(FormBuilder);
    private router = inject(Router);


    registerForm: FormGroup = this.fb.nonNullable.group({
        firstname: [''],
        lastname: [''],
        email: ['',Validators.email],
        password: [''],
        username: ['']
    });

    handleSubmit() {
        const newUser = this.registerForm.getRawValue();
        newUser.username = newUser.email;
        this.authService.register$.next(newUser);
        this.router.navigate(['/login']);
    }
}