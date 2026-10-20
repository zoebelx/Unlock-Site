// Base de données des codes à 4 chiffres
export const CODES_DATA = {
  '5446': { // Note : J'ai laissé les clés telles quelles, mais vérifie si '5444' ou '5446' est la bonne selon ta logique
    info: 'Félicitations ! Vous avez trouvé où était la glacière et qui l’a volée. Prenez la carte F.',
  },
  '6544': {
    info: 'Vous déverrouillez la porte du fleuriste et trouvez le corps de la fleuriste morte avec des pétales partout et un dernier post-it sur son corps. Prenez les cartes 56 et la goutte de sang.',
  },
  '1807': {
    info: 'Bienvenue dans le carnet secret (de cuisine de Mathilde) ! Prenez la carte 71.',
  },
  '4556': {
    info: 'Vous voilà enfin dans le frigo (Pourquoi Mathilde avait-elle mis un code...). Prenez la carte 81 (et reposez-vous un peu).',
  },
};

export function getCodeInfo(code) {
  return CODES_DATA[String(code)] || null;
}