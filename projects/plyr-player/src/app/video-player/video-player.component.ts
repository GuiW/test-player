import {Component, ViewChild} from '@angular/core';
import {PlyrComponent} from 'ngx-plyr';
import * as Plyr from 'plyr';

@Component({
  selector: 'app-video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.scss']
})
export class VideoPlayerComponent {

  // get the component instance to have access to plyr instance
  @ViewChild(PlyrComponent, {static: true})
  plyr: PlyrComponent;

  videoSources: Plyr.Source[] = [
    {
      src: 'https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-576p.mp4',
      type: 'video/mp4',
      size: 576,
    },
    {
      src: 'https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-720p.mp4',
      type: 'video/mp4',
      size: 720,
    },
    {
      src: 'https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-1080p.mp4',
      type: 'video/mp4',
      size: 1080,
    }
  ];

  poster = 'https://bitdash-a.akamaihd.net/content/sintel/poster.png';

  playerInit(event: Plyr) {
    const player = event;

    player.on('qualitychange', (e) => {
    });

    player.on('seeking', () => console.log('seeking'));
    player.on('seeked', () => console.log('seeked'));

  }
}
