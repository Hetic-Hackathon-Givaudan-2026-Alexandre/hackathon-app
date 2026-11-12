'use client';

import { useEffect, useRef, useState } from 'react';
import { PAYS } from '@/lib/pays';

export interface PointGlobe {
  pays: string;
  /** Intensité de 0 à 1 : taille et éclat du point */
  intensite: number;
}

export interface EtiquetteGlobe {
  pays: string;
  titre: string;
  sousTitre: string;
}

/** Position (rayon 1) d'une latitude / longitude, alignée sur la texture NASA. */
function position(lat: number, lng: number, rayon = 1) {
  const polaire = ((90 - lat) * Math.PI) / 180;
  const theta = ((lng + 180) * Math.PI) / 180;
  return {
    x: -rayon * Math.sin(polaire) * Math.cos(theta),
    y: rayon * Math.cos(polaire),
    z: rayon * Math.sin(polaire) * Math.sin(theta),
  };
}

/**
 * Terre réaliste (Three.js, textures NASA Visible Earth du dossier public/textures) :
 * nuages, atmosphère, un point lumineux par pays où une tendance monte et des
 * arcs depuis le pays d'origine. Tourne lentement, se fait glisser à la souris.
 * Design repris de la maquette Product (voir docs/adr/0007).
 */
export default function Globe({
  points,
  arcsDepuis,
  etiquettes = [],
  centre = 'JP',
  className = '',
}: {
  points: PointGlobe[];
  arcsDepuis?: string;
  etiquettes?: EtiquetteGlobe[];
  centre?: string;
  className?: string;
}) {
  const conteneur = useRef<HTMLDivElement>(null);
  const refsEtiquettes = useRef<(HTMLDivElement | null)[]>([]);
  const [indisponible, setIndisponible] = useState(false);

  useEffect(() => {
    const el = conteneur.current;
    if (!el) return;
    let arrete = false;
    let nettoyer = () => {};

    import('three').then((THREE) => {
      if (arrete) return;
      let renderer: InstanceType<typeof THREE.WebGLRenderer>;
      try {
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      } catch {
        setIndisponible(true);
        return;
      }
      const reduit = window.matchMedia(
        '(prefers-reduced-motion: reduce)',
      ).matches;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      el.appendChild(renderer.domElement);
      renderer.domElement.style.display = 'block';

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
      camera.position.set(0, 0, 4.1);

      // Lumière : un soleil en haut à gauche, comme sur la maquette
      scene.add(new THREE.AmbientLight(0x6f86b8, 0.55));
      const soleil = new THREE.DirectionalLight(0xffffff, 2.4);
      soleil.position.set(-3, 2, 4);
      scene.add(soleil);

      const terre = new THREE.Group();
      scene.add(terre);

      const chargeur = new THREE.TextureLoader();
      const jour = chargeur.load('/textures/terre-jour.jpg');
      jour.colorSpace = THREE.SRGBColorSpace;
      jour.anisotropy = renderer.capabilities.getMaxAnisotropy();
      const relief = chargeur.load('/textures/relief.jpg');
      const nuages = chargeur.load('/textures/nuages.jpg');

      terre.add(
        new THREE.Mesh(
          new THREE.SphereGeometry(1, 96, 96),
          new THREE.MeshPhongMaterial({
            map: jour,
            bumpMap: relief,
            bumpScale: 4,
            specular: new THREE.Color(0x1a2a44),
            shininess: 14,
          }),
        ),
      );

      const coucheNuages = new THREE.Mesh(
        new THREE.SphereGeometry(1.012, 96, 96),
        new THREE.MeshPhongMaterial({
          color: 0xffffff,
          alphaMap: nuages,
          transparent: true,
          opacity: 0.55,
          depthWrite: false,
        }),
      );
      terre.add(coucheNuages);

      // Atmosphère : halo bleu sur le bord (effet de Fresnel)
      scene.add(
        new THREE.Mesh(
          new THREE.SphereGeometry(1.16, 64, 64),
          new THREE.ShaderMaterial({
            vertexShader: `varying vec3 vN;
              void main(){ vN = normalize(normalMatrix * normal);
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
            fragmentShader: `varying vec3 vN;
              void main(){ float i = pow(0.72 - dot(vN, vec3(0.0,0.0,1.0)), 3.2);
              gl_FragColor = vec4(0.32,0.62,1.0,1.0) * i; }`,
            side: THREE.BackSide,
            blending: THREE.AdditiveBlending,
            transparent: true,
            depthWrite: false,
          }),
        ),
      );

      // Point lumineux : texture dessinée une fois sur un canvas
      const toile = document.createElement('canvas');
      toile.width = toile.height = 128;
      const ctx = toile.getContext('2d')!;
      const degrade = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
      degrade.addColorStop(0, 'rgba(255,255,255,1)');
      degrade.addColorStop(0.18, 'rgba(255,255,255,0.95)');
      degrade.addColorStop(0.35, 'rgba(160,240,110,0.45)');
      degrade.addColorStop(1, 'rgba(160,240,110,0)');
      ctx.fillStyle = degrade;
      ctx.fillRect(0, 0, 128, 128);
      const texturePoint = new THREE.CanvasTexture(toile);

      const anneaux: {
        sprite: InstanceType<typeof THREE.Sprite>;
        base: number;
        dec: number;
      }[] = [];
      const ancres = new Map<string, InstanceType<typeof THREE.Vector3>>();
      points.forEach((p, i) => {
        const c = PAYS[p.pays];
        if (!c) return;
        const pos = position(c.lat, c.lng, 1.015);
        const v = new THREE.Vector3(pos.x, pos.y, pos.z);
        ancres.set(p.pays, v);
        const taille = 0.05 + p.intensite * 0.07;
        const coeur = new THREE.Sprite(
          new THREE.SpriteMaterial({
            map: texturePoint,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            transparent: true,
          }),
        );
        coeur.position.copy(v);
        coeur.scale.setScalar(taille);
        terre.add(coeur);
        // Halo qui pulse autour des pays les plus actifs
        if (p.intensite > 0.6) {
          const halo = new THREE.Sprite(
            new THREE.SpriteMaterial({
              map: texturePoint,
              color: 0x8fe34f,
              blending: THREE.AdditiveBlending,
              depthWrite: false,
              transparent: true,
              opacity: 0.5,
            }),
          );
          halo.position.copy(v);
          terre.add(halo);
          anneaux.push({ sprite: halo, base: taille * 2.2, dec: i });
        }
      });

      // Arcs depuis le pays d'origine
      const origine = arcsDepuis ? ancres.get(arcsDepuis) : undefined;
      if (origine) {
        for (const [pays, cible] of ancres) {
          if (pays === arcsDepuis) continue;
          const milieu = origine
            .clone()
            .add(cible)
            .multiplyScalar(0.5)
            .normalize()
            .multiplyScalar(1.15 + origine.distanceTo(cible) * 0.25);
          const courbe = new THREE.QuadraticBezierCurve3(
            origine,
            milieu,
            cible,
          );
          terre.add(
            new THREE.Line(
              new THREE.BufferGeometry().setFromPoints(courbe.getPoints(64)),
              new THREE.LineBasicMaterial({
                color: 0x8fe34f,
                transparent: true,
                opacity: 0.75,
              }),
            ),
          );
        }
      }

      // Orientation de départ : le pays « centre » face à nous
      const c = PAYS[centre] ?? PAYS.JP;
      const theta = ((c.lng + 180) * Math.PI) / 180;
      let rotationY = Math.PI / 2 - theta;
      terre.rotation.x = Math.max(-0.3, Math.min(0.5, (c.lat * Math.PI) / 360));
      let glisse: { x: number; depart: number } | null = null;

      const redimensionner = () => {
        const l = el.clientWidth;
        const h = el.clientHeight;
        renderer.setSize(l, h, false);
        renderer.domElement.style.width = '100%';
        renderer.domElement.style.height = '100%';
        camera.aspect = l / h;
        camera.updateProjectionMatrix();
      };
      redimensionner();
      const observateur = new ResizeObserver(redimensionner);
      observateur.observe(el);

      const baisser = (e: PointerEvent) => {
        glisse = { x: e.clientX, depart: rotationY };
      };
      const bouger = (e: PointerEvent) => {
        if (glisse) rotationY = glisse.depart + (e.clientX - glisse.x) / 250;
      };
      const lever = () => (glisse = null);
      renderer.domElement.addEventListener('pointerdown', baisser);
      window.addEventListener('pointermove', bouger);
      window.addEventListener('pointerup', lever);

      const temp = new THREE.Vector3();
      const normale = new THREE.Vector3();
      let image = 0;
      const horloge = new THREE.Clock();
      const animer = () => {
        const t = horloge.getElapsedTime();
        if (!glisse && !reduit) rotationY += 0.0012;
        terre.rotation.y = rotationY;
        coucheNuages.rotation.y += reduit ? 0 : 0.0002;
        for (const a of anneaux) {
          const k = (((t * 0.6 + a.dec * 0.37) % 1) + 1) % 1;
          a.sprite.scale.setScalar(a.base * (0.6 + k));
          (
            a.sprite.material as InstanceType<typeof THREE.SpriteMaterial>
          ).opacity = 0.55 * (1 - k);
        }
        renderer.render(scene, camera);

        // Étiquettes HTML accrochées aux points, masquées derrière la Terre
        etiquettes.forEach((e, i) => {
          const div = refsEtiquettes.current[i];
          const ancre = ancres.get(e.pays);
          if (!div || !ancre) return;
          temp.copy(ancre).applyMatrix4(terre.matrixWorld);
          normale.copy(temp).normalize();
          const visible =
            normale.dot(camera.position.clone().normalize()) > 0.25;
          temp.project(camera);
          div.style.transform = `translate(${((temp.x + 1) / 2) * el.clientWidth}px, ${((1 - temp.y) / 2) * el.clientHeight}px) translate(-50%, calc(-100% - 14px))`;
          div.style.opacity = visible ? '1' : '0';
        });
        image = requestAnimationFrame(animer);
      };
      animer();

      nettoyer = () => {
        cancelAnimationFrame(image);
        observateur.disconnect();
        window.removeEventListener('pointermove', bouger);
        window.removeEventListener('pointerup', lever);
        renderer.dispose();
        scene.traverse((o) => {
          const m = o as unknown as {
            geometry?: { dispose: () => void };
            material?: { dispose: () => void };
          };
          m.geometry?.dispose();
          m.material?.dispose();
        });
        renderer.domElement.remove();
      };
    });

    return () => {
      arrete = true;
      nettoyer();
    };
  }, [points, arcsDepuis, centre, etiquettes]);

  return (
    <div
      ref={conteneur}
      role="img"
      aria-label="Globe des pays où les tendances montent. Glissez pour le faire tourner."
      className={`relative aspect-square w-full cursor-grab touch-pan-y active:cursor-grabbing ${className}`}
    >
      {indisponible && (
        <p className="absolute inset-0 flex items-center justify-center text-sm text-brume">
          Le globe 3D nécessite l&apos;accélération graphique du navigateur.
        </p>
      )}
      {etiquettes.map((e, i) => (
        <div
          key={e.pays}
          ref={(d) => {
            refsEtiquettes.current[i] = d;
          }}
          className="pointer-events-none absolute top-0 left-0 flex items-center gap-2 rounded-full border border-bord bg-nuit/85 px-3 py-1.5 text-sm whitespace-nowrap opacity-0 backdrop-blur transition-opacity duration-500"
        >
          <span className="h-2 w-2 rounded-full bg-lueur shadow-[0_0_10px_var(--color-lueur)]" />
          <span className="font-medium">{e.titre}</span>
          <span className="text-brume">{e.sousTitre}</span>
        </div>
      ))}
    </div>
  );
}
