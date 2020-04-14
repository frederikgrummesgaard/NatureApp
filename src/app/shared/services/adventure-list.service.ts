import { Injectable, NgZone, OnInit } from "@angular/core";
import * as firebase from "nativescript-plugin-firebase";

import { AdventureList } from "../models/adventureList.model";
import { AdventureEntry } from "../models/adventureEntry.model";
import { UserService } from "./user.service";

@Injectable({
    providedIn: "root"
})
export class AdventureListService implements OnInit {

    adventureLists; //Field to the database
    userData;
    adventureList: AdventureList;

    constructor(private _ngZone: NgZone,
        private userService: UserService) {
        this.adventureLists = firebase.firestore.collection('adventurelists');
        this.userData = firebase.firestore.collection('users').doc(this.userService.user.id).collection('adventurelist-entries');
    }
    ngOnInit(): void {
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
                    this.userData.doc(adventureEntry.id).get().then((entry) => {
                        adventureEntry.data().isDiscovered = entry.data().isDiscovered;
                    })
                    resolve(adventureEntry.data());
                })
                .catch(err => {
                    console.log(err);
                    reject(err);
                });
        });

    }

    getAdventureListEntries(id: any) {
        let entriesToSend: AdventureEntry[] = [];
        return new Promise((resolve, reject) => {
            this.adventureLists.doc(id).collection('entries').get()
                .then((entries) => {
                    entries.forEach(entry => {
                        let dataToSave: AdventureEntry = entry.data();
                        dataToSave.id = entry.id;
                        this.userData.doc(dataToSave.id).get().then((entry) => {
                            dataToSave.isDiscovered = entry.data().isDiscovered;
                        })
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
        this.userData.doc(entryId).update(content);
    }

}