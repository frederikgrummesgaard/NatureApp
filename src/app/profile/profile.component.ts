import { Component, OnInit } from "@angular/core";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import * as app from "tns-core-modules/application";
import { isIOS } from "tns-core-modules/platform";
import { RouterExtensions } from "nativescript-angular/router";
import { UserService } from "../shared/services/user.service";
import { FormBuilder, Validators } from "@angular/forms";
import * as firebase from "nativescript-plugin-firebase";
import { Toasty } from "nativescript-toasty";
import * as purchase from "nativescript-purchase";

@Component({
    selector: "Profile",
    templateUrl: "./profile.component.html",
    styleUrls: ["./profile.component.scss"]
})
export class ProfileComponent implements OnInit {

    isAdmin: boolean;


    constructor(private routerExtensions: RouterExtensions,
        private fb: FormBuilder,
        private userService: UserService) {
        if (this.userService.user.isAdmin) {
            this.isAdmin = true;
        } else {
            this.isAdmin = false;
        }
    }

    adminForm = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
    })

    userForm = this.fb.group({
        name: [this.userService.user.name, [Validators.required]],
        email: [this.userService.user.email, [Validators.required, Validators.email]],
    })


    ngOnInit(): void {
    }

    makeAdmin() {
        this.userService.createAdmin(this.adminForm.get('email').value);
        this.routerExtensions.navigate(["/home"], {
            animated: true,
            transition: {
                name: "slide",
                duration: 200,
                curve: "ease"
            }
        });
    }

    logout() {
        this.routerExtensions.navigate(["/login"], {
            transition: {
                name: "fade"
            }
        });
        this.userService.logout();
    }

    onSaveButtonTap(): void {
        const toast = new Toasty({ text: 'Gemmer...' });
        toast.show();
        this.userService.user.name = this.userForm.get('name').value;
        this.userService.user.email = this.userForm.get('email').value;
        firebase.firestore.collection('users').doc(this.userService.user.id).update({
            name: this.userForm.get('name').value,
            email: this.userForm.get('email').value
        }).then(() => {
            firebase.updateEmail(this.userForm.get('email').value).then(() => {
                console.log('user updated');
            });
        });
        this.routerExtensions.navigate(["/home"], {
            animated: true,
            transition: {
                name: "slide",
                duration: 200,
                curve: "ease"
            }
        });
    }

    onDrawerButtonTap(): void {
        const sideDrawer = <RadSideDrawer>app.getRootView();
        sideDrawer.showDrawer();
    }
}
