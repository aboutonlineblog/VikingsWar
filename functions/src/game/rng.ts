export interface Rng {
  next(): number;
}

export function createRng(seed: number): Rng {
  let state = seed >>> 0;
  if (state === 0) {
    state = 0x9e3779b9;
  }
  return {
    next(): number {
      state = (Math.imul(1664525, state) + 1013904223) >>> 0;
      return state / 0x100000000;
    },
  };
}

export function createRandomRng(): Rng {
  return {
    next(): number {
      return Math.random();
    },
  };
}
