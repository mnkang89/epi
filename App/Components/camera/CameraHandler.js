export default class CameraHandelr {
  constructor () {
    this.camera = null
  }

  setCamera (cameraReference) {
    this.camera = cameraReference
  }

  getCamera () {
    return this.camera
  }
}
