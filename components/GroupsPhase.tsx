'use client';

import { useChampionshipStore } from '../store';

export default function GroupsPhase() {
  const { groups, updateMatchResult, mode, status, saveChampionship, lastSavedAt } = useChampionshipStore();

  const handleResultChange = (matchId: string, homeGoals: string, awayGoals: string) => {
    const hGoals = parseInt(homeGoals) || 0;
    const aGoals = parseInt(awayGoals) || 0;
    updateMatchResult(matchId, hGoals, aGoals);
  };

  const handleNumericInput = (value: string) => {
    // Remove tudo que não é dígito
    return value.replace(/\D/g, '');
  };

  const getStandingClass = (index: number, totalTeams: number, mode: 'SIMPLE' | 'REPECHAGE') => {
    // Qualificar os 4 primeiros de cada grupo
    if (index < 4) return 'bg-green-900/40 text-green-200 font-semibold border-l-4 border-green-500'; // 4 primeiros - classificados
    return 'bg-red-900/40 text-red-200 border-l-4 border-red-500'; // restantes - eliminados
  };

  const isEditable = status === 'GROUPS';

  return (
    <div className="px-1">
      <div className="flex flex-col gap-3 md:flex-row justify-between mb-6">
        <div className="flex flex-wrap gap-3">
          <button
            onClick={saveChampionship}
            className="bg-[#d8af43] text-black px-4 py-2 rounded hover:bg-[#c29f3d]"
          >
            Salvar Resultado
          </button>
        </div>
        {lastSavedAt && (
          <div className="text-sm text-white/70 self-end">
            Último salvamento: {new Date(lastSavedAt).toLocaleString('pt-BR')}
          </div>
        )}
      </div>
      {/* Seção de Jogos */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-3 text-[#d8af43]">Jogos</h2>
        <div className="grid gap-2 grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
          {groups.map((group) => (
            <div key={`games-${group.name}`} className="libertadores-card p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-bold mb-3 text-center bg-black/30 py-2 rounded text-[#d8af43]">{group.name}</h3>
              <div className="space-y-2">
                {group.matches.map((match) => (
                  <div key={match.id} className="bg-white/5 p-2 rounded border border-white/10">
                    <div className="flex items-center justify-between gap-1">
                      <span className="flex-1 font-medium text-xs md:text-sm truncate pr-1" title={match.home}>
                        {match.home}
                      </span>
                      <input
                        type="text"
                        value={match.homeGoals ?? ''}
                        onChange={(e) => {
                          const numericValue = handleNumericInput(e.target.value);
                          handleResultChange(match.id, numericValue, match.awayGoals?.toString() ?? '');
                        }}
                        className="w-10 text-center border border-white/10 rounded bg-[#0f0f0f] text-white text-xs md:text-sm font-bold"
                        placeholder="0"
                        maxLength={2}
                        disabled={!isEditable}
                      />
                      <span className="mx-1 text-gray-600 font-bold text-xs">vs</span>
                      <input
                        type="text"
                        value={match.awayGoals ?? ''}
                        onChange={(e) => {
                          const numericValue = handleNumericInput(e.target.value);
                          handleResultChange(match.id, match.homeGoals?.toString() ?? '', numericValue);
                        }}
                        className="w-10 text-center border border-white/10 rounded bg-[#0f0f0f] text-white text-xs md:text-sm font-bold"
                        placeholder="0"
                        maxLength={2}
                        disabled={!isEditable}
                      />
                      <span className="flex-1 text-right font-medium text-xs md:text-sm truncate pl-1" title={match.away}>
                        {match.away}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Seção de Classificação */}
      <div>
        <h2 className="text-2xl font-bold mb-4 text-[#d8af43]">Classificação</h2>
        <div className="grid gap-2" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
          {groups.map((group) => (
            <div key={`standings-${group.name}`} className="libertadores-card p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-bold mb-4 text-center bg-black/30 py-2 rounded text-[#d8af43]">{group.name}</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-base">
                  <thead>
                    <tr className="border-b border-[#d8af43]/30 bg-black/40">
                      <th className="text-left py-3 px-2 text-[#d8af43] font-bold">Time</th>
                      <th className="text-center py-3 px-1 text-[#d8af43] font-bold">P</th>
                      <th className="text-center py-3 px-1 text-[#d8af43] font-bold">V</th>
                      <th className="text-center py-3 px-1 text-[#d8af43] font-bold">E</th>
                      <th className="text-center py-3 px-1 text-[#d8af43] font-bold">D</th>
                      <th className="text-center py-3 px-1 text-[#d8af43] font-bold">GP</th>
                      <th className="text-center py-3 px-1 text-[#d8af43] font-bold">GC</th>
                      <th className="text-center py-3 px-1 text-[#d8af43] font-bold">SG</th>
                      <th className="text-center py-3 px-1 text-[#d8af43] font-bold">Pts</th>
                    </tr>
                  </thead>
                  <tbody>
                    {group.standings.map((standing, index) => (
                      <tr
                        key={standing.team}
                        className={`border-b border-white/10 ${getStandingClass(index, group.teams.length, mode)}`}
                      >
                        <td className="py-3 px-2 text-sm font-medium truncate max-w-24" title={standing.team}>
                          {standing.team}
                        </td>
                        <td className="text-center py-3 px-1 text-sm">{standing.played}</td>
                        <td className="text-center py-3 px-1 text-sm">{standing.won}</td>
                        <td className="text-center py-3 px-1 text-sm">{standing.drawn}</td>
                        <td className="text-center py-3 px-1 text-sm">{standing.lost}</td>
                        <td className="text-center py-3 px-1 text-sm">{standing.goalsFor}</td>
                        <td className="text-center py-3 px-1 text-sm">{standing.goalsAgainst}</td>
                        <td className="text-center py-3 px-1 text-sm">{standing.goalDifference}</td>
                        <td className="text-center py-3 px-1 text-sm font-bold">{standing.points}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}