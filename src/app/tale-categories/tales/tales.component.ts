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

@Component({
    selector: "Tales",
    templateUrl: "./tales.component.html",
    styleUrls: ["./tales.component.scss"]

})
export class TalesComponent implements OnInit {
    public isLoading: boolean = false;
    public isAdmin: boolean = false
    public tale: Tale;
    public tales: ObservableArray<Tale> = new ObservableArray<Tale>([]);
    public taleCategoryId: string;
    public taleCategory: TaleCategory;

    constructor(private userService: UserService,
        private taleService: TaleService,
        private pageRoute: PageRoute,
        private routerExtensions: RouterExtensions) {
        if (this.userService.user.isAdmin) {
            this.isAdmin = true;
        }
    }

    ngOnInit(): void {
        this.pageRoute.activatedRoute
            .pipe(switchMap((activatedRoute) => activatedRoute.params))
            .forEach((params) => {
                this.taleCategoryId = params.id;
                this.taleService.getTaleCategory(this.taleCategoryId).then(
                    (taleCategory: TaleCategory) => {
                        this.taleCategory = taleCategory;
                    });
                this.loadTales(this.taleCategoryId);
            });

    }

    loadTales(categoryId: string) {
        this.isLoading = true;
        this.taleService.getTales(categoryId).then(taleDB => {
            const myList = <any>taleDB;
            myList.forEach((tale: Tale) => {
                this.tales.push(tale);
            });
            this.isLoading = false;
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
    onCreateTale() {
        if (this.isAdmin) {
            this.routerExtensions.navigate(["/tale-categories/tales/" + this.taleCategoryId
                + "/tale-crud"],
                {
                    animated: true,
                    transition: {
                        name: "slide",
                        duration: 200,
                        curve: "ease"
                    }
                });
        }
    }

    onBackButtonTap(): void {
        this.routerExtensions.backToPreviousPage();
    }
}
