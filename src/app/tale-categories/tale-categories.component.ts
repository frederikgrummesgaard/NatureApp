import { Component, OnInit } from "@angular/core";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import * as app from "tns-core-modules/application";
import { RouterExtensions } from "nativescript-angular/router";

@Component({
    selector: "TaleCategories",
    templateUrl: "./tale-categories.component.html",
    styleUrls: ["./tale-categories.component.scss"]

})
export class TaleCategoriesComponent implements OnInit {
    public isLoading: boolean = false;

    constructor(private routerExtensions: RouterExtensions, ) {
    }

    ngOnInit(): void {
    }

    onCategoryItemTap(id: string): void {

        this.routerExtensions.navigate(["/tale-categories/tales", id],
            {
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
