"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import styles from "./TherapeuticTeaRoom.module.css";
import { AudioManager } from "./AudioManager";
import { CameraController } from "./CameraController";
import { InteractionSystem } from "./InteractionSystem";
import { createBasket } from "./objects/Basket";
import { createCup } from "./objects/Cup";
import { createKettle } from "./objects/Kettle";
import { createPhoto } from "./objects/Photo";
import { createPlant } from "./objects/Plant";
import { createRadio } from "./objects/Radio";
import { createWindow } from "./objects/Window";
import { shadow, woodMaterial } from "./objects/shared";
import { InteractiveSceneObject, WorldCallbacks } from "./types";

type GameWorldProps = WorldCallbacks & {
  audio: AudioManager;
  sessionActive: boolean;
  reducedMotion: boolean;
};

function addRoom(scene: THREE.Scene) {
  const floorMaterial = woodMaterial(0x8d6847);
  const floor = shadow(new THREE.Mesh(new THREE.BoxGeometry(9.2, 0.16, 7.2), floorMaterial));
  floor.position.y = -0.08;
  scene.add(floor);

  const seamMaterial = new THREE.MeshStandardMaterial({ color: 0x5e432e, roughness: 0.95 });
  for (let index = -4; index <= 4; index += 1) {
    const seam = new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.01, 7.05), seamMaterial);
    seam.position.set(index + 0.1, 0.01, 0);
    scene.add(seam);
  }

  const wallMaterial = new THREE.MeshStandardMaterial({ color: 0xd7c7a7, roughness: 0.92 });
  const backWallParts = [
    [-2.55, 2.1, 3.75, 4.2],
    [3.15, 2.1, 2.65, 4.2],
    [0.35, 0.8, 2.8, 1.5],
    [0.35, 3.58, 2.8, 1.0],
  ] as const;
  backWallParts.forEach(([x, y, width, height]) => {
    const panel = shadow(new THREE.Mesh(new THREE.BoxGeometry(width, height, 0.13), wallMaterial));
    panel.position.set(x, y, -3.5);
    scene.add(panel);
  });

  const sideWall = shadow(new THREE.Mesh(new THREE.BoxGeometry(0.13, 4.2, 7.2), wallMaterial));
  sideWall.position.set(-4.53, 2.1, 0);
  scene.add(sideWall);

  const wallTrim = woodMaterial(0x705037);
  [
    [-4.39, 2.3, 0],
    [4.39, 2.3, 0],
    [-0.98, 3.26, -3.41],
    [1.68, 3.26, -3.41],
  ].forEach(([x, y, z]) => {
    const beam = shadow(new THREE.Mesh(new THREE.BoxGeometry(0.12, 3.8, 0.12), wallTrim));
    beam.position.set(x, y, z);
    scene.add(beam);
  });

  const table = new THREE.Group();
  table.position.set(1.05, 0, 0.35);
  const tableTop = shadow(new THREE.Mesh(new THREE.BoxGeometry(2.45, 0.16, 1.34), woodMaterial(0x70492d)));
  tableTop.position.y = 1;
  table.add(tableTop);
  [[-1, -0.48], [1, -0.48], [-1, 0.48], [1, 0.48]].forEach(([x, z]) => {
    const leg = shadow(new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.09, 1, 12), woodMaterial(0x593821)));
    leg.position.set(x, 0.48, z);
    table.add(leg);
  });
  const tableLip = shadow(new THREE.Mesh(new THREE.BoxGeometry(2.18, 0.12, 0.08), woodMaterial(0x4d311e)));
  tableLip.position.set(0, 0.82, 0.58);
  table.add(tableLip);
  scene.add(table);

  const chair = new THREE.Group();
  chair.position.set(-1.38, 0, 0.78);
  chair.rotation.y = 0.18;
  const chairMaterial = woodMaterial(0x785034);
  const seat = shadow(new THREE.Mesh(new THREE.BoxGeometry(1.05, 0.12, 0.92), chairMaterial));
  seat.position.y = 0.63;
  chair.add(seat);
  const wovenSeat = new THREE.Mesh(new THREE.BoxGeometry(0.88, 0.035, 0.72), new THREE.MeshStandardMaterial({ color: 0xbe964e, roughness: 0.96 }));
  wovenSeat.position.y = 0.71;
  chair.add(wovenSeat);
  const back = shadow(new THREE.Mesh(new THREE.BoxGeometry(1.05, 0.76, 0.1), chairMaterial));
  back.position.set(0, 1.14, -0.38);
  chair.add(back);
  [[-0.42, -0.34], [0.42, -0.34], [-0.42, 0.34], [0.42, 0.34]].forEach(([x, z]) => {
    const leg = shadow(new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.06, 0.65, 10), chairMaterial));
    leg.position.set(x, 0.31, z);
    chair.add(leg);
  });
  scene.add(chair);

  const shelf = new THREE.Group();
  shelf.position.set(-2.42, 1.47, -3.03);
  const shelfMaterial = woodMaterial(0x624129);
  const shelfBack = shadow(new THREE.Mesh(new THREE.BoxGeometry(1.9, 1.75, 0.15), shelfMaterial));
  shelfBack.position.y = 0.8;
  shelf.add(shelfBack);
  [0.15, 0.83, 1.5].forEach((height) => {
    const plank = shadow(new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.09, 0.46), shelfMaterial));
    plank.position.set(0, height, 0.2);
    shelf.add(plank);
  });
  [[-0.82, 0.78], [0.82, 0.78]].forEach(([x, y]) => {
    const upright = shadow(new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.72, 0.48), shelfMaterial));
    upright.position.set(x, y, 0.19);
    shelf.add(upright);
  });
  const books = [0x9c3e37, 0x537066, 0xb8843c];
  books.forEach((color, index) => {
    const book = shadow(new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.42 + index * 0.04, 0.28), new THREE.MeshStandardMaterial({ color, roughness: 0.78 })));
    book.position.set(0.38 + index * 0.17, 1.27, 0.32);
    shelf.add(book);
  });
  scene.add(shelf);

  const outdoorGround = new THREE.Mesh(
    new THREE.PlaneGeometry(17, 7),
    new THREE.MeshStandardMaterial({ color: 0x6f9566, roughness: 1 })
  );
  outdoorGround.position.set(0.35, -0.1, -5.1);
  outdoorGround.rotation.x = -Math.PI / 2;
  scene.add(outdoorGround);
  const hillMaterial = new THREE.MeshStandardMaterial({ color: 0x547b55, roughness: 1 });
  [-2.6, -1.1, 0.5, 2.1, 3.4].forEach((x, index) => {
    const hill = new THREE.Mesh(new THREE.SphereGeometry(1.4 + (index % 2) * 0.3, 24, 12), hillMaterial);
    hill.scale.set(1.3, 0.45, 0.52);
    hill.position.set(x, 0.45 + (index % 2) * 0.1, -5.8);
    scene.add(hill);
  });
  const foliageMaterial = new THREE.MeshStandardMaterial({ color: 0x355d3d, roughness: 0.9 });
  [-2.8, -1.75, 2.15, 3.1].forEach((x, index) => {
    const tree = new THREE.Group();
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 0.7, 8), woodMaterial(0x5f422c));
    trunk.position.y = 0.35;
    tree.add(trunk);
    const crown = new THREE.Mesh(new THREE.SphereGeometry(0.38 + (index % 2) * 0.09, 16, 10), foliageMaterial);
    crown.scale.set(1, 1.3, 0.78);
    crown.position.y = 0.92;
    tree.add(crown);
    tree.position.set(x, 0, -4.7 - (index % 2) * 0.35);
    scene.add(tree);
  });
}

function addLighting(scene: THREE.Scene) {
  scene.add(new THREE.HemisphereLight(0xf6e7c5, 0x49654c, 1.65));
  const sun = new THREE.DirectionalLight(0xffedc6, 2.6);
  sun.position.set(2.8, 6.4, 3.5);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  sun.shadow.camera.left = -6;
  sun.shadow.camera.right = 6;
  sun.shadow.camera.top = 6;
  sun.shadow.camera.bottom = -4;
  sun.shadow.bias = -0.0003;
  scene.add(sun);

  const warmLamp = new THREE.PointLight(0xf1b86e, 1.3, 6, 2);
  warmLamp.position.set(-2.6, 2.8, 0.8);
  scene.add(warmLamp);
}

export default function GameWorld({ audio, sessionActive, reducedMotion, onInteraction, onHoverChange, onWebGLFailure }: GameWorldProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef(sessionActive);

  useEffect(() => {
    activeRef.current = sessionActive;
    if (!sessionActive) onHoverChange(null);
  }, [onHoverChange, sessionActive]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "high-performance" });
    } catch {
      onWebGLFailure();
      return;
    }

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x9eb7a0);
    scene.fog = new THREE.Fog(0x9eb7a0, 9.5, 18);
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 30);
    const controller = new CameraController(camera, reducedMotion);
    const interactions = new InteractionSystem();
    const interactiveObjects: InteractiveSceneObject[] = [
      createKettle(),
      createCup(),
      createRadio(),
      createPhoto(),
      createBasket(),
      createWindow(),
      createPlant(),
    ];

    addRoom(scene);
    addLighting(scene);
    interactiveObjects.forEach((sceneObject) => {
      interactions.register(sceneObject);
      scene.add(sceneObject.root);
    });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
    renderer.setSize(host.clientWidth, host.clientHeight, false);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.className = "therapeutic-tea-room-canvas";
    host.appendChild(renderer.domElement);

    const resize = () => {
      const width = host.clientWidth;
      const height = host.clientHeight;
      if (!width || !height) return;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);

    let pointerStart: { x: number; y: number } | null = null;
    let dragging = false;
    let lastActivationAt = 0;
    const activateInteraction = (event: MouseEvent | PointerEvent) => {
      if (!activeRef.current || Date.now() - lastActivationAt < 80) return;
      const response = interactions.activateAt(event as PointerEvent, renderer.domElement, camera);
      if (!response) return;
      lastActivationAt = Date.now();
      if (response.objectId === "kettle") audio.playKettle();
      if (response.objectId === "cup") audio.playCup();
      if (response.objectId === "basket") audio.playBasket();
      if (response.objectId === "photo") audio.playPhoto();
      if (response.objectId === "plant") audio.playPlant();
      if (response.objectId === "window") {
        audio.playWindow();
        audio.setOutdoorPresence(Boolean(response.active));
      }
      if (response.objectId === "radio") audio.toggleRadio(Boolean(response.active));
      onInteraction(response);
    };
    const onPointerDown = (event: PointerEvent) => {
      if (!activeRef.current) return;
      void audio.start();
      pointerStart = { x: event.clientX, y: event.clientY };
      dragging = false;
      renderer.domElement.setPointerCapture(event.pointerId);
    };
    const onPointerMove = (event: PointerEvent) => {
      if (!activeRef.current) return;
      if (pointerStart) {
        const deltaX = event.clientX - pointerStart.x;
        const deltaY = event.clientY - pointerStart.y;
        if (Math.abs(deltaX) + Math.abs(deltaY) > 5) dragging = true;
        if (dragging) {
          controller.drag(deltaX, deltaY);
          pointerStart = { x: event.clientX, y: event.clientY };
          interactions.clearHover();
          onHoverChange(null);
          return;
        }
      }
      const hit = interactions.updatePointer(event, renderer.domElement, camera);
      onHoverChange(hit?.label ?? null);
    };
    const onPointerUp = (event: PointerEvent) => {
      if (!activeRef.current) return;
      if (!dragging) {
        activateInteraction(event);
      }
      pointerStart = null;
      dragging = false;
    };
    const onClick = (event: MouseEvent) => activateInteraction(event);
    const onPointerLeave = () => {
      if (!pointerStart) {
        interactions.clearHover();
        onHoverChange(null);
      }
    };
    renderer.domElement.addEventListener("pointerdown", onPointerDown);
    renderer.domElement.addEventListener("pointermove", onPointerMove);
    renderer.domElement.addEventListener("pointerup", onPointerUp);
    renderer.domElement.addEventListener("click", onClick);
    renderer.domElement.addEventListener("pointerleave", onPointerLeave);

    const clock = new THREE.Clock();
    let frameId = 0;
    const render = () => {
      const delta = Math.min(clock.getDelta(), 0.05);
      const elapsed = clock.elapsedTime;
      controller.update(delta);
      interactiveObjects.forEach((sceneObject) => sceneObject.update(elapsed, delta));
      renderer.render(scene, camera);
      frameId = window.requestAnimationFrame(render);
    };
    render();

    return () => {
      window.cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      renderer.domElement.removeEventListener("pointerdown", onPointerDown);
      renderer.domElement.removeEventListener("pointermove", onPointerMove);
      renderer.domElement.removeEventListener("pointerup", onPointerUp);
      renderer.domElement.removeEventListener("click", onClick);
      renderer.domElement.removeEventListener("pointerleave", onPointerLeave);
      interactions.clearHover();
      interactiveObjects.forEach((sceneObject) => sceneObject.dispose?.());
      scene.traverse((object) => {
        const mesh = object as THREE.Mesh;
        mesh.geometry?.dispose();
        const material = mesh.material;
        if (Array.isArray(material)) material.forEach((item) => item.dispose());
        else material?.dispose();
      });
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [audio, onHoverChange, onInteraction, onWebGLFailure, reducedMotion]);

  return <div ref={hostRef} className={styles.worldHost} aria-label="A calm Northeast Indian-inspired home environment" />;
}
