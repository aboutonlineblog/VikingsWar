import { parseMaterials, parseRange, snakeCase } from './parse-creatures-lib';

describe('parse-creatures helpers', () => {
  it('parses numeric ranges', () => {
    expect(parseRange('22-50')).toEqual({ min: 22, max: 50 });
    expect(parseRange('0-0')).toEqual({ min: 0, max: 0 });
  });

  it('normalizes material pools', () => {
    expect(parseMaterials('Meat / Herbs / Wood')).toEqual(['meat', 'herbs', 'wood']);
    expect(parseMaterials('Meat / Herbs / Wood / Iron Plate / Gold Plate')).toEqual([
      'meat',
      'herbs',
      'wood',
      'ironPlate',
      'goldPlate',
    ]);
  });

  it('creates stable snake_case ids', () => {
    expect(snakeCase('Armored Frost Goblin')).toBe('armored_frost_goblin');
    expect(snakeCase('White-Tailed Eagle')).toBe('white_tailed_eagle');
  });
});
