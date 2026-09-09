import * as THREE from "three";
import { InteractiveSceneObject } from "../types";
import { createInteractiveParts, shadow, toInteractiveSceneObject, woodMaterial } from "./shared";

export function createWindow(): InteractiveSceneObject {
  const parts = createInteractiveParts("window", "Garden window");
  const { root } = parts;
  root.position.set(0.35, 2.5, -3.29);

  const frameMaterial = woodMaterial(0x65442e);
  const framePieces = [
    [0, 0.72, 2.75, 0.09],
    [0, -0.72, 2.75, 0.09],
    [-1.33, 0, 0.09, 1.52],
    [1.33, 0, 0.09, 1.52],
    [0, 0, 0.07, 1.4],
  ] as const;
  framePieces.forEach(([x, y, width, height]) => {
    const piece = shadow(new THREE.Mesh(new THREE.BoxGeometry(width, height, 0.1), frameMaterial));
    piece.position.set(x, y, 0);
    root.add(piece);
  });
  const handle = shadow(new THREE.Mesh(new THREE.SphereGeometry(0.06, 16, 12), new THREE.MeshStandardMaterial({ color: 0xb98545, metalness: 0.5, roughness: 0.3 })));
  handle.position.set(0.1, -0.15, 0.1);
  root.add(handle);
  const curtainMaterial = new THREE.MeshStandardMaterial({ color: 0xd8c49e, roughness: 0.92, transparent: true, opacity: 0.72, side: THREE.DoubleSide });
  const leftCurtain = new THREE.Mesh(new THREE.PlaneGeometry(0.42, 1.22), curtainMaterial);
  leftCurtain.position.set(-1.08, 0.02, 0.07);
  root.add(leftCurtain);
  const rightCurtain = leftCurtain.clone();
  rightCurtain.position.x = 1.08;
  root.add(rightCurtain);

  let opened = false;
  return toInteractiveSceneObject(
    "window",
    "Garden window",
    parts,
    () => {
      opened = !opened;
      return {
        objectId: "window",
        label: "Garden window",
        message: opened ? "A little more garden air and birdsong enters the room." : "The garden settles into a softer distance.",
        active: opened,
      };
    },
    (elapsed) => {
      const offset = opened ? 0.31 : 0.05;
      leftCurtain.position.x = THREE.MathUtils.lerp(leftCurtain.position.x, -1.08 - offset, 0.05);
      rightCurtain.position.x = THREE.MathUtils.lerp(rightCurtain.position.x, 1.08 + offset, 0.05);
      const sway = opened ? Math.sin(elapsed * 1.5) * 0.07 : 0;
      leftCurtain.rotation.y = sway;
      rightCurtain.rotation.y = -sway;
    }
  );
}
