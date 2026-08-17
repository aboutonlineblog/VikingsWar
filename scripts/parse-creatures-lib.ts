import type { HuntingMaterialId } from '../shared/types';

export function snakeCase(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '');
}

export function parseRange(value: string): { min: number; max: number } {
  const [minRaw, maxRaw] = value.split('-').map((part) => part.trim());
  return { min: Number(minRaw), max: Number(maxRaw) };
}

const MATERIAL_MAP: Record<string, HuntingMaterialId> = {
  meat: 'meat',
  herbs: 'herbs',
  wood: 'wood',
  'iron plate': 'ironPlate',
  'bronze plate': 'bronzePlate',
  'silver plate': 'silverPlate',
  'gold plate': 'goldPlate',
};

export function parseMaterials(value: string): HuntingMaterialId[] {
  return value
    .split('/')
    .map((part) => part.trim().toLowerCase())
    .map((part) => MATERIAL_MAP[part])
    .filter((part): part is HuntingMaterialId => Boolean(part));
}
