import { Injectable } from "@angular/core";
import * as firebase from "nativescript-plugin-firebase";
import * as fs from "tns-core-modules/file-system";
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
        let entriesToSend: ObservableArray<AdventureEntry> = new ObservableArray();
        return new Promise((resolve, reject) => {
            this.adventureLists.doc(id).collection('entries').get()
                .then((entries) => {
                    entries.forEach(entry => {
                        let dataToSave: AdventureEntry = entry.data();
                        dataToSave.id = entry.id;

                        this.users.doc(this.userService.user.id).collection('adventure-lists').doc(id).collection('adventure-entries')
                            .doc(entry.id).get().then((data) => {
                                if (data.exists) {
                                    dataToSave.isDiscovered = data.data().isDiscovered;
                                }
                                entriesToSend.push(dataToSave);
                            })
                    });
                }).then(() => resolve(entriesToSend))
                .catch(err => {
                    console.log(err);
                    reject(err);
                });
        });
    }

    private getAdventureListEntriesState(adventureListId, entries) {
        entries.forEach(entry => {

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

    public deleteEntry(listId: string, entryId: string) {
        this.adventureLists.doc(listId).collection('entries').doc(entryId).delete();
        this.users.get().then((users) => {
            users.forEach(user => {
                this.users.doc(user.id).collection('adventure-lists').doc(listId)
                    .collection('adventure-entries').doc(entryId).delete();
            });
        })
    }

    public uploadFile(localPath: string): Promise<any> {
        let filename = this.getFilename(localPath);
        let remotePath = '/images/' + `${filename}`;
        let metadata = {
            contentType: "image/jpeg"
        };

        return firebase.storage.uploadFile({
            remoteFullPath: remotePath,
            localFullPath: localPath,
            onProgress: (status) => {
                console.log("Uploaded fraction: " + status.fractionCompleted);
                console.log("Percentage complete: " + status.percentageCompleted);
            },
            metadata
        });
    }

    public downloadUrl(remoteFilePath: string): Promise<any> {
        return firebase.storage.getDownloadUrl({
            remoteFullPath: remoteFilePath
        })
            .then((url: string) => {
                return url;
            }, (error) => {
                console.log(error);
            });
    }

    public documentsPath(filename: string) {
        return `${fs.knownFolders.documents().path}/${filename}`;
    }

    public getFilename(path: string) {
        let parts = path.split('/');
        return parts[parts.length - 1];
    }
}