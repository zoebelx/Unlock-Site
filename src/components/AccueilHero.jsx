import React from 'react';
import './AccueilHero.css';
import AccueilImg from '../assets/Accueil.jpeg';
import PatternImg from '../assets/test.webp';

// Composant d'accueil affichant la bannière Sherlock et l'image de fond
export default function AccueilHero({ onSelect }) {
  // Fonction appelée au clic sur la box DROME AVENTURE
  const handleClick = () => {
    // On simule la sélection de l'aventure DROME
    onSelect && onSelect({ id: 'drome', title: 'DROME AVENTURE', defaultTime: 3600 });
  };
  return (
    <div>
      {/* Bannière principale avec titre et sous-titre */}
      <div className="hero-banner">
        <h1>SHERLOCK !</h1>
        <h2>Sélectionnez une boîte.</h2>
        <hr className="hero-separator" />
      </div>
      {/* Section image de fond avec le titre de l'aventure, cliquable */}
      <button
        className="hero-image-section"
        onClick={handleClick}
        style={{
          border: 'none',
          padding: 0,
          backgroundImage: `url(${AccueilImg})`,
        }}
      >
        <div className="adventure-title">DROME AVENTURE</div>
      </button>
      {/* Fond bleu pour le reste de la page */}
      <div
        className="hero-bg"
        style={{
          backgroundImage: `linear-gradient(rgba(238, 224, 203, 0.90), rgba(238, 224, 203, 0.90)), url(${PatternImg})`,
        }}
      ></div>
    </div>
  );
}
