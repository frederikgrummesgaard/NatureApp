import { Component, OnInit } from "@angular/core";
import { UserService } from "~/app/shared/services/user.service";
import { ModalDialogParams } from "nativescript-angular/common";
import { Validators, FormBuilder } from "@angular/forms";

@Component({
    selector: "forgot-password-modal",
    templateUrl: "./forgot-password-modal.component.html",
    styleUrls: ["./forgot-password-modal.component.scss"]

})
export class ForgotPasswordModalComponent implements OnInit {

    emailForm = this.fb.group({
        email: ['', [Validators.required, Validators.email]]
    });

    constructor(private userService: UserService,
        private fb: FormBuilder,
        private params: ModalDialogParams) { }

    ngOnInit(): void {
    }

    send() {
        this.userService.resetPassword(this.emailForm.get('email').value);
        this.params.closeCallback();
    }
}
