import { Injectable } from "@angular/core";
import * as firebase from "nativescript-plugin-firebase";
import { AdventureList } from "../models/adventureList.model";
import { AdventureEntry } from "../models/adventureEntry.model";
import { UserService } from "./user.service";
import { ObservableArray } from "tns-core-modules/data/observable-array/observable-array";

@Injectable({
    providedIn: "root"
})
export class AdventureListService {

    adventureLists; //Field to the database
    users;
    adventureList: AdventureList;

    constructor(private userService: UserService) {
        this.adventureLists = firebase.firestore.collection('adventurelists');
        this.users = firebase.firestore.collection('users');
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

    public changeAdventureListDiscoveredState(listId, content: Object): void {
        this.users.doc(this.userService.user.id).collection('adventure-lists').doc(listId).set(content);
    }

    updateAdventureList(id: string, content) {
        this.adventureLists.doc(id).update(content);
    }

    deleteAdventureList(id: string) {
        this.adventureLists.doc(id).delete();
        this.users.get().then((users) => {
            users.forEach(user => {
                this.users.doc(user.id).collection('adventure-lists').doc(id).delete();
            });
        })
    }


    getAdventureListEntry(entryId: any) {
        return new Promise((resolve, reject) => {
            this.adventureLists.doc(this.adventureList.id).collection('entries').doc(entryId).get()
                .then((adventureEntry: any) => {
                    this.users.doc(this.userService.user.id).collection('adventure-lists').doc(this.adventureList.id)
                        .collection('adventure-entries').doc(adventureEntry.id).get()
                        .then((entry) => {
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
        let entyLength = 0;
        let entriesToSend: ObservableArray<AdventureEntry> = new ObservableArray();
        return new Promise(async (resolve, reject) => {
            this.adventureLists.doc(id).collection('entries').get()
                .then(async (entries) => {
                    entyLength = entries.length;
                    entries.forEach(async entry => {
                        let dataToSave: AdventureEntry = entry.data();
                        dataToSave.id = entry.id;

                        this.users.doc(this.userService.user.id).collection('adventure-lists').doc(id).collection('adventure-entries')
                            .doc(entry.id).get().then(async (data) => {
                                if (data.exists) {
                                    console.log("");
                                    dataToSave.isDiscovered = data.data().isDiscovered;
                                    entriesToSend.push(dataToSave);
                                }
                                console.log('discoveredState', dataToSave.isDiscovered);
                            })
                    });
                }).then(() => {
                    setTimeout(() => {
                        resolve(entriesToSend)
                    }, 1000);
                })
                .catch(err => {
                    console.log(err);
                    reject(err);
                });
        });
    }

    public createListDiscoveredState(ListId): void {
        this.users.get().then((users) => {
            users.forEach(user => {
                this.users.doc(user.id).collection('adventure-lists').doc(ListId).set({
                    isCompleted: false,
                });
            });
        })
    }

    /**
     * This method changes the state of the isDiscovered field in firestore
     */
    public changeEntryDiscoveredState(listId, entryId: string, content: Object): void {
        this.users.doc(this.userService.user.id).collection('adventure-lists').doc(listId)
            .collection('adventure-entries').doc(entryId).set(content);
    }

    public clearEntryDiscoveredState(listId): void {
        this.users.doc(this.userService.user.id).collection('adventure-lists').doc(listId)
            .collection('adventure-entries').get().then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    doc.ref.update({
                        isDiscovered: false,
                    });
                });
            });
    }

    public deleteEntry(listId: string, entryId: string) {
        this.adventureLists.doc(listId).collection('entries').doc(entryId).delete();
        this.users.get().then((users) => {
            users.forEach(user => {
                this.users.doc(user.id).collection('adventure-lists').doc(listId)
                    .collection('adventure-entries').doc(entryId).delete();
            });
        })
    }

}