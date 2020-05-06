import { Component, OnInit } from "@angular/core";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import * as app from "tns-core-modules/application";
import { Tale } from "~/app/shared/models/tale.model";
import { TaleService } from "~/app/shared/services/tale.service";
import { UserService } from "~/app/shared/services/user.service";
import { switchMap } from "rxjs/operators";
import { PageRoute, RouterExtensions } from "nativescript-angular/router";
import { TaleCategory } from "~/app/shared/models/taleCategory";
import { ObservableArray } from "tns-core-modules/data/observable-array/observable-array";
import { ListViewEventData } from "nativescript-ui-listview";
import { Router } from "@angular/router";

@Component({
    selector: "Tale",
    templateUrl: "./tale.component.html",
    styleUrls: ["./tale.component.scss"]

})
export class TaleComponent implements OnInit {
    public isLoading: boolean = false;
    public isAdmin: boolean = false
    public tale: Tale;
    public taleId: string;
    public taleCategoryId: string;

    constructor(private userService: UserService,
        private taleService: TaleService,
        private pageRoute: PageRoute,
        private routerExtensions: RouterExtensions,
        private router: Router, ) {
        if (this.userService.user.isAdmin) {
            this.isAdmin = true;
        }
    }

    ngOnInit(): void {
        let urlArray = this.router.url.split('/')
        this.taleCategoryId = urlArray[3];
        this.pageRoute.activatedRoute
            .pipe(switchMap((activatedRoute) => activatedRoute.params))
            .forEach((params) => {
                this.taleId = params.id;
                this.taleService.getTale(this.taleCategoryId, this.taleId).then(
                    (tale: Tale) => {
                        this.tale = tale;
                    });
            });

    }

    onTaleItemTap(args: ListViewEventData): void {
        const tappedAdventureItem = args.view.bindingContext;

        this.routerExtensions.navigate(["/tale-categories/tales/" + this.taleCategoryId + '/tale', tappedAdventureItem.id],
            {
                animated: true,
                transition: {
                    name: "slide",
                    duration: 200,
                    curve: "ease"
                }
            });
    }
    onBackButtonTap(): void {
        this.routerExtensions.backToPreviousPage();
    }
}
