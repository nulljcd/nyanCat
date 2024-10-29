class AudioHandler {
  static AudioSprite = class {
    constructor(actx, buffer) {
      this.actx = actx;
      this.buffer = buffer;
  
      this.volumeNode = this.actx.createGain();
      this.soundNode = null;
      this.loop = false;
      this.isPlaying = false;
      this.gainValue = 1;
      this.startTime = 0;
      this.startOffset = 0;
    }
  
    play(startOffset = -1) {
      if (startOffset != -1)
        this.startOffset = startOffset;
      this.startTime = this.actx.currentTime;
      this.soundNode = this.actx.createBufferSource();
      this.soundNode.buffer = this.buffer;
      this.soundNode.connect(this.volumeNode);
      this.volumeNode.connect(this.actx.destination);
      this.soundNode.loop = this.loop;
      this.soundNode.start(0, this.startOffset);
      this.isPlaying = true;
    }
  
    stop() {
      this.soundNode.stop(0);
      this.startOffset += this.actx.currentTime - this.startTime;
      this.isPlaying = false;
    }
  
    setGain(gain) {
      this.gainValue = gain;
      this.volumeNode.gain = this.gainValue;
    }
  
    setLoop(loop) {
      this.loop = loop;
    }
  }

  constructor() {
    this.actx = new AudioContext();
  }

  async load(source) {
    let self = this;

    return new Promise(function (resolve, reject) {
      let request = new XMLHttpRequest();
      request.open("GET", source, true);
      request.responseType = "arraybuffer";
      request.onload = () => {
        self.actx.decodeAudioData(
          request.response,
          buffer => {
            let audioSprite = new AudioHandler.AudioSprite(self.actx, buffer);
            resolve(audioSprite);
          },
          error => {
            reject(error);
          }
        );
      };
      request.send();
    });
  }
}



let audioLoader = new AudioHandler();

let nyanCatAudio = null;
audioLoader.load('res/nyanCat.mp3').then(audioSprite => {
  nyanCatAudio = audioSprite;
  nyanCatAudio.setLoop(true);
  document.body.onmousedown = () => {
    if (!nyanCatAudio.isPlaying)
      nyanCatAudio.play();
    else
      nyanCatAudio.stop();
  }
});
