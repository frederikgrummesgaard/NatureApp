import { Component, OnInit } from "@angular/core";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import * as app from "tns-core-modules/application";
import { UserService } from "../shared/services/user.service";
import { TaleService } from "../shared/services/tale.service";
import { TaleCategory } from "../shared/models/taleCategory";
import { ListViewEventData } from "nativescript-ui-listview";
import { RouterExtensions } from "nativescript-angular/router";
import { ObservableArray } from "tns-core-modules/data/observable-array/observable-array";

@Component({
    selector: "TaleCategories",
    templateUrl: "./tale-categories.component.html",
    styleUrls: ["./tale-categories.component.scss"]

})
export class TaleCategoriesComponent implements OnInit {
    public isLoading: boolean = false;
    public isAdmin: boolean = false;
    private _taleCategorys: ObservableArray<TaleCategory> = new ObservableArray<TaleCategory>([]);

    constructor(private routerExtensions: RouterExtensions,
        private userService: UserService,
        private taleService: TaleService) {
        if (this.userService.user.isAdmin) {
            this.isAdmin = true;
        }
    }

    ngOnInit(): void {
        this.loadTaleCategories();
    }

    loadTaleCategories() {
        this.isLoading = true;
        this.taleService.getTaleCategories().then(taleCategoriesDB => {
            const myList = <any>taleCategoriesDB;
            myList.forEach((taleCategory: TaleCategory) => {
                console.log(taleCategory)
                this._taleCategorys.push(taleCategory);
            });
            this.isLoading = false;
        });
    }


    onCategoryItemTap(args: ListViewEventData): void {
        const tappedAdventureItem = args.view.bindingContext;

        this.routerExtensions.navigate(["/tale-categories/tales", tappedAdventureItem.id],
            {
                animated: true,
                transition: {
                    name: "slide",
                    duration: 200,
                    curve: "ease"
                }
            });
    }

    onCreateButtonTap(): void {

    }

    onDrawerButtonTap(): void {
        const sideDrawer = <RadSideDrawer>app.getRootView();
        sideDrawer.showDrawer();
    }
    get taleCategories(): ObservableArray<TaleCategory> {
        return this._taleCategorys;
    }
}
