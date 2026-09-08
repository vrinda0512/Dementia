import * as THREE from "three";
import { InteractiveObjectId, InteractiveSceneObject } from "./types";

export class InteractionSystem {
  private readonly raycaster = new THREE.Raycaster();
  private readonly pointer = new THREE.Vector2();
  private readonly objects = new Map<InteractiveObjectId, InteractiveSceneObject>();
  private hovered: InteractiveSceneObject | null = null;

  register(sceneObject: InteractiveSceneObject) {
    sceneObject.root.userData.interactionId = sceneObject.id;
    this.objects.set(sceneObject.id, sceneObject);
  }

  updatePointer(event: PointerEvent, element: HTMLElement, camera: THREE.Camera) {
    const hit = this.pick(event, element, camera);
    if (hit === this.hovered) return hit;
    this.hovered?.setHovered(false);
    this.hovered = hit;
    this.hovered?.setHovered(true);
    return hit;
  }

  activateAt(event: PointerEvent, element: HTMLElement, camera: THREE.Camera) {
    return this.pick(event, element, camera)?.activate() ?? null;
  }

  clearHover() {
    this.hovered?.setHovered(false);
    this.hovered = null;
  }

  private pick(event: PointerEvent, element: HTMLElement, camera: THREE.Camera) {
    const bounds = element.getBoundingClientRect();
    this.pointer.x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
    this.pointer.y = -((event.clientY - bounds.top) / bounds.height) * 2 + 1;
    this.raycaster.setFromCamera(this.pointer, camera);

    const roots = [...this.objects.values()].map((item) => item.root);
    const intersections = this.raycaster.intersectObjects(roots, true);
    for (const intersection of intersections) {
      let node: THREE.Object3D | null = intersection.object;
      while (node) {
        const id = node.userData.interactionId as InteractiveObjectId | undefined;
        if (id) return this.objects.get(id) ?? null;
        node = node.parent;
      }
    }
    return null;
  }
}
