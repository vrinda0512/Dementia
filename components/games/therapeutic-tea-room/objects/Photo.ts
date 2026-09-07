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
  const image = new THREE.Mesh(
    new THREE.PlaneGeometry(0.49, 0.36),
    new THREE.MeshBasicMaterial({ color: 0xe5c996 })
  );
  image.position.z = 0.035;
  frameGroup.add(image);
  const silhouetteMaterial = new THREE.MeshBasicMaterial({ color: 0x6f5945 });
  [-0.12, 0.08].forEach((x, index) => {
    const head = new THREE.Mesh(new THREE.CircleGeometry(index === 0 ? 0.052 : 0.046, 18), silhouetteMaterial);
    head.position.set(x, 0.06, 0.042);
    frameGroup.add(head);
    const shoulders = new THREE.Mesh(new THREE.CircleGeometry(index === 0 ? 0.1 : 0.085, 18, 0, Math.PI), silhouetteMaterial);
    shoulders.position.set(x, -0.075, 0.042);
    frameGroup.add(shoulders);
  });
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
