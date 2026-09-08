import * as THREE from "three";
import { InteractionResponse, InteractiveObjectId, InteractiveSceneObject } from "../types";

type InteractiveParts = {
  root: THREE.Group;
  glow: THREE.Mesh<THREE.RingGeometry, THREE.MeshBasicMaterial>;
};

export function createInteractiveParts(id: InteractiveObjectId, label: string): InteractiveParts {
  const root = new THREE.Group();
  root.name = label;
  root.userData.interactionId = id;

  const glow = new THREE.Mesh(
    new THREE.RingGeometry(0.45, 0.58, 32),
    new THREE.MeshBasicMaterial({
      color: 0xf6d58b,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      side: THREE.DoubleSide,
    })
  );
  glow.rotation.x = -Math.PI / 2;
  glow.position.y = 0.018;
  root.add(glow);
  return { root, glow };
}

export function toInteractiveSceneObject(
  id: InteractiveObjectId,
  label: string,
  parts: InteractiveParts,
  activate: () => InteractionResponse,
  update: (elapsed: number, delta: number) => void
): InteractiveSceneObject {
  return {
    id,
    label,
    root: parts.root,
    activate,
    update,
    setHovered: (hovered) => {
      parts.glow.material.opacity = hovered ? 0.34 : 0;
      parts.root.scale.setScalar(hovered ? 1.025 : 1);
    },
  };
}

export function woodMaterial(color = 0x754a2c) {
  return new THREE.MeshStandardMaterial({ color, roughness: 0.76, metalness: 0.02 });
}

export function bambooMaterial(color = 0xc18b46) {
  return new THREE.MeshStandardMaterial({ color, roughness: 0.8, metalness: 0 });
}

export function shadow(mesh: THREE.Mesh) {
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}
