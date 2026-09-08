import * as THREE from "three";
import { InteractiveSceneObject } from "../types";
import { createInteractiveParts, shadow, toInteractiveSceneObject } from "./shared";

export function createPlant(): InteractiveSceneObject {
  const parts = createInteractiveParts("plant", "Indoor plant");
  const { root } = parts;
  root.position.set(3.15, 0.03, -2.55);

  const pot = shadow(new THREE.Mesh(
    new THREE.CylinderGeometry(0.3, 0.23, 0.46, 20),
    new THREE.MeshStandardMaterial({ color: 0x9e4f34, roughness: 0.82 })
  ));
  pot.position.y = 0.23;
  root.add(pot);
  const soil = new THREE.Mesh(new THREE.CircleGeometry(0.27, 20), new THREE.MeshStandardMaterial({ color: 0x3d271b, roughness: 1 }));
  soil.position.y = 0.47;
  soil.rotation.x = -Math.PI / 2;
  root.add(soil);
  const leaves = new THREE.Group();
  const leafMaterial = new THREE.MeshStandardMaterial({ color: 0x477547, roughness: 0.72, side: THREE.DoubleSide });
  for (let index = 0; index < 9; index += 1) {
    const leaf = new THREE.Mesh(new THREE.SphereGeometry(0.16, 12, 8), leafMaterial);
    const angle = (index / 9) * Math.PI * 2;
    leaf.scale.set(0.56, 1.7, 0.3);
    leaf.position.set(Math.cos(angle) * 0.24, 0.62 + (index % 3) * 0.12, Math.sin(angle) * 0.2);
    leaf.rotation.z = Math.cos(angle) * 0.58;
    leaves.add(leaf);
  }
  root.add(leaves);

  let stirredUntil = 0;
  return toInteractiveSceneObject(
    "plant",
    "Indoor plant",
    parts,
    () => {
      stirredUntil = performance.now() + 2800;
      return {
        objectId: "plant",
        label: "Indoor plant",
        message: "The leaves sway softly, as though a small breeze has passed through.",
      };
    },
    (elapsed) => {
      const active = performance.now() < stirredUntil;
      leaves.rotation.z = Math.sin(elapsed * (active ? 5 : 1.1)) * (active ? 0.14 : 0.025);
      leaves.rotation.x = Math.cos(elapsed * 1.3) * 0.025;
    }
  );
}
