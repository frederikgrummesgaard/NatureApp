import { Component, OnInit, ChangeDetectorRef, OnDestroy, NgZone } from "@angular/core";
import { Tale } from "~/app/shared/models/tale.model";
import { TaleService } from "~/app/shared/services/tale.service";
import { UserService } from "~/app/shared/services/user.service";
import { switchMap } from "rxjs/operators";
import * as timer from '@nativescript/core/timer';
import { PageRoute, RouterExtensions } from "nativescript-angular/router";
import { Router } from "@angular/router";
import { TNSPlayer } from 'nativescript-audio';
import { Slider } from "tns-core-modules/ui/slider/slider";
import { DatePipe } from '@angular/common';
import { app } from "firebase-admin";
import { isAndroid } from "tns-core-modules/platform/platform";
import { Toasty, ToastDuration } from "nativescript-toasty";

@Component({
    selector: "Tale",
    templateUrl: "./tale.component.html",
    styleUrls: ["./tale.component.scss"]

})
export class TaleComponent implements OnInit, OnDestroy {
    public isLoading: boolean = false;
    public isAdmin: boolean;
    public tale: Tale;
    public taleId: string;
    public taleCategoryId: string;
    public isPlaying: boolean;
    private _player: TNSPlayer;
    public currentTime: number;
    public duration: number = 0;
    public displayTime: string;
    public remainingTime: string;

    constructor(private userService: UserService,
        private datePipe: DatePipe,
        private taleService: TaleService,
        private pageRoute: PageRoute,
        private ngZone: NgZone,
        private routerExtensions: RouterExtensions,
        private router: Router,
    ) {
        this._player = new TNSPlayer();
        if (this.userService.user) {
            this.userService.user.isAdmin ? this.isAdmin = true : this.isAdmin = false;
        } else {
            this.isAdmin = false;
        }
    }

    ngOnInit(): void {
        this.ngZone.run(() => {
            const toast = new Toasty({ text: 'Henter lydfil...', duration: ToastDuration.LONG });
            toast.show();
            this.isLoading = true;
            let urlArray = this.router.url.split('/')
            this.taleCategoryId = urlArray[3];
            this.pageRoute.activatedRoute
                .pipe(switchMap((activatedRoute) => activatedRoute.params))
                .forEach((params) => {
                    this.taleId = params.id;
                    this.taleService.getTale(this.taleCategoryId, this.taleId).then(
                        (tale: Tale) => {
                            this.tale = tale;
                            this._player.initFromUrl({
                                audioFile: this.tale.audioURL,
                                loop: false,
                                completeCallback: this._trackComplete.bind(this),
                                errorCallback: this._trackError.bind(this)
                            }).then(() => {
                                this._player.getAudioTrackDuration().then((result) => {
                                    this.duration = Math.floor(Number(result));
                                    this.displayTime = '0:00';
                                    this.remainingTime = this.secondsToMinuteAndSenconds(this.duration);
                                    this.isLoading = false;
                                }).catch((err) => console.log(err));
                            })
                        });
                });
        })
    }

    public ngOnDestroy(): void {
        this._player.dispose();
    }

    public togglePlay() {
        this.ngZone.run(() => {
            if (this._player.isAudioPlaying()) {
                this._player.pause();
                this.isPlaying = false;
            } else {
                this._player.play().then(() => {
                    this.isPlaying = true;
                    timer.setInterval(() => {
                        this.currentTime = this._player.currentTime;
                        this.remainingTime = this.secondsToMinuteAndSenconds(this.duration - this.currentTime);
                        this.displayTime = this.secondsToMinuteAndSenconds(this.currentTime);
                        if (this.remainingTime === '0:00') {
                            this._player.pause();
                            this.isPlaying = false;
                            this._player.seekTo(0);
                        }
                    }, 1000);
                }).catch((err) => { console.log(err) });
            }
        })
    }

    onCurrentTimeChanged(args): void {
        const slider = <Slider>args.object;
        if (!isNaN(slider.value)) {
            this.seek(Math.floor(slider.value));
        }
    }

    seek(moment: number): void {
        if (isAndroid) {
            moment = moment / 1000
        }
        this._player.seekTo(moment);
    }

    isSliderValueChanged(val: number): boolean {
        return Math.round(val) !== Math.round(this.currentTime);
    }

    private _trackComplete(args: any) {
        console.log('reference back to player:', args.player);
        // iOS only: flag indicating if completed succesfully
        console.log('whether audiofile play completed successfully:', args.flag);
    }

    private _trackError(args: any) {
        console.log('reference back to player:', args.player);
        console.log('the error:', args.error);
        // Android only: extra detail on error
        console.log('extra info on the error:', args.extra);
    }

    onBackButtonTap(): void {
        this._player.dispose();
        this.routerExtensions.backToPreviousPage();
    }

    onEditButtonTap() {
        if (this.isAdmin) {
            this.routerExtensions.navigate(["/tale-categories/tales/" + this.taleCategoryId
                + "/tale-crud", this.taleId],
                {
                    animated: true,
                    transition: {
                        name: "slide",
                        duration: 200,
                        curve: "ease"
                    }
                });
        }
    }

    secondsToMinuteAndSenconds(sec) {
        if (isAndroid) {
            sec = sec / 1000
        }
        sec = Number(sec);
        var m = Math.floor(sec % 3600 / 60);
        var s = Math.floor(sec % 3600 % 60);

        var mDisplay = m > 0 ? m : "0";
        var sDisplay = s > 0 ? (s.toString().length === 1 ? "0" + s : s) : "00";
        return mDisplay + ":" + sDisplay;
    }
}
