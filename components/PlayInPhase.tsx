'use client';

import { useChampionshipStore } from '../store';

export default function PlayInPhase() {
  const { playInMatches, updatePlayInResult } = useChampionshipStore();

  const handleResultChange = (matchId: string, homeGoals: number, awayGoals: number) => {
    updatePlayInResult(matchId, homeGoals, awayGoals);
  };

  const handlePenaltyChange = (matchId: string, homeGoals: number, awayGoals: number, penalties: { home: number; away: number }) => {
    updatePlayInResult(matchId, homeGoals, awayGoals, penalties);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {playInMatches.map((match) => (
        <div key={match.id} className="bg-white rounded-lg shadow-md p-4">
          <div className="text-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Repescagem</h3>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="flex-1 text-right pr-2 font-medium">{match.home}</span>
              <input
                type="number"
                min="0"
                value={match.homeGoals ?? ''}
                onChange={(e) => {
                  const homeGoals = parseInt(e.target.value) || 0;
                  const awayGoals = match.awayGoals ?? 0;
                  handleResultChange(match.id, homeGoals, awayGoals);
                }}
                className="w-16 px-2 py-1 border border-gray-300 rounded text-center"
                disabled={match.winner !== undefined}
              />
            </div>

            <div className="text-center text-sm text-gray-500">vs</div>

            <div className="flex items-center justify-between">
              <input
                type="number"
                min="0"
                value={match.awayGoals ?? ''}
                onChange={(e) => {
                  const awayGoals = parseInt(e.target.value) || 0;
                  const homeGoals = match.homeGoals ?? 0;
                  handleResultChange(match.id, homeGoals, awayGoals);
                }}
                className="w-16 px-2 py-1 border border-gray-300 rounded text-center"
                disabled={match.winner !== undefined}
              />
              <span className="flex-1 text-left pl-2 font-medium">{match.away}</span>
            </div>

            {match.homeGoals !== undefined && match.awayGoals !== undefined && match.homeGoals === match.awayGoals && (
              <div className="border-t pt-3 mt-3">
                <h4 className="text-sm font-medium text-center mb-2">Pênaltis</h4>
                <div className="flex items-center justify-between">
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={match.penalties?.home ?? ''}
                    onChange={(e) => {
                      const homePenalties = parseInt(e.target.value) || 0;
                      const awayPenalties = match.penalties?.away ?? 0;
                      handlePenaltyChange(match.id, match.homeGoals!, match.awayGoals!, {
                        home: homePenalties,
                        away: awayPenalties
                      });
                    }}
                    className="w-16 px-2 py-1 border border-gray-300 rounded text-center text-sm"
                    disabled={match.winner !== undefined}
                  />
                  <span className="text-xs text-gray-500 mx-2">x</span>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={match.penalties?.away ?? ''}
                    onChange={(e) => {
                      const awayPenalties = parseInt(e.target.value) || 0;
                      const homePenalties = match.penalties?.home ?? 0;
                      handlePenaltyChange(match.id, match.homeGoals!, match.awayGoals!, {
                        home: homePenalties,
                        away: awayPenalties
                      });
                    }}
                    className="w-16 px-2 py-1 border border-gray-300 rounded text-center text-sm"
                    disabled={match.winner !== undefined}
                  />
                </div>
              </div>
            )}

            {match.winner && (
              <div className="text-center mt-3 p-2 bg-green-100 rounded">
                <span className="font-bold text-green-800">Vencedor: {match.winner}</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}