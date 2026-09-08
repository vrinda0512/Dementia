import * as THREE from "three";
import { InteractiveSceneObject } from "../types";
import { createInteractiveParts, shadow, toInteractiveSceneObject } from "./shared";

export function createKettle(): InteractiveSceneObject {
  const parts = createInteractiveParts("kettle", "Tea kettle");
  const { root } = parts;
  root.position.set(1.15, 1.08, 0.25);

  const brass = new THREE.MeshStandardMaterial({ color: 0xa96f35, roughness: 0.38, metalness: 0.68 });
  const darkBrass = new THREE.MeshStandardMaterial({ color: 0x523419, roughness: 0.45, metalness: 0.5 });
  const body = shadow(new THREE.Mesh(new THREE.SphereGeometry(0.4, 32, 22), brass));
  body.scale.set(1, 0.86, 1);
  body.position.y = 0.38;
  root.add(body);

  const neck = shadow(new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.23, 0.16, 24), brass));
  neck.position.y = 0.73;
  root.add(neck);

  const lidPivot = new THREE.Group();
  lidPivot.position.set(0, 0.8, -0.08);
  const lid = shadow(new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.25, 0.06, 24), darkBrass));
  lid.position.z = 0.08;
  lidPivot.add(lid);
  const knob = shadow(new THREE.Mesh(new THREE.SphereGeometry(0.055, 16, 12), darkBrass));
  knob.position.set(0, 0.06, 0.08);
  lidPivot.add(knob);
  root.add(lidPivot);

  const handle = shadow(new THREE.Mesh(new THREE.TorusGeometry(0.28, 0.035, 10, 24, Math.PI), darkBrass));
  handle.rotation.x = Math.PI / 2;
  handle.rotation.z = Math.PI;
  handle.position.set(0, 0.59, -0.22);
  root.add(handle);

  const spout = shadow(new THREE.Mesh(new THREE.ConeGeometry(0.13, 0.48, 20), brass));
  spout.rotation.z = -1.05;
  spout.position.set(0.4, 0.53, 0.04);
  root.add(spout);

  const steamMaterial = new THREE.MeshBasicMaterial({ color: 0xf7f3e8, transparent: true, opacity: 0, depthWrite: false });
  const steam = Array.from({ length: 3 }, (_, index) => {
    const puff = new THREE.Mesh(new THREE.SphereGeometry(0.1 + index * 0.018, 14, 10), steamMaterial.clone());
    puff.position.set((index - 1) * 0.08, 0.96, 0);
    puff.visible = false;
    root.add(puff);
    return puff;
  });

  let warmUntil = 0;
  return toInteractiveSceneObject(
    "kettle",
    "Tea kettle",
    parts,
    () => {
      warmUntil = performance.now() + 6200;
      return {
        objectId: "kettle",
        label: "Tea kettle",
        message: "The kettle warms gently. A little steam rises for the tea.",
        active: true,
      };
    },
    (elapsed) => {
      const active = performance.now() < warmUntil;
      lidPivot.rotation.z = active ? Math.sin(elapsed * 4) * 0.045 : 0;
      steam.forEach((puff, index) => {
        puff.visible = active;
        puff.material.opacity = active ? 0.16 : 0;
        puff.position.y = 0.96 + ((elapsed * 0.36 + index * 0.22) % 1) * 0.65;
        puff.position.x = (index - 1) * 0.08 + Math.sin(elapsed * 1.8 + index) * 0.04;
        puff.scale.setScalar(0.7 + ((elapsed * 0.36 + index * 0.22) % 1));
      });
    }
  );
}
