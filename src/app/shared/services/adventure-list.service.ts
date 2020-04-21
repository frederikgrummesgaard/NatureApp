import { Injectable } from "@angular/core";
import * as firebase from "nativescript-plugin-firebase";
import * as fs from "tns-core-modules/file-system";
import { AdventureList } from "../models/adventureList.model";
import { AdventureEntry } from "../models/adventureEntry.model";
import { UserService } from "./user.service";

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

    updateAdventureList(content) {
        this.adventureLists.doc(this.adventureList.id).update(content);
    }

    getAdventureListEntry(entryId: any) {
        return new Promise((resolve, reject) => {
            this.adventureLists.doc(this.adventureList.id).collection('entries').doc(entryId).get()
                .then((adventureEntry: any) => {
                    this.users.doc(this.userService.user.id).collection('adventurelist-entries')
                        .doc(adventureEntry.id).get().then((entry) => {
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
                        this.users.doc(this.userService.user.id).collection('adventurelist-entries')
                            .doc(dataToSave.id).get().then((entry) => {
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
        this.users.doc(this.userService.user.id).collection('adventurelist-entries').doc(entryId).update(content);
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