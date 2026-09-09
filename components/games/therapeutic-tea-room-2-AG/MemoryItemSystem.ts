import * as THREE from "three";
import { HidingPlaceId, MemoryItemId } from "./types";

type MotionState = {
  itemId: MemoryItemId;
  hidingPlaceId: HidingPlaceId;
  startedAt: number;
  complete: boolean;
};

const HIDING_POSITIONS: Record<HidingPlaceId, THREE.Vector3> = {
  basket: new THREE.Vector3(0.14, 1.42, 0.54),
  kettle: new THREE.Vector3(1.15, 1.47, 0.22),
  photo: new THREE.Vector3(-1.9, 2.02, -2.54),
};

const CUE_POSITION = new THREE.Vector3(0.05, 1.58, 1.5);

function createKey() {
  const group = new THREE.Group();
  const brass = new THREE.MeshStandardMaterial({ color: 0xc9943e, metalness: 0.76, roughness: 0.28 });
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.11, 0.027, 10, 22), brass);
  ring.rotation.x = Math.PI / 2;
  group.add(ring);
  const shaft = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.05, 0.26), brass);
  shaft.position.z = 0.18;
  group.add(shaft);
  [-0.025, 0.035].forEach((x, index) => {
    const tooth = new THREE.Mesh(new THREE.BoxGeometry(0.06 - index * 0.012, 0.05, 0.045), brass);
    tooth.position.set(x, 0, 0.31 + index * 0.045);
    group.add(tooth);
  });
  group.scale.setScalar(1.25);
  return group;
}

function createPhone() {
  const group = new THREE.Group();
  const body = new THREE.Mesh(
    new THREE.BoxGeometry(0.2, 0.39, 0.045),
    new THREE.MeshStandardMaterial({ color: 0x24483d, roughness: 0.44, metalness: 0.18 })
  );
  group.add(body);
  const screen = new THREE.Mesh(
    new THREE.BoxGeometry(0.156, 0.286, 0.008),
    new THREE.MeshStandardMaterial({ color: 0x9bbab0, roughness: 0.2, metalness: 0.18, emissive: 0x203d36, emissiveIntensity: 0.12 })
  );
  screen.position.z = 0.028;
  group.add(screen);
  const speaker = new THREE.Mesh(new THREE.BoxGeometry(0.055, 0.008, 0.009), new THREE.MeshStandardMaterial({ color: 0x101a17, roughness: 0.7 }));
  speaker.position.set(0, 0.145, 0.032);
  group.add(speaker);
  return group;
}

function createLetter() {
  const group = new THREE.Group();
  const paper = new THREE.Mesh(
    new THREE.BoxGeometry(0.32, 0.22, 0.012),
    new THREE.MeshStandardMaterial({ color: 0xe7d4a9, roughness: 0.88 })
  );
  group.add(paper);
  const fold = new THREE.Mesh(
    new THREE.ConeGeometry(0.07, 0.07, 3),
    new THREE.MeshStandardMaterial({ color: 0xb44a44, roughness: 0.65 })
  );
  fold.rotation.x = Math.PI / 2;
  fold.position.z = 0.015;
  group.add(fold);
  return group;
}

function createGlasses() {
  const group = new THREE.Group();
  const frame = new THREE.MeshStandardMaterial({ color: 0x4d3a2c, roughness: 0.34, metalness: 0.42 });
  [-0.12, 0.12].forEach((x) => {
    const lens = new THREE.Mesh(new THREE.TorusGeometry(0.105, 0.018, 10, 24), frame);
    lens.position.x = x;
    group.add(lens);
  });
  const bridge = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.025, 0.022), frame);
  group.add(bridge);
  const arm = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.018, 0.018), frame);
  arm.position.set(0.22, 0, -0.08);
  arm.rotation.y = -0.32;
  group.add(arm);
  return group;
}

function createBookmark() {
  const group = new THREE.Group();
  const fabric = new THREE.Mesh(
    new THREE.BoxGeometry(0.12, 0.34, 0.014),
    new THREE.MeshStandardMaterial({ color: 0xa6473e, roughness: 0.72 })
  );
  group.add(fabric);
  const trim = new THREE.Mesh(
    new THREE.BoxGeometry(0.1, 0.025, 0.018),
    new THREE.MeshStandardMaterial({ color: 0xd6ad56, metalness: 0.42, roughness: 0.32 })
  );
  trim.position.y = 0.13;
  group.add(trim);
  const tassel = new THREE.Mesh(new THREE.SphereGeometry(0.035, 10, 8), new THREE.MeshStandardMaterial({ color: 0xd6ad56, roughness: 0.55 }));
  tassel.position.y = -0.21;
  group.add(tassel);
  return group;
}

export class MemoryItemSystem {
  private readonly items = new Map<MemoryItemId, THREE.Group>();
  private motion: MotionState | null = null;
  private revealed: { itemId: MemoryItemId; startedAt: number } | null = null;
  private completionTimer: number | null = null;

  constructor(private readonly scene: THREE.Scene, private readonly onObservationComplete: () => void) {
    this.items.set("key", createKey());
    this.items.set("phone", createPhone());
    this.items.set("letter", createLetter());
    this.items.set("glasses", createGlasses());
    this.items.set("bookmark", createBookmark());
    this.items.forEach((item) => {
      item.visible = false;
      item.traverse((node) => {
        const mesh = node as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
      });
      scene.add(item);
    });
  }

  observe(itemId: MemoryItemId, hidingPlaceId: HidingPlaceId) {
    this.reset();
    const item = this.items.get(itemId);
    if (!item) return;
    item.visible = true;
    item.position.copy(CUE_POSITION);
    item.rotation.set(0, 0, 0);
    item.scale.setScalar(1);
    this.motion = { itemId, hidingPlaceId, startedAt: performance.now(), complete: false };
  }

  reveal(itemId: MemoryItemId, hidingPlaceId: HidingPlaceId) {
    const item = this.items.get(itemId);
    if (!item) return;
    this.motion = null;
    item.visible = true;
    item.position.copy(HIDING_POSITIONS[hidingPlaceId]).add(new THREE.Vector3(0, 0.2, 0.14));
    item.rotation.set(0, 0, 0);
    item.scale.setScalar(1.1);
    this.revealed = { itemId, startedAt: performance.now() };
  }

  reset() {
    if (this.completionTimer !== null) {
      window.clearTimeout(this.completionTimer);
      this.completionTimer = null;
    }
    this.motion = null;
    this.revealed = null;
    this.items.forEach((item) => {
      item.visible = false;
    });
  }

  update() {
    const now = performance.now();
    if (this.motion) {
      const item = this.items.get(this.motion.itemId);
      const end = HIDING_POSITIONS[this.motion.hidingPlaceId];
      if (!item) return;
      const progress = Math.min((now - this.motion.startedAt) / 3600, 1);
      const eased = progress * progress * (3 - 2 * progress);
      const arc = Math.sin(progress * Math.PI) * 0.72;
      item.position.lerpVectors(CUE_POSITION, end, eased);
      item.position.y += arc;
      item.rotation.y = progress * Math.PI * 1.4;
      item.rotation.z = Math.sin(progress * Math.PI) * 0.14;
      item.scale.setScalar(1 + Math.sin(progress * Math.PI) * 0.12);
      if (progress >= 1 && !this.motion.complete) {
        this.motion.complete = true;
        this.completionTimer = window.setTimeout(() => {
          this.completionTimer = null;
          if (!this.motion?.complete) return;
          item.visible = false;
          this.motion = null;
          this.onObservationComplete();
        }, 700);
      }
    }

    if (this.revealed) {
      const item = this.items.get(this.revealed.itemId);
      if (!item) return;
      const elapsed = (now - this.revealed.startedAt) / 1000;
      item.position.y += Math.sin(elapsed * 2.4) * 0.002;
      item.rotation.y = Math.sin(elapsed * 1.2) * 0.12;
    }
  }

  dispose() {
    this.reset();
    this.items.forEach((item) => {
      this.scene.remove(item);
      item.traverse((node) => {
        const mesh = node as THREE.Mesh;
        mesh.geometry?.dispose();
        const material = mesh.material;
        if (Array.isArray(material)) material.forEach((entry) => entry.dispose());
        else material?.dispose();
      });
    });
    this.items.clear();
  }
}
