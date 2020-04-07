import { Component, OnInit } from "@angular/core";
import { UserService } from "../shared/services/user.service";
import { User } from "../shared/models/user.model";
import { RouterExtensions } from "nativescript-angular/router";
import { FormBuilder, Validators } from '@angular/forms'

@Component({
    selector: "Login",
    templateUrl: "./login.component.html",
    styleUrls: ["./login.component.scss"]
})
export class LoginComponent implements OnInit {
    isLoggingIn = true;
    user: User = new User;

    userForm = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: [''],
    });

    constructor(private userService: UserService,
        private routerExtensions: RouterExtensions,
        private fb: FormBuilder) { }

    ngOnInit(): void {
    }

    toggleForm() {
        this.isLoggingIn = !this.isLoggingIn;
        if (!this.isLoggingIn) {
            this.userForm.get('confirmPassword').setValidators([Validators.required, Validators.minLength(6)])
        } else {
            this.userForm.get('confirmPassword').clearValidators();
        }
    }

    submit() {
        if (this.isLoggingIn) {
            this.user.email = this.userForm.get('email').value
            this.user.password = this.userForm.get('password').value
            this.userService.login(this.user).then(() => {
                this.routerExtensions.navigate(["/home"],
                    {
                        animated: true,
                        transition: {
                            name: "fade",
                        }
                    });
            });
        } else {
            this.user.email = this.userForm.get('email').value
            this.user.password = this.userForm.get('password').value
            if (this.userForm.get('password').value === this.userForm.get('confirmPassword').value) {
                this.userService.register(this.user).then(() => {
                    this.toggleForm()
                })
            } else {
                alert('Adgangskoden og den bekræftede adgangskode skal være ens')
            }
        }
    }
    forgotPassword() {
        // this.userService.resetPassword();
    }
}
