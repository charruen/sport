const fs = require('fs');
const path = require('path');

const phases = [
  { number: 1, title: 'Fondations & Alignement', description: 'Apprentissage du gainage, placement du dos et pompes inclinées meuble haut.', weeksRange: 'Semaines 1 à 4' },
  { number: 2, title: 'Baisse de l\'Angle & Charge Triceps', description: 'Pompes sur meuble moyen (table/bureau), montée en puissance des Dips.', weeksRange: 'Semaines 5 à 9' },
  { number: 3, title: 'Transition Sol & Phase Négative', description: 'Premières pompes genoux au sol et travail négatif freiné.', weeksRange: 'Semaines 10 à 14' },
  { number: 4, title: 'Premières Pompes Stricte au Sol', description: 'Passage aux pompes classiques pures au sol et Dips jambes tendues.', weeksRange: 'Semaines 15 à 19' },
  { number: 5, title: 'Consolidation Sol & Volume Pectoraux', description: 'Montée en répétitions sur pompes classiques au sol et abdominaux.', weeksRange: 'Semaines 20 à 24' },
  { number: 6, title: 'Introduction de la Pompe Diamant', description: 'Premières séries de Pompes Diamant (mains serrées en triangle) pour cibler les triceps.', weeksRange: 'Semaines 25 à 28' },
  { number: 7, title: 'Surcharges & Relief Abdominal', description: 'Doublement des séries de Pompes Diamant et gainage renforcé.', weeksRange: 'Semaines 29 à 32' },
  { number: 8, title: 'Peak Performance & Bilan Final', description: 'Maîtrise complète des Pompes Diamant (3x8 reps) et corps sculpté.', weeksRange: 'Semaines 33 et 34' },
];

function formatDate(date) {
  const months = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];
  const d = date.getDate();
  const m = months[date.getMonth()];
  const y = date.getFullYear();
  return `${d < 10 ? '0' + d : d} ${m} ${y}`;
}

const weeks = [];
const startDate = new Date(2026, 9, 5); // 5 Oct 2026

for (let w = 1; w <= 34; w++) {
  const weekStart = new Date(startDate);
  weekStart.setDate(startDate.getDate() + (w - 1) * 7);
  
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);

  let phaseNum = 1;
  if (w >= 5 && w <= 9) phaseNum = 2;
  else if (w >= 10 && w <= 14) phaseNum = 3;
  else if (w >= 15 && w <= 19) phaseNum = 4;
  else if (w >= 20 && w <= 24) phaseNum = 5;
  else if (w >= 25 && w <= 28) phaseNum = 6;
  else if (w >= 29 && w <= 32) phaseNum = 7;
  else if (w >= 33) phaseNum = 8;

  const currentPhase = phases.find(p => p.number === phaseNum);

  const pushInclineReps = Math.min(12, 8 + Math.floor((w - 1) % 4));
  const plankSecs = w <= 4 ? 30 + (w - 1) * 5 : w <= 9 ? 45 + (w - 5) * 3 : w <= 14 ? 60 : w <= 24 ? 75 : 90;
  const plankText = `${plankSecs}s`;

  let mondayExercises = [];
  let wednesdayExercises = [];
  let thursdayExercises = [];
  let fridayExercises = [];

  if (phaseNum === 1) {
    mondayExercises = [
      { id: `w${w}_mon_ex1`, name: 'Pompes inclinées (meuble haut)', target: 'Triceps', sets: 3, reps: `${pushInclineReps}`, restSeconds: 90, tip: 'Mains sur le haut du bureau/commode. Poitrine vers le bord du meuble, corps bien gainé.' },
      { id: `w${w}_mon_ex2`, name: 'Dips sur chaise (genoux pliés)', target: 'Triceps', sets: 3, reps: `${Math.min(10, 8 + Math.floor((w-1)/2))}`, restSeconds: 60, tip: 'Mains sur le bord de la chaise stable, coudes vers l\'arrière à 90°. Pieds bien à plat.' },
      { id: `w${w}_mon_ex3`, name: 'Gainage planche sur coudes', target: 'Abdos', sets: 3, reps: plankText, restSeconds: 60, tip: 'Coudes sous les épaules. Serre fort les fessiers et le nombril. Ne laisse pas le bas du dos creuser.' }
    ];
    wednesdayExercises = [
      { id: `w${w}_wed_ex1`, name: 'Superman au sol', target: 'Dos', sets: 3, reps: '12', restSeconds: 60, tip: 'Allongé sur le ventre, décolle légèrement la poitrine et les jambes. Bloque 1s en haut.' },
      { id: `w${w}_wed_ex2`, name: 'Rowing serviette / glissé au sol', target: 'Dos', sets: 3, reps: '12', restSeconds: 60, tip: 'Tire la serviette vers le haut du torse en contractant fort les omoplates.' },
      { id: `w${w}_wed_ex3`, name: 'Extensions mollets sur marche', target: 'Mollets', sets: 3, reps: '15', restSeconds: 45, tip: 'Pointe des pieds sur la marche, descends le talon puis monte au maximum sur la pointe.' }
    ];
    thursdayExercises = [
      { id: `w${w}_thu_ex1`, name: 'Crunchs contrôlés', target: 'Abdos', sets: 3, reps: `${12 + (w-1)}`, restSeconds: 60, tip: 'Mains aux tempes, décolle seulement les omoplates du sol en expirant. Ne tire pas la nuque.' },
      { id: `w${w}_thu_ex2`, name: 'Touches d\'épaule en planche', target: 'Abdos', sets: 3, reps: '10/côté', restSeconds: 60, tip: 'Planche sur les mains, pieds écartés. Touche l\'épaule opposée sans pivoter le bassin.' },
      { id: `w${w}_thu_ex3`, name: 'Gainage latéral sur coude', target: 'Abdos', sets: 3, reps: '20s/côté', restSeconds: 60, tip: 'Corps aligné tête-bassin-chevilles. Pousse le bassin vers le plafond.' }
    ];
    fridayExercises = [
      { id: `w${w}_fri_ex1`, name: 'Pompes inclinées (meuble haut)', target: 'Pectoraux', sets: 3, reps: `${pushInclineReps}`, restSeconds: 90, tip: 'Mouvement fluide et contrôlé. Inspire en descendant, expire en poussant.' },
      { id: `w${w}_fri_ex2`, name: 'Dips sur chaise', target: 'Triceps', sets: 3, reps: '8', restSeconds: 60, tip: 'Garde les épaules basses, ne hausse pas les épaules vers les oreilles.' },
      { id: `w${w}_fri_ex3`, name: 'Gainage planche sur coudes', target: 'Abdos', sets: 3, reps: plankText, restSeconds: 60, tip: 'Respiration régulière pendant tout le maintien.' }
    ];
  } else if (phaseNum === 2) {
    mondayExercises = [
      { id: `w${w}_mon_ex1`, name: 'Pompes inclinées (meuble moyen)', target: 'Pectoraux', sets: 3, reps: `${Math.min(12, 8 + (w-5))}`, restSeconds: 90, tip: 'Mains appuyées sur le bord d\'une table ou d\'un bureau plus bas. Descends la poitrine vers le bord.' },
      { id: `w${w}_mon_ex2`, name: 'Dips sur chaise', target: 'Triceps', sets: 3, reps: `${Math.min(12, 10 + Math.floor((w-5)/2))}`, restSeconds: 60, tip: 'Contrôle la descente, pousse fort dans les bras.' },
      { id: `w${w}_mon_ex3`, name: 'Gainage planche coudes', target: 'Abdos', sets: 3, reps: plankText, restSeconds: 60, tip: 'Cale tes pieds contre le mur pour éviter tout glissement du tapis !' }
    ];
    wednesdayExercises = [
      { id: `w${w}_wed_ex1`, name: 'Superman au sol', target: 'Dos', sets: 3, reps: '15', restSeconds: 60, tip: 'Conserve la nuque alignée avec la colonne.' },
      { id: `w${w}_wed_ex2`, name: 'Rowing serviette au sol', target: 'Dos', sets: 3, reps: '15', restSeconds: 60, tip: 'Serre les omoplates comme pour pincer une feuille entre tes épaules.' },
      { id: `w${w}_wed_ex3`, name: 'Extensions mollets à 1 jambe', target: 'Mollets', sets: 3, reps: '12/côté', restSeconds: 45, tip: 'Équilibre sur une jambe, pointe au maximum.' }
    ];
    thursdayExercises = [
      { id: `w${w}_thu_ex1`, name: 'Crunchs contrôlés', target: 'Abdos', sets: 3, reps: '15', restSeconds: 60, tip: 'Pense à contracter fort le sommet des abdos.' },
      { id: `w${w}_thu_ex2`, name: 'Gainage commando', target: 'Abdos', sets: 3, reps: '6 reps', restSeconds: 60, tip: 'Passe des coudes aux mains une par une en gardant le bassin immobile.' },
      { id: `w${w}_thu_ex3`, name: 'Gainage latéral', target: 'Abdos', sets: 3, reps: '25s/côté', restSeconds: 60, tip: 'Main en appui solide sur le sol.' }
    ];
    fridayExercises = [
      { id: `w${w}_fri_ex1`, name: 'Pompes inclinées (meuble moyen)', target: 'Triceps', sets: 3, reps: '12', restSeconds: 90, tip: 'Garde les coudes proches du corps à 45°.' },
      { id: `w${w}_fri_ex2`, name: 'Dips sur chaise', target: 'Triceps', sets: 3, reps: '12', restSeconds: 60, tip: 'Isolation maximale de l\'arrière du bras.' },
      { id: `w${w}_fri_ex3`, name: 'Gainage planche coudes', target: 'Abdos', sets: 3, reps: plankText, restSeconds: 60, tip: 'Position irréprochable.' }
    ];
  } else if (phaseNum === 3) {
    mondayExercises = [
      { id: `w${w}_mon_ex1`, name: 'Pompes sur les genoux au sol', target: 'Pectoraux', sets: 3, reps: `${Math.min(8, 6 + Math.floor((w-10)/2))}`, restSeconds: 90, tip: 'Genoux posés sur tapis, hanches alignées. Descends la poitrine jusqu\'à frôler le sol.' },
      { id: `w${w}_mon_ex2`, name: 'Dips sur chaise', target: 'Triceps', sets: 3, reps: '12', restSeconds: 60, tip: 'Garde les pieds plus éloignés pour augmenter le travail.' },
      { id: `w${w}_mon_ex3`, name: 'Gainage planche coudes', target: 'Abdos', sets: 3, reps: '1m', restSeconds: 60, tip: 'Respiration lente et contrôlée.' }
    ];
    wednesdayExercises = [
      { id: `w${w}_wed_ex1`, name: 'Superman au sol', target: 'Dos', sets: 3, reps: '15', restSeconds: 60, tip: 'Maintien de 1s au sommet.' },
      { id: `w${w}_wed_ex2`, name: 'Rowing serviette au sol', target: 'Dos', sets: 3, reps: '15', restSeconds: 60, tip: 'Traction lente et contrôlée.' },
      { id: `w${w}_wed_ex3`, name: 'Extensions mollets 1 jambe', target: 'Mollets', sets: 3, reps: '15/côté', restSeconds: 45, tip: 'Montée lente, redescente freinée.' }
    ];
    thursdayExercises = [
      { id: `w${w}_thu_ex1`, name: 'Crunchs inversés (relevé de bassin)', target: 'Abdos', sets: 3, reps: '12', restSeconds: 60, tip: 'Allongé sur le dos, monte les genoux vers la poitrine en décollant légèrement le bas du dos.' },
      { id: `w${w}_thu_ex2`, name: 'Touches d\'épaule en planche', target: 'Abdos', sets: 3, reps: '12/côté', restSeconds: 60, tip: 'Stabilité absolue du tronc.' },
      { id: `w${w}_thu_ex3`, name: 'Gainage commando', target: 'Abdos', sets: 3, reps: '8 reps', restSeconds: 60, tip: 'Alternance des bras d\'appui.' }
    ];
    fridayExercises = [
      { id: `w${w}_fri_ex1`, name: 'Pompes Négatives au sol (4s descente)', target: 'Triceps', sets: 3, reps: '4', restSeconds: 90, tip: 'Sur les pieds, freine la descente pendant 4 secondes complètes jusqu\'au sol, puis remonte sur les genoux.' },
      { id: `w${w}_fri_ex2`, name: 'Dips sur chaise', target: 'Triceps', sets: 3, reps: '12', restSeconds: 60, tip: 'Concentration sur les triceps.' },
      { id: `w${w}_fri_ex3`, name: 'Gainage planche coudes', target: 'Abdos', sets: 3, reps: '1m', restSeconds: 60, tip: 'Maintien solide.' }
    ];
  } else if (phaseNum === 4) {
    mondayExercises = [
      { id: `w${w}_mon_ex1`, name: 'Pompes Classiques au sol !', target: 'Pectoraux', sets: 3, reps: `${Math.min(6, 3 + (w-15))}`, restSeconds: 90, tip: 'Corps rigide comme une planche sur les pieds. Descends la poitrine au sol sans toucher le ventre.' },
      { id: `w${w}_mon_ex2`, name: 'Dips chaise (jambes tendues)', target: 'Triceps', sets: 3, reps: '10', restSeconds: 60, tip: 'Talons au sol, jambes tendues pour augmenter la résistance.' },
      { id: `w${w}_mon_ex3`, name: 'Gainage planche coudes', target: 'Abdos', sets: 3, reps: '1m15', restSeconds: 60, tip: 'Ne laisse pas s\'affaisser les épaules.' }
    ];
    wednesdayExercises = [
      { id: `w${w}_wed_ex1`, name: 'Superman avec maintien', target: 'Dos', sets: 3, reps: '15', restSeconds: 60, tip: 'Bloque 2s en haut.' },
      { id: `w${w}_wed_ex2`, name: 'Rowing serviette au sol', target: 'Dos', sets: 3, reps: '15', restSeconds: 60, tip: 'Tension constante.' },
      { id: `w${w}_wed_ex3`, name: 'Extensions mollets 1 jambe', target: 'Mollets', sets: 3, reps: '15/côté', restSeconds: 45, tip: 'Ampleur maximale.' }
    ];
    thursdayExercises = [
      { id: `w${w}_thu_ex1`, name: 'Crunchs inversés', target: 'Abdos', sets: 3, reps: '15', restSeconds: 60, tip: 'Mouvement fluide sans élan.' },
      { id: `w${w}_thu_ex2`, name: 'Touches d\'épaule en planche', target: 'Abdos', sets: 3, reps: '15/côté', restSeconds: 60, tip: 'Rhythm contrôlé.' },
      { id: `w${w}_thu_ex3`, name: 'Gainage latéral', target: 'Abdos', sets: 3, reps: '30s/côté', restSeconds: 60, tip: 'Conserve le corps aligné.' }
    ];
    fridayExercises = [
      { id: `w${w}_fri_ex1`, name: 'Pompes Classiques au sol', target: 'Pectoraux', sets: 3, reps: `${Math.min(6, 4 + (w-15))}`, restSeconds: 90, tip: 'Qualité d\'exécution irréprochable.' },
      { id: `w${w}_fri_ex2`, name: 'Dips chaise (jambes tendues)', target: 'Triceps', sets: 3, reps: '10', restSeconds: 60, tip: 'Triceps en feu à la fin de la série.' },
      { id: `w${w}_fri_ex3`, name: 'Gainage planche coudes', target: 'Abdos', sets: 3, reps: '1m15', restSeconds: 60, tip: 'Engage fort la sangle.' }
    ];
  } else if (phaseNum === 5) {
    mondayExercises = [
      { id: `w${w}_mon_ex1`, name: 'Pompes Classiques au sol', target: 'Pectoraux', sets: 3, reps: `${Math.min(10, 6 + (w-20))}`, restSeconds: 90, tip: 'Descente complète, coudes rentrés à 45°.' },
      { id: `w${w}_mon_ex2`, name: 'Dips chaise (jambes tendues)', target: 'Triceps', sets: 3, reps: '12', restSeconds: 60, tip: 'Fais travailler l\'arrière du bras.' },
      { id: `w${w}_mon_ex3`, name: 'Gainage planche coudes', target: 'Abdos', sets: 3, reps: '1m15', restSeconds: 60, tip: 'Stabilité irréprochable.' }
    ];
    wednesdayExercises = [
      { id: `w${w}_wed_ex1`, name: 'Superman au sol', target: 'Dos', sets: 3, reps: '15', restSeconds: 60, tip: 'Dos solide et renforcé.' },
      { id: `w${w}_wed_ex2`, name: 'Rowing serviette au sol', target: 'Dos', sets: 3, reps: '15', restSeconds: 60, tip: 'Contraction dorsale.' },
      { id: `w${w}_wed_ex3`, name: 'Extensions mollets 1 jambe', target: 'Mollets', sets: 3, reps: '18/côté', restSeconds: 45, tip: 'Bonne brûlure du mollet.' }
    ];
    thursdayExercises = [
      { id: `w${w}_thu_ex1`, name: 'Crunchs contrôlés', target: 'Abdos', sets: 3, reps: '20', restSeconds: 60, tip: 'Décolle bien les omoplates.' },
      { id: `w${w}_thu_ex2`, name: 'Touches d\'épaule en planche', target: 'Abdos', sets: 3, reps: '15/côté', restSeconds: 60, tip: 'Pieds légèrement écartés.' },
      { id: `w${w}_thu_ex3`, name: 'Gainage latéral', target: 'Abdos', sets: 3, reps: '35s/côté', restSeconds: 60, tip: 'Obliques sous tension.' }
    ];
    fridayExercises = [
      { id: `w${w}_fri_ex1`, name: 'Pompes Classiques au sol', target: 'Pectoraux', sets: 3, reps: `${Math.min(10, 7 + (w-20))}`, restSeconds: 90, tip: 'Force et régularité.' },
      { id: `w${w}_fri_ex2`, name: 'Dips chaise (jambes tendues)', target: 'Triceps', sets: 3, reps: '12', restSeconds: 60, tip: 'Isolation triceps.' },
      { id: `w${w}_fri_ex3`, name: 'Gainage planche coudes', target: 'Abdos', sets: 3, reps: '1m15', restSeconds: 60, tip: 'Gainage d\'acier.' }
    ];
  } else if (phaseNum === 6) {
    mondayExercises = [
      { id: `w${w}_mon_ex1`, name: 'Pompes Classiques (Série 1 & 2)', target: 'Pectoraux', sets: 2, reps: '10', restSeconds: 90, tip: 'Échauffement parfait de la poussée.' },
      { id: `w${w}_mon_ex2`, name: 'POMPES DIAMANT (Série 3)', target: 'Triceps', sets: 1, reps: `${Math.min(5, 3 + (w-25))}`, restSeconds: 90, tip: '🔹 MAINS EN TRIANGLE sous la poitrine (index et pouces collés). Focus TRICEPS extrême !' },
      { id: `w${w}_mon_ex3`, name: 'Dips chaise (jambes tendues)', target: 'Triceps', sets: 3, reps: '12', restSeconds: 60, tip: 'Maintien de la brûlure.' },
      { id: `w${w}_mon_ex4`, name: 'Gainage planche coudes', target: 'Abdos', sets: 3, reps: '1m20', restSeconds: 60, tip: 'Sangle bien verrouillée.' }
    ];
    wednesdayExercises = [
      { id: `w${w}_wed_ex1`, name: 'Superman au sol', target: 'Dos', sets: 3, reps: '15', restSeconds: 60, tip: 'Posturale & gainage dorsal.' },
      { id: `w${w}_wed_ex2`, name: 'Rowing serviette au sol', target: 'Dos', sets: 3, reps: '15', restSeconds: 60, tip: 'Focus grand dorsal.' },
      { id: `w${w}_wed_ex3`, name: 'Extensions mollets 1 jambe', target: 'Mollets', sets: 3, reps: '20/côté', restSeconds: 45, tip: 'Finition pointe des pieds.' }
    ];
    thursdayExercises = [
      { id: `w${w}_thu_ex1`, name: 'Crunchs V-Ups modifiés', target: 'Abdos', sets: 3, reps: '12', restSeconds: 60, tip: 'Monte simultanément les épaules et les genoux.' },
      { id: `w${w}_thu_ex2`, name: 'Touches d\'épaule en planche', target: 'Abdos', sets: 3, reps: '15/côté', restSeconds: 60, tip: 'Contrôle parfait.' },
      { id: `w${w}_thu_ex3`, name: 'Gainage planche coudes', target: 'Abdos', sets: 3, reps: '1m20', restSeconds: 60, tip: 'Abdos en acier.' }
    ];
    fridayExercises = [
      { id: `w${w}_fri_ex1`, name: 'POMPES DIAMANT (Série 1)', target: 'Triceps', sets: 1, reps: `${Math.min(5, 3 + (w-25))}`, restSeconds: 90, tip: '🔹 Mains en triangle sous le sternum.' },
      { id: `w${w}_fri_ex2`, name: 'Pompes Classiques (Série 2 & 3)', target: 'Pectoraux', sets: 2, reps: '10', restSeconds: 90, tip: 'Poussée constante.' },
      { id: `w${w}_fri_ex3`, name: 'Finisseur Volume (Dips + Inclinées)', target: 'Triceps', sets: 3, reps: '10', restSeconds: 60, tip: 'Enchaîne dips puis pompes inclinées.' }
    ];
  } else if (phaseNum === 7) {
    mondayExercises = [
      { id: `w${w}_mon_ex1`, name: 'POMPES DIAMANT (2 Séries)', target: 'Triceps', sets: 2, reps: `${Math.min(6, 4 + (w-29))}`, restSeconds: 90, tip: '🔹 MAINS EN TRIANGLE. Pousse fort avec l\'arrière des bras !' },
      { id: `w${w}_mon_ex2`, name: 'Pompes Classiques (1 Série)', target: 'Pectoraux', sets: 1, reps: '12', restSeconds: 90, tip: 'Finition pectoraux.' },
      { id: `w${w}_mon_ex3`, name: 'Dips chaise (jambes tendues)', target: 'Triceps', sets: 3, reps: '15', restSeconds: 60, tip: 'Volume triceps maximal.' },
      { id: `w${w}_mon_ex4`, name: 'Gainage planche coudes', target: 'Abdos', sets: 3, reps: '1m30', restSeconds: 60, tip: 'Sangle abdominale dessinée.' }
    ];
    wednesdayExercises = [
      { id: `w${w}_wed_ex1`, name: 'Superman au sol', target: 'Dos', sets: 3, reps: '15', restSeconds: 60, tip: 'Excellente posture.' },
      { id: `w${w}_wed_ex2`, name: 'Rowing serviette au sol', target: 'Dos', sets: 3, reps: '15', restSeconds: 60, tip: 'Dos sculpté.' },
      { id: `w${w}_wed_ex3`, name: 'Extensions mollets 1 jambe', target: 'Mollets', sets: 3, reps: '20/côté', restSeconds: 45, tip: 'Mollets galbés.' }
    ];
    thursdayExercises = [
      { id: `w${w}_thu_ex1`, name: 'Crunchs V-Ups modifiés', target: 'Abdos', sets: 3, reps: '15', restSeconds: 60, tip: 'Contraction profonde du grand droit.' },
      { id: `w${w}_thu_ex2`, name: 'Touches d\'épaule en planche', target: 'Abdos', sets: 3, reps: '15/côté', restSeconds: 60, tip: 'Gainage anti-rotation.' },
      { id: `w${w}_thu_ex3`, name: 'Gainage latéral', target: 'Abdos', sets: 3, reps: '40s/côté', restSeconds: 60, tip: 'Dessin des obliques.' }
    ];
    fridayExercises = [
      { id: `w${w}_fri_ex1`, name: 'POMPES DIAMANT', target: 'Triceps', sets: 3, reps: '5', restSeconds: 90, tip: '🔹 3 Séries complètes de pompes diamant !' },
      { id: `w${w}_fri_ex2`, name: 'Dips chaise (jambes tendues)', target: 'Triceps', sets: 3, reps: '15', restSeconds: 60, tip: 'Bras massifs et découpés.' },
      { id: `w${w}_fri_ex3`, name: 'Gainage planche coudes', target: 'Abdos', sets: 3, reps: '1m30', restSeconds: 60, tip: 'Maintien ultime.' }
    ];
  } else { // Phase 8
    mondayExercises = [
      { id: `w${w}_mon_ex1`, name: 'Pompes Classiques (Chauffe)', target: 'Pectoraux', sets: 1, reps: '15', restSeconds: 90, tip: 'Chauffe dynamique fluide.' },
      { id: `w${w}_mon_ex2`, name: 'POMPES DIAMANT (OBJECTIF ATTEINT!)', target: 'Triceps', sets: 2, reps: '8', restSeconds: 90, tip: '🏆 MAINS EN TRIANGLE. Mouvement d\'expert maîtrisé à la perfection !' },
      { id: `w${w}_mon_ex3`, name: 'Dips chaise (jambes tendues)', target: 'Triceps', sets: 3, reps: '15', restSeconds: 60, tip: 'Triceps puissants.' },
      { id: `w${w}_mon_ex4`, name: 'Gainage planche coudes', target: 'Abdos', sets: 3, reps: '1m30', restSeconds: 60, tip: 'Plaque abdominale en béton.' }
    ];
    wednesdayExercises = [
      { id: `w${w}_wed_ex1`, name: 'Superman au sol', target: 'Dos', sets: 3, reps: '15', restSeconds: 60, tip: 'Dos athlétique.' },
      { id: `w${w}_wed_ex2`, name: 'Rowing serviette au sol', target: 'Dos', sets: 3, reps: '15', restSeconds: 60, tip: 'V-Taper parfait.' },
      { id: `w${w}_wed_ex3`, name: 'Extensions mollets 1 jambe', target: 'Mollets', sets: 3, reps: '20/côté', restSeconds: 45, tip: 'Finition musculaire.' }
    ];
    thursdayExercises = [
      { id: `w${w}_thu_ex1`, name: 'Crunchs V-Ups', target: 'Abdos', sets: 3, reps: '15', restSeconds: 60, tip: 'Abdos 6-pack visibles.' },
      { id: `w${w}_thu_ex2`, name: 'Touches d\'épaule en planche', target: 'Abdos', sets: 3, reps: '20/côté', restSeconds: 60, tip: 'Tronc indestructible.' },
      { id: `w${w}_thu_ex3`, name: 'Gainage planche coudes', target: 'Abdos', sets: 3, reps: '1m30', restSeconds: 60, tip: 'Tenue d\'élite.' }
    ];
    fridayExercises = [
      { id: `w${w}_fri_ex1`, name: 'POMPES DIAMANT', target: 'Triceps', sets: 2, reps: '8', restSeconds: 90, tip: '🔹 Maîtrise totale.' },
      { id: `w${w}_fri_ex2`, name: 'Pompes Classiques au sol', target: 'Pectoraux', sets: 2, reps: '12', restSeconds: 90, tip: 'Superbe volume poitrine.' },
      { id: `w${w}_fri_ex3`, name: 'Dips chaise (jambes tendues)', target: 'Triceps', sets: 3, reps: '15', restSeconds: 60, tip: 'Bras athlétiques.' },
      { id: `w${w}_fri_ex4`, name: 'Gainage planche coudes', target: 'Abdos', sets: 3, reps: '1m30', restSeconds: 60, tip: 'Victoire ! Fin de saison au sommet !' }
    ];
  }

  const days = {
    lundi: {
      dayId: 'lundi',
      dayName: 'Lundi',
      isRest: false,
      subtitle: '18h00 — Focus Poussée, Triceps & Pectoraux',
      exercises: mondayExercises
    },
    mardi: {
      dayId: 'mardi',
      dayName: 'Mardi',
      isRest: true,
      restReason: 'badminton',
      subtitle: '18h-20h — Option Badminton (Lycée)',
      exercises: []
    },
    mercredi: {
      dayId: 'mercredi',
      dayName: 'Mercredi',
      isRest: false,
      subtitle: '17h30 — Focus Dos, Posture, Biceps & Mollets',
      exercises: wednesdayExercises
    },
    jeudi: {
      dayId: 'jeudi',
      dayName: 'Jeudi',
      isRest: false,
      subtitle: '17h00 — Focus Sangle Abdominale & Core (Après EPS)',
      exercises: thursdayExercises
    },
    vendredi: {
      dayId: 'vendredi',
      dayName: 'Vendredi',
      isRest: false,
      subtitle: '16h30 — Full Body Haut du Corps & Volume Bras',
      exercises: fridayExercises
    },
    samedi: {
      dayId: 'samedi',
      dayName: 'Samedi',
      isRest: true,
      restReason: 'weekend',
      subtitle: 'Repos Musculaire Total',
      exercises: []
    },
    dimanche: {
      dayId: 'dimanche',
      dayName: 'Dimanche',
      isRest: true,
      restReason: 'weekend',
      subtitle: 'Repos Musculaire Total & Sommeil',
      exercises: []
    }
  };

  weeks.push({
    weekNumber: w,
    startDate: formatDate(weekStart),
    endDate: formatDate(weekEnd),
    phaseNumber: currentPhase.number,
    phaseTitle: currentPhase.title,
    phaseDescription: currentPhase.description,
    days
  });
}

const fullData = {
  phases,
  weeks
};

const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const outputPath = path.join(dataDir, 'program.json');
fs.writeFileSync(outputPath, JSON.stringify(fullData, null, 2), 'utf-8');
console.log(`Programme généré avec succès dans ${outputPath} ! (${weeks.length} semaines)`);
