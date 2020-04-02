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
  // see options: https://github.com/videojs/video.js/blob/mastertutorial-options.html
  options = {
    muted: true,
    fluid: true,
    aspectRatio: '16:9',
    autoplay: false,
    controls: true,
    sources: [
      {
        src: 'https://d2zihajmogu5jn.cloudfront.net/bipbop-advanced/bipbop_16x9_variant.m3u8',
        type: 'application/x-mpegURL',
        withCredentials: false
      }
    ]
  };
  player: videojs.Player;
  toggleQuality;
  qualityBtnText = 'Change quality';
  enable360 = true;

  constructor(
    private elementRef: ElementRef,
  ) {
  }

  ngOnInit() {
    // instantiate Video.js
    this.player = videojs(this.target.nativeElement, this.options, function onPlayerReady() {
      console.log('onPlayerReady', this);
      console.log(this.qualityLevels());
    });

    const qualityLevels = this.player.qualityLevels();

    qualityLevels.on('addqualitylevel', (event) => {
      const quality = event.qualityLevel;

      // the master playlist doesn't seem to have a 720 width rendition
      if (quality.width >= 720) {
        quality.enabled = true;
      } else {
        quality.enabled = false;
      }

      console.log(quality.width + ': ' + quality.enabled);

      this.toggleQuality = (() => {
        let enable720 = true;

        return () => {
          for (let i = 0; i < qualityLevels.length; i++) {
            const qualityLevel = qualityLevels[i];
            if (qualityLevel.height >= 720) {
              qualityLevel.enabled = enable720;
              this.qualityBtnText = 'Quality HD';

            } else {
              qualityLevel.enabled = !enable720;
              this.qualityBtnText = 'Quality SD';
            }
          }
          enable720 = !enable720;
        };
      })();
    });

    qualityLevels.on('change', () => {
      console.log('Quality Level changed!');
      console.log('New level:', qualityLevels[qualityLevels.selectedIndex]);
      console.log(`currentSelectedQualityLevelIndex`, qualityLevels.selectedIndex);
    });
  }

  ngOnDestroy() {
    // destroy player
    if (this.player) {
      this.player.dispose();
    }
  }
}
