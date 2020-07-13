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
import * as purchase from "nativescript-purchase";


@Component({
    selector: "naturappen",
    templateUrl: "app.component.html",
    styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {
    private _activatedUrl: string;
    private _sideDrawerTransition: DrawerTransitionBase;
    public user: User;
    public isAdmin: boolean;
    public isSubscriber: boolean;

    constructor(private router: Router, private routerExtensions: RouterExtensions,
        private userService: UserService,) {
    }

    ngOnInit(): void {
        firebase.init({
            storageBucket: 'gs://naturappen-b056a.appspot.com/',
            persist: true,
            onAuthStateChanged: (data: any) => {
                if (data.loggedIn) {
                    this.getUser();
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
                this.getUser();
                console.log(`firebase.init error: ${error}`);
            }
        );

        this._activatedUrl = "/home";
        this._sideDrawerTransition = new SlideInOnTopTransition();

        this.router.events
            .pipe(filter((event: any) => event instanceof NavigationEnd))
            .subscribe((event: NavigationEnd) => this._activatedUrl = event.urlAfterRedirects);

        (global as any).purchaseInitPromise = purchase.init([
            "sub3month",
            "sub12month",
        ]);
    }

    private getUser() {
        this.isAdmin = false;
        this.isSubscriber = false;
        firebase.getCurrentUser().then((user) => {
            if (user) {
                user.getIdTokenResult().then((idTokenResult) => {
                    if (idTokenResult.claims.admin) {
                        this.isAdmin = true;
                        this.isSubscriber = true;
                    }
                    if (idTokenResult.claims.subscriber) {
                        this.isSubscriber = true;
                    }
                });
                //Retrieves the name of the user and creates a user object
                firebase.firestore.collection('users').doc(user.uid).get().then((dbUser) => {
                    this.user = {
                        id: user.uid,
                        name: dbUser.data().name,
                        email: dbUser.data().email,
                        password: dbUser.data().password,
                        isAdmin: this.isAdmin,
                        subscriptionEnds: dbUser.data().subscriptionEnds ? dbUser.data().subscriptionEnds : null
                    };
                    this.userService.user = this.user;
                });
                UserService.userToken = user.uid;
            }
        });

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

        const sideDrawer = <RadSideDrawer><unknown>app.getRootView();
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
