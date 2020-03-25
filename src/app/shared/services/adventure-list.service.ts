import { Injectable, NgZone } from "@angular/core";
import * as firebase from "nativescript-plugin-firebase";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";

import { AdventureList } from "../models/adventureList.model";

const editableProperties = [
    "name",
    "description",
    "pictureUrl",
    "adventureEntries",
    "isCompleted"
];

@Injectable({
    providedIn: "root"
})
export class AdventureListService {

    private _adventureLists: Array<AdventureList> = [];

    constructor(private _ngZone: NgZone) {
    }

    private static cloneUpdateModel(adventureList: AdventureList): object {
        return editableProperties.reduce((a, e) => (a[e] = adventureList[e], a), {}); // tslint:disable-line:ban-comma-operator
    }

    getAdventureListById(id: number): AdventureList {
        if (!id) {
            return;
        }

        return this._adventureLists.filter((adventureList) => {
            return adventureList.id === id;
        })[0];
    }

    load(): Observable<any> {
        return new Observable((observer: any) => {
            const path = "adventurelists";

            const onValueEvent = (snapshot: any) => {
                this._ngZone.run(() => {
                    const results = this.handleSnapshot(snapshot.value);
                    observer.next(results);
                });
            };
            firebase.addValueEventListener(onValueEvent, `/${path}`);
        }).pipe(catchError(this.handleErrors));
    }

    update(adventureListModel: AdventureList): Promise<any> {
        const updateModel = AdventureListService.cloneUpdateModel(adventureListModel);

        return firebase.update("/adventurelists/" + adventureListModel.id, updateModel);
    }

    uploadImage(remoteFullPath: string, localFullPath: string): Promise<any> {
        return firebase.storage.uploadFile({
            localFullPath,
            remoteFullPath,
            onProgress: null
        });
    }

    private handleSnapshot(data: any): Array<AdventureList> {
        this._adventureLists = [];

        if (data) {
            for (const id in data) {
                if (data.hasOwnProperty(id)) {
                    this._adventureLists.push(new AdventureList);
                }
            }
        }

        return this._adventureLists;
    }

    private handleErrors(error: Response): Observable<never> {
        return throwError(error);
    }
}