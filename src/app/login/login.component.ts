import { Component, OnInit, ViewContainerRef } from "@angular/core";
import { UserService } from "../shared/services/user.service";
import { User } from "../shared/models/user.model";
import { RouterExtensions } from "nativescript-angular/router";
import { FormBuilder, Validators } from '@angular/forms'
import { ModalDialogService, ModalDialogOptions } from "nativescript-angular/common";
import { ForgotPasswordModalComponent } from "./forgot-password-modal/forgot-password-modal.component";
import { ExtendedShowModalOptions } from "nativescript-windowed-modal";
import { Page } from "tns-core-modules/ui/page";

@Component({
    selector: "Login",
    templateUrl: "./login.component.html",
    styleUrls: ["./login.component.scss"]
})
export class LoginComponent implements OnInit {
    isLoggingIn = true;
    user: User = new User;

    userForm = this.fb.group({
        name: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: [''],
    });

    constructor(private userService: UserService,
        private routerExtensions: RouterExtensions,
        private modalService: ModalDialogService,
        private viewContainerRef: ViewContainerRef,
        private fb: FormBuilder,
        private page: Page) {
        this.page.actionBarHidden = true;
    }

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
            this.user.email = this.userForm.get('email').value;
            this.user.password = this.userForm.get('password').value;
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
            this.user.name = this.userForm.get('name').value;
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
    openForgotPasswordModal() {
        const options: ModalDialogOptions = {
            context: "",
            viewContainerRef: this.viewContainerRef,
            closeCallback: (response: string) => console.log("Modal response: " + response),
            fullscreen: false,
            dimAmount: 0.3,
            stretched: true,
        } as ExtendedShowModalOptions;
        this.modalService.showModal(ForgotPasswordModalComponent, options);
    }
}
