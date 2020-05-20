import {Component, OnInit} from '@angular/core';

declare global {
  interface Window {
    webkitAudioContext: any;
  }
}

@Component({
  selector: 'app-audio-player',
  templateUrl: './audio-player.component.html',
  styleUrls: ['./audio-player.component.scss']
})
export class AudioPlayerComponent implements OnInit {
  constructor() {
  }

  audio: HTMLAudioElement;
  context;
  analyser;
  canvas;
  ctx;
  audioIsPlaying = false;

  initMp3Player(): void {
    // Create audio player
    this.audio = new Audio();
    this.audio.src = 'assets/audio/placeholder.mp3';

    // Create canvas for analyser
    this.canvas = document.getElementById('analyser_render') as HTMLCanvasElement;
    this.ctx = this.canvas.getContext('2d');

    const AudioContext = window.AudioContext || window.webkitAudioContext || false; // AudioContext object instance
    if (AudioContext) {
      this.context = new AudioContext();
    } else {
      alert('Sorry, but the Web Audio API is not supported by your browser. Please, consider upgrading to the latest version or downloading Google Chrome or Mozilla Firefox');
    }
    this.analyser = this.context.createAnalyser(); // AnalyserNode method
    // Re-route audio playback into the processing graph of the AudioContext
    const source = this.context.createMediaElementSource(this.audio);
    source.connect(this.analyser);
    source.connect(this.context.destination);
    this.analyser.connect(this.context.destination);
    this.frameLooper();
  }

  // frameLooper() animates any style of graphics you wish to the audio frequency
  // Looping at the default frame rate that the browser provides(approx. 60 FPS)
  frameLooper() {
    console.log('call')
    const self = this;
    window.requestAnimationFrame(() => this.frameLooper());
    const fbcArray = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(fbcArray);
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // Clear the canvas
    this.ctx.fillStyle = '#00CCFF'; // Color of the bars
    const bars = 100;
    for (let i = 0; i < bars; i++) {
      const barX = i * 3;
      const barWidth = 2;
      const barHeight = -(fbcArray[i] / 2);
      //  fillRect( x, y, width, height ) // Explanation of the parameters below
      this.ctx.fillRect(barX, this.canvas.height, barWidth, barHeight);
    }
  }

  ngOnInit(): void {
    this.initMp3Player();

    document.getElementById('btn').addEventListener('click', () => {
      // check if context is in suspended state (autoplay policy)
      if (this.context.state === 'suspended') {
        this.context.resume();
      }
      if (!this.audioIsPlaying) {
        this.audio.play();
      } else {
        this.audio.pause();
      }

      this.audioIsPlaying = !this.audioIsPlaying;
    }, false);
  }
}
