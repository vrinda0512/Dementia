import * as THREE from "three";

export class CameraController {
  private azimuth = 0.34;
  private polar = 1.22;
  private desiredAzimuth = this.azimuth;
  private desiredPolar = this.polar;
  private readonly target = new THREE.Vector3(0, 1.75, -0.45);
  private readonly desiredPosition = new THREE.Vector3();

  constructor(
    private readonly camera: THREE.PerspectiveCamera,
    private readonly reducedMotion: boolean
  ) {}

  drag(deltaX: number, deltaY: number) {
    this.desiredAzimuth = THREE.MathUtils.clamp(this.desiredAzimuth - deltaX * 0.006, -0.78, 0.78);
    this.desiredPolar = THREE.MathUtils.clamp(this.desiredPolar + deltaY * 0.004, 0.93, 1.47);
  }

  update(delta: number) {
    const interpolation = this.reducedMotion ? 1 : 1 - Math.exp(-delta * 8);
    this.azimuth = THREE.MathUtils.lerp(this.azimuth, this.desiredAzimuth, interpolation);
    this.polar = THREE.MathUtils.lerp(this.polar, this.desiredPolar, interpolation);

    const radius = 8.2;
    this.desiredPosition.setFromSphericalCoords(radius, this.polar, this.azimuth).add(this.target);
    this.camera.position.lerp(this.desiredPosition, interpolation);
    this.camera.lookAt(this.target);
  }
}
