import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "nativescript-angular/common";
import { ReactiveFormsModule } from '@angular/forms';
import { NativeScriptFormsModule } from 'nativescript-angular/forms'
import { LoginRoutingModule } from "./login-routing.module";
import { LoginComponent } from "./login.component";
import { ModalDialogService } from "nativescript-angular/modal-dialog";
import { ForgotPasswordModalComponent } from "./forgot-password-modal/forgot-password-modal.component";

@NgModule({
    imports: [
        NativeScriptCommonModule,
        LoginRoutingModule,
        ReactiveFormsModule,
        NativeScriptFormsModule
    ],
    declarations: [
        LoginComponent,
        ForgotPasswordModalComponent
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ],
    entryComponents: [ForgotPasswordModalComponent],
    providers: [
        ModalDialogService
    ]
})
export class LoginModule { }
