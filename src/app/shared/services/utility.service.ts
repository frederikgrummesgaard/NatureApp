import { Injectable } from "@angular/core";
import * as firebase from "nativescript-plugin-firebase";
import * as fs from "tns-core-modules/file-system";

@Injectable({
    providedIn: "root"
})
export class UtilityService {

    constructor() {
    }

    public uploadAudioFile(localPath: string): Promise<any> {
        let filename = this.getFilename(localPath);
        let remotePath = '/audio/' + `${filename}`;
        let metadata = {
            contentType: "audio/mpeg"
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

    public uploadImageFile(localPath: string): Promise<any> {
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