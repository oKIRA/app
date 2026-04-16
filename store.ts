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
  addTeam: (team: string) => void;
  removeTeam: (index: number) => void;
  editTeam: (index: number, newName: string) => void;
  setMode: (mode: 'SIMPLE' | 'REPECHAGE') => void;
  generateChampionship: () => void;
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
  // Extrair 1º e 2º de cada grupo com informação de posição
  const qualifiedByGroup: Array<{ position: 1 | 2; team: string; groupName: string }> = [];
  
  groups.forEach(group => {
    const sorted = group.standings.slice(0, 2);
    sorted.forEach((standing, index) => {
      qualifiedByGroup.push({
        position: (index + 1) as 1 | 2,
        team: standing.team,
        groupName: group.name,
      });
    });
  });

  const totalTeams = qualifiedByGroup.length;
  
  // Determinar fases baseado no número de seleids
  let phases: string[] = [];
  if (totalTeams === 4) {
    phases = ['Semifinal', 'Final'];
  } else if (totalTeams === 8) {
    phases = ['Quartas', 'Semifinal', 'Final'];
  } else if (totalTeams === 16) {
    phases = ['Oitavas', 'Quartas', 'Semifinal', 'Final'];
  } else {
    return [];
  }

  // Organizar chaveamento: 1º de grupo A vs 2º de grupo B, etc.
  const firstPlaces = qualifiedByGroup.filter(q => q.position === 1);
  const secondPlaces = qualifiedByGroup.filter(q => q.position === 2);

  const pairings: Array<{ home: string; away: string }> = [];
  
  // Criar chaveamento: 1º de um grupo vs 2º de outro grupo com rotação
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
  const matches: KnockoutMatch[] = [];
  
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
      status: 'SETUP',

      addTeam: (team) => set((state) => ({ teams: [...state.teams, team] })),

      removeTeam: (index) => set((state) => ({
        teams: state.teams.filter((_, i) => i !== index)
      })),

      editTeam: (index, newName) => set((state) => ({
        teams: state.teams.map((t, i) => i === index ? newName : t)
      })),

      setMode: (mode) => set({ mode }),

      generateChampionship: () => {
        const { teams, mode } = get();
        if (teams.length < 4) return;
        const groups = generateGroups(teams);
        set({
          groups,
          status: 'GROUPS'
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

        // Check if all matches are played
        const allPlayed = updatedGroups.every(group =>
          group.matches.every(match => match.homeGoals !== undefined && match.awayGoals !== undefined)
        );

        let newStatus = state.status;
        let newPlayInMatches = state.playInMatches;
        let newKnockoutMatches = state.knockoutMatches;

        if (allPlayed && state.status === 'GROUPS') {
          if (state.mode === 'REPECHAGE') {
            newPlayInMatches = generatePlayIn(updatedGroups);
            newStatus = 'PLAY_IN';
          } else {
            newKnockoutMatches = generateKnockout(updatedGroups);
            newStatus = 'KNOCKOUT';
          }
        }

        return {
          groups: updatedGroups,
          playInMatches: newPlayInMatches,
          knockoutMatches: newKnockoutMatches,
          status: newStatus
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