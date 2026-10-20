// Si le code n'est pas listé ici, on génère quand même une machine valide.
export const MACHINES_DATA = {
  '45': {
    type: 'fossils',
    gridSize: 6,
    maxSelections: 4,
    targets: ['A3', 'E1', 'F3', 'E2'],
    info: 'Tu as retrouvé les 4 fossiles. Prends la carte 76.',
  },
  '75': {
    type: 'colors',
    values: {
      blue: 6,
      green: 2,
      red: 4,
      lightGreen: 1,
    },
    info: 'Bravo ! (Je voulais juste te faire souffrir un peu. ;)) Prends la carte C.',
  },
};

export function getMachineInfo(code) {
  const normalizedCode = String(code);
  if (!/^\d+$/.test(normalizedCode)) {
    return null;
  }

  return MACHINES_DATA[normalizedCode] || null;
}