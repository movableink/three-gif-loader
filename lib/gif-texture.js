import { CanvasTexture } from 'three';

export default class GifTexture extends CanvasTexture {
  constructor(image, mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy) {
    super(image, mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy);

    this.needsUpdate = false;
  }

  setReader(reader) {
    this.reader = reader;

    this.image = document.createElement('canvas');
    this.image.width = reader.width;
    this.image.height = reader.height;
    this.context = this.image.getContext('2d');

    this.frameNumber = 0;
    this.draw();
  }

  draw() {
    if (!this.reader) {
      return;
    }

    const { reader, image, context } = this;
    const { width, height } = image;

    const frameNum = ++this.frameNumber % reader.numFrames();
    const frameInfo = reader.frameInfo(frameNum);

    if (frameNum === 0 || frameInfo.disposal === 2 /* restore to bg */) {
      context.clearRect(0, 0, width, height);
    }

    const imageData = context.createImageData(width, height);
    reader.decodeAndBlitFrameRGBA(frameNum, imageData.data);
    context.putImageData(imageData, 0, 0);

    this.needsUpdate = true;

    const draw = this.draw.bind(this);
    setTimeout(draw, frameInfo.delay * 10);
  }
};
