import { FileLoader } from 'three/src/loaders/FileLoader';
import { DefaultLoadingManager } from 'three/src/loaders/LoadingManager';
import GifTexture from './gif-texture';
import { GifReader } from 'omggif';

export default class GifLoader {
  constructor(manager) {
    this.manager = manager || DefaultLoadingManager;
    this.crossOrigin = 'anonymous';
  }

  load(url, onLoad, onProgress, onError) {
    const texture = new GifTexture();

    const loader = new FileLoader(this.manager);
    loader.setPath(this.path);
    loader.setResponseType('arraybuffer');

    loader.load(url, (response) => {
      const gifData = new Uint8Array(response);
      const reader = new GifReader(gifData);

      texture.setReader(reader);

      if (onLoad) onLoad(reader);
    }, onProgress, onError);

    return texture;
  }

  setPath(value) {
    this.path = value;
    return this;
  }
}
