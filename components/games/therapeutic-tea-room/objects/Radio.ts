import * as THREE from "three";
import { InteractiveSceneObject } from "../types";
import { createInteractiveParts, shadow, toInteractiveSceneObject, woodMaterial } from "./shared";

export function createRadio(): InteractiveSceneObject {
  const parts = createInteractiveParts("radio", "Small radio");
  const { root } = parts;
  root.position.set(-2.83, 2.02, -2.72);

  const casing = woodMaterial(0x563b2a);
  const brass = new THREE.MeshStandardMaterial({ color: 0xc69a54, roughness: 0.35, metalness: 0.58 });
  const body = shadow(new THREE.Mesh(new THREE.BoxGeometry(0.78, 0.38, 0.24), casing));
  body.position.y = 0.22;
  root.add(body);
  const fabric = new THREE.MeshStandardMaterial({ color: 0x31413b, roughness: 0.9 });
  const speaker = shadow(new THREE.Mesh(new THREE.CircleGeometry(0.13, 24), fabric));
  speaker.position.set(-0.19, 0.22, 0.125);
  root.add(speaker);
  const dial = shadow(new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.04, 16), brass));
  dial.rotation.x = Math.PI / 2;
  dial.position.set(0.22, 0.22, 0.135);
  root.add(dial);
  const lightMaterial = new THREE.MeshStandardMaterial({ color: 0x8f3b1f, emissive: 0x3b1008, emissiveIntensity: 0.15 });
  const indicator = new THREE.Mesh(new THREE.SphereGeometry(0.025, 12, 10), lightMaterial);
  indicator.position.set(0.32, 0.22, 0.14);
  root.add(indicator);
  const antenna = shadow(new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.78, 8), brass));
  antenna.position.set(0.28, 0.68, 0);
  antenna.rotation.z = -0.23;
  root.add(antenna);

  let playing = false;
  return toInteractiveSceneObject(
    "radio",
    "Small radio",
    parts,
    () => {
      playing = !playing;
      return {
        objectId: "radio",
        label: "Small radio",
        message: playing ? "A soft familiar melody settles into the room." : "The room returns to its quiet morning tone.",
        active: playing,
      };
    },
    (elapsed) => {
      dial.rotation.z = playing ? elapsed * 0.8 : 0;
      lightMaterial.emissiveIntensity = playing ? 1.1 + Math.sin(elapsed * 2) * 0.15 : 0.15;
    }
  );
}
