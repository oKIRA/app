'use client';

import { useChampionshipStore } from '../store';

export default function GroupsPhase() {
  const { groups, updateMatchResult, resetChampionship, newChampionship } = useChampionshipStore();

  const handleResultChange = (matchId: string, homeGoals: string, awayGoals: string) => {
    const hGoals = parseInt(homeGoals) || 0;
    const aGoals = parseInt(awayGoals) || 0;
    updateMatchResult(matchId, hGoals, aGoals);
  };

  const handleNumericInput = (value: string) => {
    // Remove tudo que não é dígito
    return value.replace(/\D/g, '');
  };

  return (
    <div className="px-1">
      <div className="flex justify-between mb-4">
        <button
          onClick={newChampionship}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Novo Campeonato
        </button>
        <button
          onClick={resetChampionship}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Resetar Campeonato
        </button>
      </div>

      {/* Seção de Jogos */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-3 text-gray-800">Jogos</h2>
        <div className="grid gap-2" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
          {groups.map((group) => (
            <div key={`games-${group.name}`} className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-bold mb-4 text-center bg-gray-100 py-2 rounded">{group.name}</h3>
              <div className="space-y-3">
                {group.matches.map((match) => (
                  <div key={match.id} className="bg-gray-50 p-3 rounded border">
                    <div className="flex items-center justify-between">
                      <span className="flex-1 font-medium text-sm truncate pr-2" title={match.home}>
                        {match.home}
                      </span>
                      <input
                        type="text"
                        value={match.homeGoals ?? ''}
                        onChange={(e) => {
                          const numericValue = handleNumericInput(e.target.value);
                          handleResultChange(match.id, numericValue, match.awayGoals?.toString() ?? '');
                        }}
                        className="w-12 text-center border rounded text-sm font-bold"
                        placeholder="0"
                        maxLength={2}
                      />
                      <span className="mx-2 text-gray-600 font-bold">vs</span>
                      <input
                        type="text"
                        value={match.awayGoals ?? ''}
                        onChange={(e) => {
                          const numericValue = handleNumericInput(e.target.value);
                          handleResultChange(match.id, match.homeGoals?.toString() ?? '', numericValue);
                        }}
                        className="w-12 text-center border rounded text-sm font-bold"
                        placeholder="0"
                        maxLength={2}
                      />
                      <span className="flex-1 text-right font-medium text-sm truncate pl-2" title={match.away}>
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
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Classificação</h2>
        <div className="grid gap-2" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
          {groups.map((group) => (
            <div key={`standings-${group.name}`} className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-bold mb-4 text-center bg-gray-100 py-2 rounded">{group.name}</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-base">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="text-left py-3 px-2">Time</th>
                      <th className="text-center py-3 px-1">P</th>
                      <th className="text-center py-3 px-1">V</th>
                      <th className="text-center py-3 px-1">E</th>
                      <th className="text-center py-3 px-1">D</th>
                      <th className="text-center py-3 px-1">GP</th>
                      <th className="text-center py-3 px-1">GC</th>
                      <th className="text-center py-3 px-1">SG</th>
                      <th className="text-center py-3 px-1">Pts</th>
                    </tr>
                  </thead>
                  <tbody>
                    {group.standings.map((standing, index) => (
                      <tr
                        key={standing.team}
                        className={`border-b ${
                          index < 2
                            ? 'bg-green-100 font-semibold'
                            : index >= group.teams.length - 2
                            ? 'bg-red-100'
                            : ''
                        }`}
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