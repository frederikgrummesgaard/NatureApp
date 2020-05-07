import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
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

@Component({
    selector: "Tale",
    templateUrl: "./tale.component.html",
    styleUrls: ["./tale.component.scss"]

})
export class TaleComponent implements OnInit {
    public isLoading: boolean = false;
    public isAdmin: boolean = false
    public tale: Tale;
    public taleId: string;
    public taleCategoryId: string;
    public isPlaying: boolean;
    private _player: TNSPlayer;
    public currentTime: number;
    public duration: number;
    public displayTime: string;
    public remainingTime: string;

    constructor(private userService: UserService,
        private datePipe: DatePipe,
        private taleService: TaleService,
        private pageRoute: PageRoute,
        private routerExtensions: RouterExtensions,
        private router: Router,
    ) {
        if (this.userService.user.isAdmin) {
            this.isAdmin = true;
        }
        this._player = new TNSPlayer();
    }

    ngOnInit(): void {
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
                                this.displayTime = '00:00';
                                this.remainingTime = this.datePipe.transform(this.duration, 'mm:ss');
                            })
                        })
                    });
            });
    }

    public togglePlay() {
        if (this._player.isAudioPlaying()) {
            this._player.pause();
            this.isPlaying = false;
        } else {
            this._player.play().then(() => {
                this.isPlaying = true;
                timer.setInterval(() => {
                    this.currentTime = this._player.currentTime
                    this.remainingTime = this.datePipe.transform((this.duration - this.currentTime), 'mm:ss');
                    this.displayTime = this.datePipe.transform(this.currentTime, 'mm:ss');
                    if (this.remainingTime === '00:00') {
                        this._player.pause();
                        this.isPlaying = false;
                        this._player.seekTo(0);
                    }
                }, 1000);
            });
        }
    }

    onCurrentTimeChanged(args): void {
        const slider = <Slider>args.object;
        if (!isNaN(slider.value)) {
            this.seek(Math.floor(slider.value));
        }
    }

    seek(moment: number): void {
        let time = moment / 1000
        this._player.seekTo(time);
    }

    isSliderValueChanged(val: number): boolean {
        return Math.round(val) !== Math.round(this.currentTime);
    }

    onBackButtonTap(): void {
        this.routerExtensions.backToPreviousPage();
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

}
