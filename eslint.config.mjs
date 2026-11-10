// @ts-check
import eslint from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import prettier from 'eslint-config-prettier/flat';
import tseslint from 'typescript-eslint';

export default defineConfig(
  // .next : build généré par Next.js ; next-env.d.ts : fichier généré
  // db/data et .venv : réservés si une base ou un notebook Python sont ajoutés
  globalIgnores([
    '**/.next/',
    '**/dist/',
    'next-env.d.ts',
    'db/data/',
    '**/.venv/',
  ]),
  eslint.configs.recommended,
  tseslint.configs.recommended,
  // Désactive les règles de forme : c'est le travail de Prettier
  prettier,
);
