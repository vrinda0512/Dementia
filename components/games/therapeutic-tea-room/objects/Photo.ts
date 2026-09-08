import * as THREE from "three";
import { InteractiveSceneObject } from "../types";
import { createInteractiveParts, shadow, toInteractiveSceneObject, woodMaterial } from "./shared";

export function createPhoto(): InteractiveSceneObject {
  const parts = createInteractiveParts("photo", "Family photograph");
  const { root } = parts;
  root.position.set(-1.9, 2.02, -2.73);

  const frame = woodMaterial(0x4a3021);
  const frameGroup = new THREE.Group();
  const outer = shadow(new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.48, 0.06), frame));
  frameGroup.add(outer);

  const textureLoader = new THREE.TextureLoader();
  const photoTexture = textureLoader.load("/images/photoframe.webp");
  photoTexture.colorSpace = THREE.SRGBColorSpace;

  const imageMaterial = new THREE.MeshStandardMaterial({
    map: photoTexture,
    roughness: 0.35,
    metalness: 0.05,
  });
  const image = new THREE.Mesh(
    new THREE.PlaneGeometry(0.53, 0.39),
    imageMaterial
  );
  image.position.z = 0.032;
  frameGroup.add(image);
  const stand = shadow(new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.06, 0.2), frame));
  stand.position.set(0, -0.27, -0.08);
  stand.rotation.x = -0.36;
  frameGroup.add(stand);
  root.add(frameGroup);

  let openUntil = 0;
  return toInteractiveSceneObject(
    "photo",
    "Family photograph",
    parts,
    () => {
      openUntil = performance.now() + 3200;
      return {
        objectId: "photo",
        label: "Family photograph",
        message: "A familiar face can bring a gentle memory. Take a quiet moment with the photograph.",
      };
    },
    () => {
      const progress = Math.max(0, openUntil - performance.now()) / 3200;
      const expansion = Math.sin((1 - progress) * Math.PI) * 0.18;
      frameGroup.scale.setScalar(1 + expansion);
      frameGroup.rotation.y = -expansion * 0.45;
    }
  );
}
