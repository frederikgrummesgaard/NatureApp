import { Injectable, NgZone, resolveForwardRef } from "@angular/core";
import * as firebase from "nativescript-plugin-firebase";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";

import { AdventureList } from "../models/adventureList.model";
import { AdventureEntry } from "../models/adventureEntry.model";

@Injectable({
    providedIn: "root"
})
export class AdventureListService {

    adventureLists; //Field to the database
    adventureList: AdventureList;

    constructor(private _ngZone: NgZone) {
        this.adventureLists = firebase.firestore.collection('adventurelists');
    }
    getAdventureList(id: any) {
        return new Promise((resolve, reject) => {
            this.adventureLists.doc(id).get()
                .then((adventureList) => {
                    this.adventureList = adventureList;
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
                    const adventureLists = [];
                    querySnapshot.forEach(adventureList => {
                        let dataToSave = adventureList.data();
                        dataToSave.id = adventureList.id;
                        adventureLists.push(dataToSave);
                    });
                    resolve(adventureLists);
                })
                .catch(err => {
                    console.log(err);
                    reject(err);
                })
        })
    }

    updateAdventureList(content) {
        this.adventureLists.doc(this.adventureList.id).update(content);
    }

    getAdventureListEntry(entryId: any) {
        return new Promise((resolve, reject) => {
            this.adventureLists.doc(this.adventureList.id).collection('entries').doc(entryId).get()
                .then((adventureEntry: any) => {
                    resolve(adventureEntry.data());
                })
                .catch(err => {
                    console.log(err);
                    reject(err);
                });

        });
    }

    getAdventureListEntries(id: any) {
        return new Promise((resolve, reject) => {
            this.adventureLists.doc(id).collection('entries').get()
                .then((entries) => {
                    let entriesToSend: AdventureEntry[] = [];
                    entries.forEach(entry => {
                        let dataToSave = entry.data();
                        dataToSave.id = entry.id;
                        entriesToSend.push(dataToSave);
                    });
                    resolve(entriesToSend);
                })
                .catch(err => {
                    console.log(err);
                    reject(err);
                });

        });
    }

    updateAdventureListEntry(entryId, content) {
        this.adventureLists.doc(this.adventureList.id).collection('entries').doc(entryId)
            .update(content);
    }

}