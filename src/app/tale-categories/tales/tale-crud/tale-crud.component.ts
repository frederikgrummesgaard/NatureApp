import { Component, OnInit, NgZone } from "@angular/core";
import { RouterExtensions, PageRoute } from "nativescript-angular/router";
import { FormBuilder, Validators } from "@angular/forms";
import * as imagepicker from "nativescript-imagepicker";
import * as app from 'tns-core-modules/application';
import { Mediafilepicker, AudioPickerOptions } from 'nativescript-mediafilepicker';
import * as firebase from "nativescript-plugin-firebase";
import * as enums from 'tns-core-modules/ui/enums';
import { ImageSource } from "tns-core-modules/image-source/image-source";

import { switchMap } from "rxjs/operators";
import { Tale } from "~/app/shared/models/tale.model";
import { TaleService } from "~/app/shared/services/tale.service";
import { Router } from "@angular/router";
import { UtilityService } from "~/app/shared/services/utility.service";

@Component({
    selector: "TaleCrud",
    templateUrl: "./tale-crud.component.html",
    styleUrls: ["./tale-crud.component.scss"]
})
export class TaleCrudComponent implements OnInit {

    public tale: Tale = new Tale;
    public taleCategoryId: string;
    public taleId: string;
    public image: any;
    public imagePath: string;
    public audioFileName: string;
    public audioFile: any;
    public isAudioFile: boolean;
    public isEditing: boolean = false;
    public isSavePressed: boolean = false;
    public title: string = 'Opret fortælling';
    public urlArray: string[];

    constructor(private pageRoute: PageRoute,
        private router: Router,
        private routerExtensions: RouterExtensions,
        private taleService: TaleService,
        private utilityService: UtilityService,
        private ngZone: NgZone,
        private fb: FormBuilder) {
    }

    public taleForm = this.fb.group({
        name: ['', [Validators.required]],
        description: ['', [Validators.required]]
    })

    ngOnInit(): void {
        this.urlArray = this.router.url.split('/');
        this.taleCategoryId = this.urlArray[3];
        //Gets the selected tale
        if (this.urlArray.length === 6) {
            this.pageRoute.activatedRoute
                .pipe(switchMap((activatedRoute) => activatedRoute.params))
                .forEach((params) => {
                    if (params.id) {
                        this.isEditing = true;
                        this.title = 'Rediger fortælling';
                        this.taleId = params.id;
                        this.taleService.getTale(this.taleCategoryId, this.taleId).then(
                            (tale: Tale) => {
                                this.tale = tale;
                                this.taleForm.get('name').setValue(this.tale.name);
                                this.taleForm.get('description').setValue(this.tale.description);
                                this.image = this.tale.pictureURL;
                                this.audioFile = this.tale.audioURL;
                                this.isAudioFile = true;
                                let array = this.tale.audioURL.split('%');
                                array = array[1].split('?');
                                this.audioFileName = array[0].substring(2, array[0].length)
                            });
                    }
                })
        }
    }

    public onBackButtonTap(): void {
        this.routerExtensions.backToPreviousPage();

    }
    public addOrRemoveAudioFile() {
        let options: AudioPickerOptions = {
            android: {
                isCaptureMood: false, // if true then voice recorder will open directly.
                isNeedRecorder: false,
                maxNumberFiles: 1,
                isNeedFolderList: true,
            },
            ios: {
                isCaptureMood: false, // if true then voice recorder will open directly.
                maxNumberFiles: 1,
            }
        };

        if (this.audioFile) {
            this.audioFile = null;
            this.isAudioFile = false;
            return;
        }

        let mediafilepicker = new Mediafilepicker();
        mediafilepicker.openAudioPicker(options);
        mediafilepicker.on("getFiles", (res) => {
            let results = res.object.get('results');
            this.audioFile = results[0].file;
            console.log(this.audioFile);
            let array: string[] = this.audioFile.split('/')
            this.audioFileName = array[array.length - 1];
            this.isAudioFile = true;
            console.log(this.audioFileName);
            if (this.audioFile && app.ios && !options.ios.isCaptureMood) {
                let fileName = "tmpFile.m4a";
                mediafilepicker.copyMPMediaFileToAPPDirectory(this.audioFile.rawData, fileName).then((res) => {
                    console.dir(res);
                }).catch((err) => {
                    console.dir(err);
                });
            }
            mediafilepicker.on("error", (res) => {
                let msg = res.object.get('msg');
                console.log(msg);
            });

            mediafilepicker.on("cancel", (res) => {
                let msg = res.object.get('msg');
                console.log(msg);
            });
        });
    }
    public addOrRemoveImage() {
        if (this.image) {
            this.image = null;
            return;
        }
        let context = imagepicker.create({
            mode: "single"
        });
        context.authorize()
            .then(() => {
                this.image = null;
                return context.present();
            })
            .then((imageAsset) => {
                ImageSource.fromAsset(imageAsset[0]).then(result => {
                    this.image = result;
                    this.saveImageFile(this.image);
                })
            })
            .catch((error) => {
                console.log(error);
            });
    }
    public saveImageFile(result) {
        let imageSrc = result;
        this.imagePath = this.utilityService.documentsPath(`${this.taleForm.get('name').value}.jpeg`);
        imageSrc.saveToFile(this.imagePath, enums.ImageFormat.jpeg, 15);
    }


    public onDeleteButtonTap() {
        //Extracts the filename from firebases access token
        let array = this.tale.pictureURL.split('%');
        array = array[1].split('?');
        let filename = array[0].substring(2, array[0].length)

        this.taleService.deleteTale(this.taleCategoryId, this.taleId);
        firebase.storage.deleteFile({
            remoteFullPath: '/images/' + filename,
        });
        firebase.storage.deleteFile({
            remoteFullPath: '/audio/' + this.audioFileName,
        });
        this.routerExtensions.navigate(["/tale-categories"],
            {
                animated: true,
                transition: {
                    name: "slide",
                    duration: 200,
                    curve: "ease"
                }
            });
    }

    public async onSaveButtonTap(): Promise<void> {
        this.isSavePressed = true;
        let imageUrl;
        let audioUrl;

        if (!this.tale.pictureURL || this.imagePath) {
            await this.utilityService.uploadImageFile(this.imagePath)
                .then(async (uploadedFile) => {
                    await this.utilityService.downloadUrl('/images/' + uploadedFile.name)
                        .then((downloadUrl: string) => {
                            imageUrl = downloadUrl;
                        });
                });
        }
        if (!this.tale.audioURL || this.audioFile) {
            await this.utilityService.uploadAudioFile(this.audioFile).then(async (uploadedFile) => {
                await this.utilityService.downloadUrl('/audio/' + uploadedFile.name)
                    .then((downloadUrl: string) => {
                        audioUrl = downloadUrl
                    });
            })
        }
        if (imageUrl && audioUrl) {
            console.log("hej1")
            this.createOrUpdateTale(imageUrl, audioUrl);
            this.onBackButtonTap();
        } else if (this.tale.pictureURL && this.tale.audioURL && !imageUrl && !audioUrl) {
            this.createOrUpdateTale(this.tale.pictureURL, this.tale.audioURL);
            this.onBackButtonTap();
        } else if (imageUrl && this.tale.audioURL) {
            console.log("hej2")
            this.createOrUpdateTale(imageUrl, this.tale.audioURL);
            this.onBackButtonTap();
        } else if (this.tale.pictureURL && audioUrl) {
            this.createOrUpdateTale(this.tale.pictureURL, audioUrl);
            this.onBackButtonTap();
        } else {
            this.isSavePressed = false;
            alert('Sikre at navn, billede, lydfil og beskrivelse er udfyldt korrekt')
        }
    }

    private createOrUpdateTale(imageUrl, audioUrl) {
        if (this.taleForm.valid) {
            if (!this.isEditing) {
                firebase.firestore.collection('tale-categories').doc(this.taleCategoryId)
                    .collection('tales').add({
                        name: this.taleForm.get('name').value,
                        description: this.taleForm.get('description').value,
                        pictureURL: imageUrl,
                        audioURL: audioUrl
                    })
            } else {
                firebase.firestore.collection('tale-categories').doc(this.taleCategoryId)
                    .collection('tales').doc(this.taleId).update({
                        name: this.taleForm.get('name').value,
                        description: this.taleForm.get('description').value,
                        pictureURL: imageUrl,
                        audioURL: audioUrl
                    });
            }
        }
    }
}
