import { Injectable, NgZone, resolveForwardRef } from "@angular/core";
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

    adventureLists;

    constructor(private _ngZone: NgZone) {
        this.adventureLists = firebase.firestore.collection('adventurelists');
    }
    getAdventureList(id: any) {
        return new Promise((resolve, reject) => {
            this.adventureLists.doc(id).get()
                .then((adventureList) => {
                    resolve(adventureList.data());
                })
                .catch(err => {
                    console.log(err);
                    reject(err);
                });
        });
    }
    getAdventureLists() {
        return new Promise((resolve, reject) => {
            this.adventureLists.get()
                .then(querySnapshot => {
                    const list = [];
                    querySnapshot.forEach(document => {
                        let dataToSave = document.data();
                        dataToSave.id = document.id;
                        list.push(dataToSave);
                    });
                    console.log('list', list);
                    resolve(list);
                })
                .catch(err => {
                    console.log(err);
                    reject(err);
                })
        })
    }
}