// vjs-player.component.ts
import {Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import videojs from 'video.js';
import 'videojs-contrib-quality-levels';

@Component({
  selector: 'app-vjs-player',
  templateUrl: './vjs-player.component.html',
  styleUrls: [
    './vjs-player.component.scss'
  ],
  encapsulation: ViewEncapsulation.None,
})
export class VjsPlayerComponent implements OnInit, OnDestroy {
  @ViewChild('target', {static: true}) target: ElementRef;
  @ViewChild('progress', {static: true}) progress: ElementRef;

  constructor(private elementRef: ElementRef) {
  }

  // see options: https://github.com/videojs/video.js/blob/mastertutorial-options.html
  options = {
    muted: true,
    fluid: true,
    aspectRatio: '16:9',
    autoplay: true,
    controls: true,
    sources: [
      {
        src: 'https://d2zihajmogu5jn.cloudfront.net/bipbop-advanced/bipbop_16x9_variant.m3u8',
        type: 'application/x-mpegURL',
        withCredentials: false,
      }
    ],
    poster: 'https://via.placeholder.com/1920x1080.png?text=Placeholder+poster'
  };

  player: videojs.Player;
  qualityLevels = [];
  hdResolution = 720;
  qualityHDEnabled = true;
  videoDuration: number;
  videoCurrentTime = 0;
  videoCurrentTimeInSeconds: string;
  bookmarkList: {
    currentTimeInSeconds: number
    currentTime: string
  }[] = [];

  updateTime(currentTime) {
    this.videoCurrentTimeInSeconds = new Date(currentTime * 1000).toISOString().substr(11, 8);
    this.progress.nativeElement.value = (100 / this.videoDuration) * currentTime;
  }

  onQualityChange() {
    for (const qualityLevel of this.player.qualityLevels().levels_) {
      if (qualityLevel.height >= this.hdResolution) {
        qualityLevel.enabled = !this.qualityHDEnabled;
      }
    }
    this.qualityHDEnabled = !this.qualityHDEnabled;
  }

  onPlay() {
    this.player.play();
  }

  onPause() {
    this.player.pause();
  }

  addBookmark() {
    if (!this.player.currentTime()) {
      return;
    }
    const bookmark = {
      currentTimeInSeconds: this.player.currentTime(),
      currentTime: this.videoCurrentTimeInSeconds,
    };
    this.bookmarkList.push(bookmark);
  }

  goToTime(e, time) {
    e.preventDefault();
    this.player.currentTime(time);
  }

  changeTime(time) {
    this.updateTime(time);
    this.player.currentTime(time);
  }

  ngOnInit() {
    const videoProgressBar = this.progress.nativeElement;
    // instantiate Video.js
    this.player = videojs(this.target.nativeElement, this.options, function onPlayerReady() {
      let videoDuration: number;

      this.one('loadedmetadata', () => {
        videoDuration = this.duration();
      });
    });

    this.player.one('loadedmetadata', () => {
      this.videoDuration = this.player.duration();
    });

    this.player.on('timeupdate', () => {
      this.videoCurrentTime = this.player.currentTime();
      this.updateTime(this.player.currentTime());
    });

    const qualityLevelsList = this.player.qualityLevels();

    qualityLevelsList.on('addqualitylevel', (qualityLevel) => {
      this.qualityLevels.push(qualityLevel);
    });
  }

  ngOnDestroy() {
    // destroy player
    if (this.player) {
      this.player.dispose();
    }
  }
}
