import { Component, OnInit } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { RouterExtensions } from "nativescript-angular/router";
import { DrawerTransitionBase, RadSideDrawer, SlideInOnTopTransition } from "nativescript-ui-sidedrawer";
import { filter } from "rxjs/operators";
import * as app from "tns-core-modules/application";
import * as firebase from "nativescript-plugin-firebase";
import { UserService } from "./shared/services/user.service";
import { User } from "./shared/models/user.model";
import * as utils from "tns-core-modules/utils/utils";
import { registerElement } from "nativescript-angular/element-registry";
import { ExtendedShowModalOptions, ModalStack, overrideModalViewMethod } from "nativescript-windowed-modal"
overrideModalViewMethod();
registerElement("ModalStack", () => ModalStack);

@Component({
    selector: "naturappen",
    templateUrl: "app.component.html",
    styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {
    private _activatedUrl: string;
    private _sideDrawerTransition: DrawerTransitionBase;
    public user: User;

    constructor(private router: Router, private routerExtensions: RouterExtensions,
        private userService: UserService, ) {
    }

    ngOnInit(): void {
        firebase.init({
            storageBucket: 'gs://naturappen-b056a.appspot.com/',
            persist: true,
            onAuthStateChanged: (data: any) => {
                if (data.loggedIn) {

                    //Checks whether or not the user is an admin
                    let isAdmin = false;
                    firebase.getCurrentUser().then((user) => {
                        user.getIdTokenResult().then((idTokenResult) => {
                            if (idTokenResult.claims.admin) {
                                isAdmin = true;
                            }
                        })
                    })

                    //Retrieves the name of the user and creates a user object
                    let name;
                    firebase.firestore.collection('users').doc(data.user.uid).get().then((user) => {
                        name = user.data().name;

                        this.user = {
                            id: data.user.uid,
                            name: name,
                            email: data.user.email,
                            password: data.user.password,
                            isAdmin: isAdmin
                        }
                        this.userService.user = this.user

                    })
                    UserService.userToken = data.user.uid;
                }
                else {
                    UserService.userToken = "";
                }
            }
        }).then(
            () => {
                console.log("firebase.init done");
            },
            error => {
                console.log(`firebase.init error: ${error}`);
            }
        );

        this._activatedUrl = "/home";
        this._sideDrawerTransition = new SlideInOnTopTransition();

        this.router.events
            .pipe(filter((event: any) => event instanceof NavigationEnd))
            .subscribe((event: NavigationEnd) => this._activatedUrl = event.urlAfterRedirects);
    }

    get sideDrawerTransition(): DrawerTransitionBase {
        return this._sideDrawerTransition;
    }

    isComponentSelected(url: string): boolean {
        return this._activatedUrl === url;
    }

    onNavItemTap(navItemRoute: string): void {
        this.routerExtensions.navigate([navItemRoute], {
            transition: {
                name: "fade"
            }
        });

        const sideDrawer = <RadSideDrawer>app.getRootView();
        sideDrawer.closeDrawer();
    }
    onFacebookTap() {
        utils.openUrl("https://www.facebook.com/naturappen");
    }
    onInstagramTap() {
        utils.openUrl("https://instagram.com/naturappen?igshid=1mgq3s3dkczhx");
    }
    onWebsiteTap() {
        utils.openUrl("https://www.naturappen.dk/");
    }
}
