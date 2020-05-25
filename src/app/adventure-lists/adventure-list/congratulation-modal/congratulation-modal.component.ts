import { Component, OnInit } from "@angular/core";
import { UserService } from "~/app/shared/services/user.service";
import { ModalDialogParams } from "nativescript-angular/common";
import { Validators, FormBuilder } from "@angular/forms";
import { AdventureListService } from "~/app/shared/services/adventure-list.service";
import { AdventureList } from "~/app/shared/models/adventureList.model";
import { RouterExtensions } from "nativescript-angular/router";

@Component({
    selector: "congratulation-modal",
    templateUrl: "./congratulation-modal.component.html",
    styleUrls: ["./congratulation-modal.component.scss"]

})
export class CongratulationModalComponent implements OnInit {

    public adventureListName: string;
    public picture;
    public adventureList: AdventureList;

    constructor(private adventureListService: AdventureListService,
        private routerExtensions: RouterExtensions,
        private params: ModalDialogParams) { }

    ngOnInit(): void {
        this.adventureList = this.params.context;
        this.adventureListName = this.adventureList.name;
    }

    clearAdventureListState() {
        this.adventureListService.changeAdventureListDiscoveredState(this.adventureList.id, { isCompleted: false })
        this.adventureListService.clearEntryDiscoveredState(this.adventureList.id);
        this.routerExtensions.backToPreviousPage();
        this.params.closeCallback();
    }
    close() {
        this.params.closeCallback();
    }
}
