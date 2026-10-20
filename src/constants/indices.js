// Base de données des indices par numéro
export const INDICES_DATA = {
  54: {
    indice_1: 'La porte du garage est fermée ?',
    indice_2: 'Un effet de symétrie se trouve dans ce garage.',
    indice_3: 'Regarde bien la porte du garage et mets une carte au milieu.',
  },
  56: {
    indice_1: 'Il faut une position et deux personnes.',
    indice_2: 'Les deux personnes sont liées aux pétales.',
    indice_3: 'Une position, une carte, des symboles qui se relient.',
  },
  60: {
    indice_1: "N'y a-t-il pas 2 vélos ?",
  },
  6: {
    indice_1: 'Il y a une couleur sur son nom ?', 
  },
  4: {
    indice_1: 'Il y a une couleur sur son nom ?', 
  },
  5: {
    indice_1: 'Il y a une couleur sur son nom ?', 
  },
  7: {
    indice_1: 'Elles adorent faire quelque chose.', 
  },
  58: {
    indice_1: "C'est pas bientôt son anniv' ?",
    indice_2: 'Regarde le calendrier. ;)',
  },
  71: {
    indice_1: 'Un insecte léger ?',
  },
  33: {
    indice_1: 'Ce post-it, des balances...',
    indice_2: 'Ne faudrait-il pas classer les insectes par poids ?',
  },
  51: {
    indice_1: 'Les V ressemblent étrangement à quelque chose.',
  },
  48: {
    indice_1: 'Les pétales ont des couleurs différentes.',
  },
  52: {
    indice_1: 'Les pétales ont des couleurs différentes.',
  },
  76: {
    indice_1: 'Les pétales ont des couleurs différentes.',
  },
  53: {
    indice_1: 'Les pétales ont des couleurs différentes.',
  },
  10: {
    indice_1: "Elles s'assemblent étrangement bien, ces balances.",
  },
  75: {
    indice_1: 'Bon honnêtement, là, bon courage ! ;)',
  },
  2: {
    indice_1: 'Il y a une couleur sur son nom ?',
  },
  23: {
    indice_1: 'Ne faudrait-il pas faire un lien avec une personne ?',
  },
  99: {
    indice_1: "Bah c'est bien une nouvelle canette, non ? ;)",
  },
  45: {
    indice_1: 'Regarde bien le dos des cartes.',
    indice_2: "C'est comme si c'était un domino.",
  },
  61: {
    indice_1: 'Il y a une police qui ressemble beaucoup aux numéros au dos des cartes.',
    indice_2: "N'y aurait-il pas l'anniversaire de deux personnes sur ce frigo ?",
  },
  67: {
    indice_1: 'Regarde bien la rivière.',
  },
  79: {
    indice_1: 'Les pots de fleurs sont d’une couleur différente.',
  },
};

export function getIndiceLevelIndices(number) {
  const numStr = String(number).padStart(3, '0');
  const num = parseInt(numStr);
  
  if (INDICES_DATA[num]) {
    return Object.values(INDICES_DATA[num]);
  }
  return null;
}