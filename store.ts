import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Match {
  id: string;
  group: string;
  home: string;
  away: string;
  homeGoals?: number;
  awayGoals?: number;
}

interface Group {
  name: string;
  teams: string[];
  matches: Match[];
  standings: Standing[];
}

interface Standing {
  team: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
}

interface KnockoutMatch {
  id: string;
  round: string;
  home: string;
  away: string;
  homeGoals?: number;
  awayGoals?: number;
  penalties?: { home: number; away: number };
  winner?: string;
}

interface PlayInMatch {
  id: string;
  home: string;
  away: string;
  homeGoals?: number;
  awayGoals?: number;
  penalties?: { home: number; away: number };
  winner?: string;
}

interface ChampionshipState {
  teams: string[];
  groups: Group[];
  playInMatches: PlayInMatch[];
  knockoutMatches: KnockoutMatch[];
  mode: 'SIMPLE' | 'REPECHAGE';
  status: 'SETUP' | 'GROUPS' | 'PLAY_IN' | 'KNOCKOUT' | 'FINISHED';
  lastSavedAt?: string;
  initialized: boolean;
  addTeam: (team: string) => void;
  removeTeam: (index: number) => void;
  editTeam: (index: number, newName: string) => void;
  setMode: (mode: 'SIMPLE' | 'REPECHAGE') => void;
  generateChampionship: () => void;
  generateKnockoutPhase: () => void;
  updateMatchResult: (matchId: string, homeGoals: number, awayGoals: number) => void;
  updatePlayInResult: (matchId: string, homeGoals: number, awayGoals: number, penalties?: { home: number; away: number }) => void;
  updateKnockoutResult: (matchId: string, homeGoals: number, awayGoals: number, penalties?: { home: number; away: number }) => void;
  saveChampionship: () => void;
  resetChampionship: () => void;
  newChampionship: () => void;
}

const generateGroups = (teams: string[]): Group[] => {
  const numGroups = Math.ceil(teams.length / 5);
  const groups: Group[] = [];
  const shuffled = [...teams].sort(() => Math.random() - 0.5);

  for (let i = 0; i < numGroups; i++) {
    const groupTeams = shuffled.slice(i * 5, (i + 1) * 5);
    const groupName = String.fromCharCode(65 + i); // A, B, C...
    const matches: Match[] = [];

    // Round-robin: each plays each other once
    for (let j = 0; j < groupTeams.length; j++) {
      for (let k = j + 1; k < groupTeams.length; k++) {
        matches.push({
          id: `${groupName}-${j}-${k}`,
          group: groupName,
          home: groupTeams[j],
          away: groupTeams[k],
        });
      }
    }

    groups.push({
      name: `Grupo ${groupName}`,
      teams: groupTeams,
      matches,
      standings: calculateStandings(matches, groupTeams),
    });
  }

  return groups;
};

// Gerar grupos pré-definidos com os times do sorteio
const generatePredefinedGroups = (): Group[] => {
  const groupsData = [
    {
      name: 'Grupo A',
      teams: [
        'Luan (Flamengo)',
        'Mauricio (Boca Juniors)',
        'Gustavo (Fluminense)',
        'Betinho (Santos)',
        'Leo (Argentinos Juniors)',
        'Luis Alberto (Peñarol)',
      ],
    },
    {
      name: 'Grupo B',
      teams: [
        'Pedro (Grêmio)',
        'Joseph (Palmeiras)',
        'Moisés Alkmim (Red Bull Bragantino)',
        'Davi (Vélez)',
        'Michel Igreja (Botafogo)',
        'Vinícius (Estudiantes)',
      ],
    },
    {
      name: 'Grupo C',
      teams: [
        'João Vitor (São Paulo)',
        'Zeck (Cruzeiro)',
        'Isac (Bahia)',
        'Stocco (Atlético Mineiro)',
        'Gabriel (Racing)',
        'Mikelle (Vasco)',
      ],
    },
    {
      name: 'Grupo D',
      teams: [
        'João (Lanus)',
        'Marcelo (Atlético Nacional)',
        'Akira (River Plate)',
        'liu (Corinthians)',
        'Pedrão (Rosario Central)',
        'Rafael (Independente)',
      ],
    },
  ];

  const groups: Group[] = [];

  groupsData.forEach((groupData, groupIndex) => {
    const groupName = String.fromCharCode(65 + groupIndex); // A, B, C, D
    const matches: Match[] = [];

    // Round-robin: each plays each other once
    for (let j = 0; j < groupData.teams.length; j++) {
      for (let k = j + 1; k < groupData.teams.length; k++) {
        matches.push({
          id: `${groupName}-${j}-${k}`,
          group: groupName,
          home: groupData.teams[j],
          away: groupData.teams[k],
        });
      }
    }

    groups.push({
      name: groupData.name,
      teams: groupData.teams,
      matches,
      standings: calculateStandings(matches, groupData.teams),
    });
  });

  return groups;
};

const calculateStandings = (matches: Match[], teams?: string[]): Standing[] => {
  const standingsMap = new Map<string, Standing>();

  // Inicializar com todos os times zerados (se teams for fornecido)
  if (teams) {
    teams.forEach(team => {
      standingsMap.set(team, {
        team,
        played: 0,
        won: 0,
        drawn: 0,
        lost: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        goalDifference: 0,
        points: 0,
      });
    });
  }

  matches.forEach(match => {
    if (match.homeGoals !== undefined && match.awayGoals !== undefined) {
      const home = standingsMap.get(match.home) || {
        team: match.home,
        played: 0,
        won: 0,
        drawn: 0,
        lost: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        goalDifference: 0,
        points: 0,
      };
      const away = standingsMap.get(match.away) || {
        team: match.away,
        played: 0,
        won: 0,
        drawn: 0,
        lost: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        goalDifference: 0,
        points: 0,
      };

      home.played++;
      away.played++;
      home.goalsFor += match.homeGoals;
      home.goalsAgainst += match.awayGoals;
      away.goalsFor += match.awayGoals;
      away.goalsAgainst += match.homeGoals;

      if (match.homeGoals > match.awayGoals) {
        home.won++;
        home.points += 3;
        away.lost++;
      } else if (match.homeGoals < match.awayGoals) {
        away.won++;
        away.points += 3;
        home.lost++;
      } else {
        home.drawn++;
        away.drawn++;
        home.points += 1;
        away.points += 1;
      }

      home.goalDifference = home.goalsFor - home.goalsAgainst;
      away.goalDifference = away.goalsFor - away.goalsAgainst;

      standingsMap.set(match.home, home);
      standingsMap.set(match.away, away);
    }
  });

  return Array.from(standingsMap.values()).sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
    return b.goalsFor - a.goalsFor;
  });
};

const generateKnockout = (groups: Group[]): KnockoutMatch[] => {
  // Extrair 4 primeiros de cada grupo
  const qualifiedByGroup: Array<{ position: number; team: string; groupLetter: string }> = [];
  
  groups.forEach((group, groupIndex) => {
    const sorted = group.standings.slice(0, 4);
    const groupLetter = String.fromCharCode(65 + groupIndex); // A, B, C, D
    sorted.forEach((standing, index) => {
      qualifiedByGroup.push({
        position: index + 1,
        team: standing.team,
        groupLetter: groupLetter,
      });
    });
  });

  // Verificar se temos exatamente 16 times
  if (qualifiedByGroup.length !== 16) {
    return [];
  }

  // Agrupar times por posição e grupo
  const positions: { [key: number]: Map<string, string> } = {
    1: new Map(),
    2: new Map(),
    3: new Map(),
    4: new Map(),
  };

  qualifiedByGroup.forEach(q => {
    positions[q.position].set(q.groupLetter, q.team);
  });

  // Cruzamento justo para oitavas: 1ºA vs 4ºB, 2ºA vs 3ºB, etc.
  const pairings: Array<{ home: string; away: string }> = [];
  
  // 1º A vs 4º B
  pairings.push({
    home: positions[1].get('A')!,
    away: positions[4].get('B')!,
  });
  
  // 2º A vs 3º B
  pairings.push({
    home: positions[2].get('A')!,
    away: positions[3].get('B')!,
  });
  
  // 1º B vs 4º A
  pairings.push({
    home: positions[1].get('B')!,
    away: positions[4].get('A')!,
  });
  
  // 2º B vs 3º A
  pairings.push({
    home: positions[2].get('B')!,
    away: positions[3].get('A')!,
  });
  
  // 1º C vs 4º D
  pairings.push({
    home: positions[1].get('C')!,
    away: positions[4].get('D')!,
  });
  
  // 2º C vs 3º D
  pairings.push({
    home: positions[2].get('C')!,
    away: positions[3].get('D')!,
  });
  
  // 1º D vs 4º C
  pairings.push({
    home: positions[1].get('D')!,
    away: positions[4].get('C')!,
  });
  
  // 2º D vs 3º C
  pairings.push({
    home: positions[2].get('D')!,
    away: positions[3].get('C')!,
  });

  const phases = ['Oitavas', 'Quartas', 'Semifinal', 'Final'];
  const matches: KnockoutMatch[] = [];
  
  // Primeira fase (Oitavas) com os pairings
  pairings.forEach((pairing, index) => {
    matches.push({
      id: `Oitavas-${index}`,
      round: 'Oitavas',
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

const generatePlayIn = (groups: Group[]): PlayInMatch[] => {
  // Para 4 grupos: 2º A vs 3º B, 2º B vs 3º C, 2º C vs 3º D, 2º D vs 3º A
  const matches: PlayInMatch[] = [];
  const numGroups = groups.length;

  for (let i = 0; i < numGroups; i++) {
    const groupA = groups[i];
    const groupB = groups[(i + 1) % numGroups];

    const secondA = groupA.standings[1]?.team;
    const thirdB = groupB.standings[2]?.team;

    if (secondA && thirdB) {
      matches.push({
        id: `playin-${i}`,
        home: secondA,
        away: thirdB,
      });
    }
  }

  return matches;
};

const generateKnockoutWithPlayIn = (groups: Group[], playInMatches: PlayInMatch[]): KnockoutMatch[] => {
  // 4 primeiros lugares + 4 vencedores da repescagem = 8 times
  const firstPlaces = groups.map(group => group.standings[0]?.team || '');
  const playInWinners = playInMatches.map(match => match.winner || '');

  if (firstPlaces.length !== 4 || playInWinners.length !== 4) return [];

  const pairings = [
    { home: firstPlaces[0], away: playInWinners[1] },
    { home: firstPlaces[1], away: playInWinners[2] },
    { home: firstPlaces[2], away: playInWinners[3] },
    { home: firstPlaces[3], away: playInWinners[0] },
  ];

  const matches: KnockoutMatch[] = [];

  // Quartas
  pairings.forEach((pairing, index) => {
    matches.push({
      id: `Quartas-${index}`,
      round: 'Quartas',
      home: pairing.home,
      away: pairing.away,
    });
  });

  // Semifinais (vazias)
  for (let i = 0; i < 2; i++) {
    matches.push({
      id: `Semifinal-${i}`,
      round: 'Semifinal',
      home: '',
      away: '',
    });
  }

  // Final (vazia)
  matches.push({
    id: 'Final-0',
    round: 'Final',
    home: '',
    away: '',
  });

  return matches;
};

export const useChampionshipStore = create<ChampionshipState>()(
  persist(
    (set, get) => ({
      teams: [],
      groups: [],
      playInMatches: [],
      knockoutMatches: [],
      mode: 'SIMPLE',
      status: 'GROUPS',
      initialized: false,

      addTeam: (team) => set((state) => ({ teams: [...state.teams, team] })),

      removeTeam: (index) => set((state) => ({
        teams: state.teams.filter((_, i) => i !== index)
      })),

      editTeam: (index, newName) => set((state) => ({
        teams: state.teams.map((t, i) => i === index ? newName : t)
      })),

      setMode: (mode) => set({ mode }),

      generateChampionship: () => {
        const groups = generatePredefinedGroups();
        set({
          groups,
          status: 'GROUPS',
          initialized: true
        });
      },

      generateKnockoutPhase: () => {
        const { groups } = get();
        if (groups.length === 0) return;
        
        const knockoutMatches = generateKnockout(groups);
        set({
          knockoutMatches,
          status: 'KNOCKOUT'
        });
      },

      updateMatchResult: (matchId, homeGoals, awayGoals) => set((state) => {
        const newGroups = state.groups.map(group => ({
          ...group,
          matches: group.matches.map(match =>
            match.id === matchId ? { ...match, homeGoals, awayGoals } : match
          ),
        }));

        // Update standings
        const updatedGroups = newGroups.map(group => ({
          ...group,
          standings: calculateStandings(group.matches, group.teams),
        }));

        return {
          groups: updatedGroups,
        };
      }),

      updatePlayInResult: (matchId, homeGoals, awayGoals, penalties) => set((state) => {
        const newPlayInMatches = state.playInMatches.map(match =>
          match.id === matchId ? {
            ...match,
            homeGoals,
            awayGoals,
            penalties,
            winner: homeGoals > awayGoals ? match.home :
                    awayGoals > homeGoals ? match.away :
                    penalties ? (penalties.home > penalties.away ? match.home : match.away) : undefined
          } : match
        );

        // Check if all play-in matches are played
        const allPlayed = newPlayInMatches.every(match =>
          match.winner !== undefined
        );

        let newStatus = state.status;
        let newKnockoutMatches = state.knockoutMatches;

        if (allPlayed && state.status === 'PLAY_IN') {
          newKnockoutMatches = generateKnockoutWithPlayIn(state.groups, newPlayInMatches);
          newStatus = 'KNOCKOUT';
        }

        return {
          playInMatches: newPlayInMatches,
          knockoutMatches: newKnockoutMatches,
          status: newStatus
        };
      }),

      updateKnockoutResult: (matchId, homeGoals, awayGoals, penalties) => set((state) => {
        let newMatches = state.knockoutMatches.map(match =>
          match.id === matchId ? {
            ...match,
            homeGoals,
            awayGoals,
            penalties,
            winner: homeGoals > awayGoals ? match.home :
                    awayGoals > homeGoals ? match.away :
                    penalties ? (penalties.home > penalties.away ? match.home : match.away) : undefined
          } : match
        );

        // Propagar vencedor para próxima rodada
        const resultMatch = newMatches.find(m => m.id === matchId);
        if (resultMatch?.winner) {
          // Obter todas as rodadas em ordem (Oitavas < Quartas < Semifinal < Final)
          const roundOrder = ['Oitavas', 'Quartas', 'Semifinal', 'Final'];
          const allRounds = [...new Set(newMatches.map(m => m.round))].sort(
            (a, b) => roundOrder.indexOf(a) - roundOrder.indexOf(b)
          );
          const currentRoundIndex = allRounds.indexOf(resultMatch.round);

          if (currentRoundIndex !== -1 && currentRoundIndex < allRounds.length - 1) {
            const nextRound = allRounds[currentRoundIndex + 1];

            // Extrair número do match atual (ex: "Oitavas-2" -> 2)
            const currentMatchNum = parseInt(resultMatch.id.split('-')[1]);

            // Calcular qual será o próximo match (2 matches viram 1)
            const nextMatchNum = Math.floor(currentMatchNum / 2);
            const isHomeTeam = currentMatchNum % 2 === 0;

            // Encontrar o próximo match
            const nextMatchId = `${nextRound}-${nextMatchNum}`;

            newMatches = newMatches.map(match =>
              match.id === nextMatchId
                ? {
                    ...match,
                    [isHomeTeam ? 'home' : 'away']: resultMatch.winner
                  }
                : match
            );
          }
        }

        // Check if championship is finished
        const finalMatch = newMatches.find(m => m.round === 'Final');
        const newStatus = finalMatch?.winner ? 'FINISHED' : state.status;

        return { knockoutMatches: newMatches, status: newStatus };
      }),

      saveChampionship: () => set((state) => {
        const savedAt = new Date().toISOString();
        const payload = {
          teams: state.teams,
          groups: state.groups,
          playInMatches: state.playInMatches,
          knockoutMatches: state.knockoutMatches,
          mode: state.mode,
          status: state.status,
          lastSavedAt: savedAt,
        };

        if (typeof window !== 'undefined') {
          window.localStorage.setItem('championship-storage', JSON.stringify(payload));
        }

        return { lastSavedAt: savedAt };
      }),

      resetChampionship: () => set((state) => ({
        groups: state.groups.map(group => ({
          ...group,
          matches: group.matches.map(match => ({
            ...match,
            homeGoals: undefined,
            awayGoals: undefined,
          })),
          standings: calculateStandings([], group.teams),
        })),
        playInMatches: [],
        knockoutMatches: [],
        status: 'GROUPS'
      })),

      newChampionship: () => set({
        teams: [],
        groups: [],
        playInMatches: [],
        knockoutMatches: [],
        mode: 'SIMPLE',
        status: 'SETUP'
      }),
    }),
    {
      name: 'championship-storage',
    }
  )
);