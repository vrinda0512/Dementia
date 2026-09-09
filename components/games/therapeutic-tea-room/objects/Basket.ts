import * as THREE from "three";
import { InteractiveSceneObject } from "../types";
import { bambooMaterial, createInteractiveParts, shadow, toInteractiveSceneObject } from "./shared";

export function createBasket(): InteractiveSceneObject {
  const parts = createInteractiveParts("basket", "Woven bamboo basket");
  const { root } = parts;
  root.position.set(0.14, 1.05, 0.53);

  const bamboo = bambooMaterial(0xbd8542);
  const darkBamboo = bambooMaterial(0x7d542f);
  const body = shadow(new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.24, 0.28, 24), bamboo));
  body.position.y = 0.17;
  root.add(body);
  for (let height = 0.08; height < 0.32; height += 0.065) {
    const weave = new THREE.Mesh(new THREE.TorusGeometry(0.285, 0.009, 6, 24), darkBamboo);
    weave.rotation.x = Math.PI / 2;
    weave.position.y = height;
    root.add(weave);
  }
  const lidPivot = new THREE.Group();
  lidPivot.position.set(0, 0.34, -0.22);
  const lid = shadow(new THREE.Mesh(new THREE.CylinderGeometry(0.31, 0.31, 0.055, 24), bamboo));
  lid.position.z = 0.22;
  lidPivot.add(lid);
  root.add(lidPivot);
  const cloth = new THREE.Mesh(
    new THREE.CircleGeometry(0.22, 20),
    new THREE.MeshStandardMaterial({ color: 0x9d3845, roughness: 0.88 })
  );
  cloth.rotation.x = -Math.PI / 2;
  cloth.position.y = 0.335;
  cloth.visible = false;
  root.add(cloth);

  let opened = false;
  return toInteractiveSceneObject(
    "basket",
    "Woven bamboo basket",
    parts,
    () => {
      opened = !opened;
      return {
        objectId: "basket",
        label: "Woven bamboo basket",
        message: opened ? "The basket opens to reveal a folded woven cloth." : "The basket settles closed again.",
        active: opened,
      };
    },
    () => {
      const target = opened ? -1.08 : 0;
      lidPivot.rotation.x = THREE.MathUtils.lerp(lidPivot.rotation.x, target, 0.09);
      cloth.visible = opened || lidPivot.rotation.x < -0.18;
    }
  );
}
