'use client';

import { useChampionshipStore } from '../store';

export default function KnockoutPhase() {
  const { knockoutMatches, updateKnockoutResult, resetChampionship, newChampionship } = useChampionshipStore();

  const handleResultChange = (matchId: string, homeGoals: string, awayGoals: string, penalties?: { home: string; away: string }) => {
    const hGoals = parseInt(homeGoals) || 0;
    const aGoals = parseInt(awayGoals) || 0;
    const pens = penalties ? {
      home: parseInt(penalties.home) || 0,
      away: parseInt(penalties.away) || 0
    } : undefined;
    updateKnockoutResult(matchId, hGoals, aGoals, pens);
  };

  const handleNumericInput = (value: string) => {
    // Remove tudo que não é dígito
    return value.replace(/\D/g, '');
  };

  const rounds = [...new Set(knockoutMatches.map(m => m.round))];

  return (
    <div>
      <div className="flex justify-between mb-4">
        <button
          onClick={newChampionship}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Novo Campeonato
        </button>
        <button
          onClick={resetChampionship}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Resetar Campeonato
        </button>
      </div>

      <div className="space-y-4">
        {rounds.map((round) => (
          <div key={round} className="bg-white p-3 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-4">{round}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {knockoutMatches.filter(m => m.round === round).map((match) => (
                <div key={match.id} className={`border p-3 rounded ${!match.home || !match.away ? 'bg-gray-100 opacity-50' : ''}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`flex-1 text-sm ${!match.home ? 'text-gray-400' : ''}`}>{match.home || '-'}</span>
                    <input
                      type="text"
                      value={match.homeGoals ?? ''}
                      onChange={(e) => {
                        const numericValue = handleNumericInput(e.target.value);
                        handleResultChange(match.id, numericValue, match.awayGoals?.toString() ?? '', match.penalties ? { home: match.penalties.home.toString(), away: match.penalties.away.toString() } : undefined);
                      }}
                      disabled={!match.home || !match.away}
                      className={`w-10 text-center border rounded mx-1 text-sm ${!match.home || !match.away ? 'bg-gray-200 cursor-not-allowed' : ''}`}
                      placeholder="0"
                      maxLength={2}
                    />
                    <span className="text-sm">vs</span>
                    <input
                      type="text"
                      value={match.awayGoals ?? ''}
                      onChange={(e) => {
                        const numericValue = handleNumericInput(e.target.value);
                        handleResultChange(match.id, match.homeGoals?.toString() ?? '', numericValue, match.penalties ? { home: match.penalties.home.toString(), away: match.penalties.away.toString() } : undefined);
                      }}
                      disabled={!match.home || !match.away}
                      className={`w-10 text-center border rounded mx-1 text-sm ${!match.home || !match.away ? 'bg-gray-200 cursor-not-allowed' : ''}`}
                      placeholder="0"
                      maxLength={2}
                    />
                    <span className={`flex-1 text-right text-sm ${!match.away ? 'text-gray-400' : ''}`}>{match.away || '-'}</span>
                  </div>
                  {(match.homeGoals === match.awayGoals && match.homeGoals !== undefined) && (
                    <div className="mt-2">
                      <label className="block text-sm font-medium mb-1">Pênaltis</label>
                      <div className="flex items-center justify-center">
                        <input
                          type="text"
                          value={match.penalties?.home ?? ''}
                          onChange={(e) => {
                            const numericValue = handleNumericInput(e.target.value);
                            handleResultChange(match.id, match.homeGoals?.toString() ?? '', match.awayGoals?.toString() ?? '', { home: numericValue, away: match.penalties?.away.toString() ?? '' });
                          }}
                          className="w-10 text-center border rounded mr-2 text-sm"
                          placeholder="0"
                          maxLength={2}
                        />
                        <span className="text-sm">-</span>
                        <input
                          type="text"
                          value={match.penalties?.away ?? ''}
                          onChange={(e) => {
                            const numericValue = handleNumericInput(e.target.value);
                            handleResultChange(match.id, match.homeGoals?.toString() ?? '', match.awayGoals?.toString() ?? '', { home: match.penalties?.home.toString() ?? '', away: numericValue });
                          }}
                          className="w-10 text-center border rounded ml-2 text-sm"
                          placeholder="0"
                          maxLength={2}
                        />
                      </div>
                    </div>
                  )}
                  {match.winner && (
                    <div className="mt-2 text-center font-bold text-green-600 text-sm">
                      Vencedor: {match.winner}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}