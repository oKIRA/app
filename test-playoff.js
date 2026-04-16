// Test script para validar a lógica de playoff

// Simular grupos e standings
const mockGroups = [
  {
    name: 'Grupo A',
    standings: [
      { team: 'Time 1', points: 9 },
      { team: 'Time 2', points: 6 },
      { team: 'Time 3', points: 3 },
      { team: 'Time 4', points: 0 }
    ]
  },
  {
    name: 'Grupo B',
    standings: [
      { team: 'Time 5', points: 9 },
      { team: 'Time 6', points: 6 },
      { team: 'Time 7', points: 3 },
      { team: 'Time 8', points: 0 }
    ]
  },
  {
    name: 'Grupo C',
    standings: [
      { team: 'Time 9', points: 9 },
      { team: 'Time 10', points: 6 },
      { team: 'Time 11', points: 3 },
      { team: 'Time 12', points: 0 }
    ]
  },
  {
    name: 'Grupo D',
    standings: [
      { team: 'Time 13', points: 9 },
      { team: 'Time 14', points: 6 },
      { team: 'Time 15', points: 3 },
      { team: 'Time 16', points: 0 }
    ]
  }
];

// Função de geração de knockout (da aplicação)
const generateKnockout = (groups) => {
  const qualifiedByGroup = [];
  
  groups.forEach(group => {
    const sorted = group.standings.slice(0, 2);
    sorted.forEach((standing, index) => {
      qualifiedByGroup.push({
        position: index + 1,
        team: standing.team,
        groupName: group.name,
      });
    });
  });

  const totalTeams = qualifiedByGroup.length;
  
  let phases = [];
  if (totalTeams === 4) {
    phases = ['Semifinal', 'Final'];
  } else if (totalTeams === 8) {
    phases = ['Quartas', 'Semifinal', 'Final'];
  } else if (totalTeams === 16) {
    phases = ['Oitavas', 'Quartas', 'Semifinal', 'Final'];
  } else {
    return [];
  }

  const firstPlaces = qualifiedByGroup.filter(q => q.position === 1);
  const secondPlaces = qualifiedByGroup.filter(q => q.position === 2);

  const pairings = [];
  
  for (let i = 0; i < firstPlaces.length; i++) {
    const first = firstPlaces[i];
    const secondIndex = (i + 1) % secondPlaces.length;
    const second = secondPlaces[secondIndex];
    
    pairings.push({
      home: first.team,
      away: second.team,
    });
  }

  // Gerar matches para todas as fases
  const matches = [];
  
  // Primeira fase com os pairings
  const firstPhase = phases[0];
  pairings.forEach((pairing, index) => {
    matches.push({
      id: `${firstPhase}-${index}`,
      round: firstPhase,
      home: pairing.home,
      away: pairing.away,
    });
  });

  // Demais fases com times vazios (serão preenchidos automaticamente)
  for (let phaseIndex = 1; phaseIndex < phases.length; phaseIndex++) {
    const phase = phases[phaseIndex];
    const prevPhase = phases[phaseIndex - 1];
    const prevPhaseMatches = matches.filter(m => m.round === prevPhase);
    
    // Número de matches desta fase = metade da fase anterior
    const numMatches = Math.max(1, Math.floor(prevPhaseMatches.length / 2));
    
    for (let i = 0; i < numMatches; i++) {
      matches.push({
        id: `${phase}-${i}`,
        round: phase,
        home: '',
        away: '',
      });
    }
  }

  return matches;
};

// Testar
console.log('=== TESTE DE GERAÇÃO DE PLAYOFF ===\n');
const matches = generateKnockout(mockGroups);

console.log('Total de matches:', matches.length);
console.log('\nMatches por rodada:\n');

const phases = ['Oitavas', 'Quartas', 'Semifinal', 'Final'];
phases.forEach(phase => {
  const phaseMatches = matches.filter(m => m.round === phase);
  if (phaseMatches.length > 0) {
    console.log(`${phase} (${phaseMatches.length} matches):`);
    phaseMatches.forEach(m => {
      console.log(`  ${m.id}: ${m.home} vs ${m.away}`);
    });
    console.log();
  }
});

// Validação
console.log('=== VALIDAÇÕES ===\n');

// 1. Verificar se não há times vazios
const emptyTeams = matches.filter(m => !m.home || !m.away);
console.log('✓ Nenhum match com times vazios:', emptyTeams.length === 0 ? 'PASS' : `FAIL (${emptyTeams.length})`);

// 2. Verificar se times do mesmo grupo não se enfrentam na primeira rodada
const firstRound = matches.filter(m => m.round === 'Oitavas').length > 0 ? 'Oitavas' : 'Quartas';
const firstRoundMatches = matches.filter(m => m.round === firstRound);
let sameGroupMatches = 0;
firstRoundMatches.forEach(match => {
  const group1 = mockGroups.find(g => g.standings.some(s => s.team === match.home))?.name;
  const group2 = mockGroups.find(g => g.standings.some(s => s.team === match.away))?.name;
  if (group1 === group2) {
    sameGroupMatches++;
    console.log(`  ⚠ Mesmo grupo: ${match.home} (${group1}) vs ${match.away} (${group2})`);
  }
});
console.log('✓ Nenhum match com times do mesmo grupo na primeira rodada:', sameGroupMatches === 0 ? 'PASS' : `FAIL (${sameGroupMatches})`);

// 3. Verificar estrutura de matches (cada match tem ID, round, home, away)
const validStructure = matches.every(m => m.id && m.round && m.home && m.away);
console.log('✓ Todos os matches têm estrutura válida:', validStructure ? 'PASS' : 'FAIL');

console.log('\n=== TESTE CONCLUÍDO ===');
