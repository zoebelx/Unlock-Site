import React, { useState } from 'react';
import './App.css';
import { SelectionScreen } from '../components/Selection/Selection';
import { GameScreen } from '../components/GameScreen/GameScreen';
import AccueilHero from '../components/AccueilHero';

// Composant principal de l'application
export default function App() {
  // État pour savoir quel écran afficher ('selection' ou 'game')
  const [ecranActuel, setEcranActuel] = useState('selection');
  // État pour stocker l'aventure sélectionnée
  const [aventureSelectionnee, setAventureSelectionnee] = useState(null);

  // Fonction appelée quand on démarre une aventure
  const demarrerAventure = (aventure) => {
    setAventureSelectionnee(aventure);
    setEcranActuel('game');
  };

  // Fonction appelée quand on quitte l'aventure
  const quitterAventure = () => {
    setEcranActuel('selection');
    setAventureSelectionnee(null);
  };

  // Affichage conditionnel selon l'écran actuel
  return (
    <div className="app-container">
      {/* Affiche la bannière d'accueil Sherlock */}
      {ecranActuel === 'selection' && (
        <AccueilHero onSelect={demarrerAventure} />
      )}
      {/* Affiche la liste des aventures à sélectionner */}
      {ecranActuel === 'selection' && (
        <SelectionScreen onSelect={demarrerAventure} />
      )}
      {/* Affiche l'écran de jeu si une aventure est sélectionnée */}
      {ecranActuel === 'game' && aventureSelectionnee && (
        <GameScreen adventure={aventureSelectionnee} onQuit={quitterAventure} />
      )}
    </div>
  );
}
