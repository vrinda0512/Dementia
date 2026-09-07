import * as THREE from "three";
import { InteractiveSceneObject } from "../types";
import { createInteractiveParts, shadow, toInteractiveSceneObject } from "./shared";

export function createCup(): InteractiveSceneObject {
  const parts = createInteractiveParts("cup", "Ceramic tea cup");
  const { root } = parts;
  root.position.set(1.94, 1.06, 0.45);

  const ceramic = new THREE.MeshStandardMaterial({ color: 0xd9c5a6, roughness: 0.44 });
  const tea = new THREE.MeshStandardMaterial({ color: 0x4c2716, roughness: 0.28 });
  const cupGroup = new THREE.Group();
  const body = shadow(new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.14, 0.25, 28), ceramic));
  body.position.y = 0.15;
  cupGroup.add(body);
  const rim = shadow(new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.018, 8, 28), ceramic));
  rim.position.y = 0.28;
  cupGroup.add(rim);
  const teaSurface = new THREE.Mesh(new THREE.CircleGeometry(0.155, 24), tea);
  teaSurface.rotation.x = -Math.PI / 2;
  teaSurface.position.y = 0.282;
  cupGroup.add(teaSurface);
  const handle = shadow(new THREE.Mesh(new THREE.TorusGeometry(0.075, 0.022, 8, 18), ceramic));
  handle.rotation.x = Math.PI / 2;
  handle.position.set(0.18, 0.16, 0);
  cupGroup.add(handle);
  root.add(cupGroup);

  let touchedUntil = 0;
  return toInteractiveSceneObject(
    "cup",
    "Ceramic tea cup",
    parts,
    () => {
      touchedUntil = performance.now() + 1100;
      return {
        objectId: "cup",
        label: "Ceramic tea cup",
        message: "The cup gives a quiet ceramic chime.",
      };
    },
    () => {
      const remaining = Math.max(0, touchedUntil - performance.now()) / 1100;
      const motion = Math.sin((1 - remaining) * Math.PI) * 0.09;
      cupGroup.position.y = motion;
      cupGroup.rotation.z = motion * 0.3;
    }
  );
}
