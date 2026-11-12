'use client';

import createGlobe from 'cobe';
import { useEffect, useRef } from 'react';
import { PAYS } from '@/lib/pays';

export interface PointGlobe {
  pays: string;
  /** Intensité de 0 à 1 : taille du point */
  intensite: number;
}

export interface EtiquetteGlobe {
  pays: string;
  titre: string;
  sousTitre: string;
}

/** Angles cobe pour centrer le globe sur une latitude / longitude. */
function angles(lat: number, lng: number) {
  return [
    Math.PI - ((lng * Math.PI) / 180 - Math.PI / 2),
    (lat * Math.PI) / 180,
  ];
}

/**
 * Globe 3D (WebGL, bibliothèque cobe) : un point vert par pays où une
 * tendance monte, des arcs depuis le pays d'origine. Tourne lentement,
 * se fait glisser à la souris ou au doigt.
 */
export default function Globe({
  points,
  arcsDepuis,
  etiquettes = [],
  centre = 'JP',
  className = '',
}: {
  points: PointGlobe[];
  /** Pays d'origine : des arcs partent de lui vers les autres points */
  arcsDepuis?: string;
  etiquettes?: EtiquetteGlobe[];
  centre?: string;
  className?: string;
}) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const glisse = useRef<{ x: number; delta: number } | null>(null);
  const decalage = useRef(0);

  useEffect(() => {
    const el = canvas.current;
    if (!el) return;
    const reduit = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    const c = PAYS[centre] ?? PAYS.JP;
    const depart = angles(c.lat, c.lng);
    let phi = depart[0];
    const theta = Math.max(0.15, Math.min(0.5, depart[1]));
    let largeur = el.offsetWidth;

    const origine = arcsDepuis ? PAYS[arcsDepuis] : undefined;
    const globe = createGlobe(el, {
      devicePixelRatio: Math.min(window.devicePixelRatio, 2),
      width: largeur * 2,
      height: largeur * 2,
      phi,
      theta,
      dark: 1,
      diffuse: 1.4,
      mapSamples: 20000,
      mapBrightness: 5,
      baseColor: [0.09, 0.16, 0.26],
      markerColor: [0.56, 0.89, 0.31],
      glowColor: [0.12, 0.3, 0.55],
      markers: points
        .filter((p) => PAYS[p.pays])
        .map((p) => ({
          location: [PAYS[p.pays].lat, PAYS[p.pays].lng] as [number, number],
          size: 0.025 + p.intensite * 0.04,
          id: p.pays,
        })),
      arcs: origine
        ? points
            .filter((p) => p.pays !== arcsDepuis && PAYS[p.pays])
            .map((p) => ({
              from: [origine.lat, origine.lng] as [number, number],
              to: [PAYS[p.pays].lat, PAYS[p.pays].lng] as [number, number],
            }))
        : [],
      arcColor: [0.56, 0.89, 0.31],
      arcWidth: 0.6,
      arcHeight: 0.25,
    });

    // Boucle d'animation : rotation lente, sauf pendant un glisser
    let image = 0;
    const animer = () => {
      if (!glisse.current && !reduit) phi += 0.0018;
      globe.update({
        phi: phi + decalage.current,
        theta,
        width: largeur * 2,
        height: largeur * 2,
      });
      image = requestAnimationFrame(animer);
    };
    image = requestAnimationFrame(animer);

    const redimensionner = () => {
      largeur = el.offsetWidth;
    };
    window.addEventListener('resize', redimensionner);
    return () => {
      cancelAnimationFrame(image);
      globe.destroy();
      window.removeEventListener('resize', redimensionner);
    };
  }, [points, arcsDepuis, centre]);

  return (
    <div className={`relative aspect-square w-full ${className}`}>
      <canvas
        ref={canvas}
        aria-label="Globe des pays où les tendances montent"
        role="img"
        className="h-full w-full cursor-grab active:cursor-grabbing"
        onPointerDown={(e) => {
          glisse.current = { x: e.clientX, delta: decalage.current };
        }}
        onPointerUp={() => (glisse.current = null)}
        onPointerOut={() => (glisse.current = null)}
        onPointerMove={(e) => {
          if (glisse.current) {
            decalage.current =
              glisse.current.delta + (e.clientX - glisse.current.x) / 200;
          }
        }}
      />
      {etiquettes.map((e) => (
        <div
          key={e.pays}
          className="etiquette-globe flex border border-bord bg-nuit/90 items-center gap-2 rounded-full px-3 py-1.5 text-sm whitespace-nowrap"
          style={
            {
              positionAnchor: `--cobe-${e.pays}`,
              opacity: `var(--cobe-visible-${e.pays}, 0)`,
            } as React.CSSProperties
          }
        >
          <span className="h-2 w-2 rounded-full bg-lueur shadow-[0_0_10px_var(--color-lueur)]" />
          <span className="font-medium">{e.titre}</span>
          <span className="text-brume">{e.sousTitre}</span>
        </div>
      ))}
    </div>
  );
}
