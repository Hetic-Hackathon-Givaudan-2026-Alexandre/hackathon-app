'use client';

import { useSyncExternalStore } from 'react';

/**
 * Tendances suivies par Camille, stockées dans le navigateur (pas de compte).
 * Au premier passage, le prototype simule deux tendances déjà suivies.
 */
const CLE = 'tendances-suivies';
const PAR_DEFAUT = ['yuzu', 'matcha'];
const VIDE: string[] = [];
let cache: { brut: string | null; ids: string[] } | null = null;

function lire(): string[] {
  try {
    const brut = window.localStorage.getItem(CLE);
    if (cache && cache.brut === brut) return cache.ids;
    const ids = brut === null ? PAR_DEFAUT : (JSON.parse(brut) as string[]);
    cache = { brut, ids };
    return ids;
  } catch {
    return PAR_DEFAUT;
  }
}

function ecrire(ids: string[]) {
  try {
    window.localStorage.setItem(CLE, JSON.stringify(ids));
  } catch {
    // Stockage indisponible (navigation privée) : le suivi reste en mémoire
    cache = { brut: JSON.stringify(ids), ids };
  }
  window.dispatchEvent(new Event(CLE));
}

function abonner(rappel: () => void) {
  window.addEventListener(CLE, rappel);
  window.addEventListener('storage', rappel);
  return () => {
    window.removeEventListener(CLE, rappel);
    window.removeEventListener('storage', rappel);
  };
}

export function useSuivies() {
  const ids = useSyncExternalStore(abonner, lire, () => VIDE);
  const basculer = (id: string) =>
    ecrire(ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]);
  return { ids, basculer };
}
