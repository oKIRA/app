'use client';

import { useChampionshipStore } from '../store';

export default function PlayInPhase() {
  const { playInMatches, updatePlayInResult, status } = useChampionshipStore();

  const handleResultChange = (matchId: string, homeGoals: number, awayGoals: number) => {
    updatePlayInResult(matchId, homeGoals, awayGoals);
  };

  const handlePenaltyChange = (matchId: string, homeGoals: number, awayGoals: number, penalties: { home: number; away: number }) => {
    updatePlayInResult(matchId, homeGoals, awayGoals, penalties);
  };

  const handleNumericInput = (value: string) => {
    // Remove tudo que não é dígito
    return value.replace(/\D/g, '');
  };

  const isEditable = status === 'PLAY_IN';

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {playInMatches.map((match) => (
        <div key={match.id} className="libertadores-card rounded-lg shadow-md p-4">
          <div className="text-center mb-4">
            <h3 className="text-lg font-semibold text-[#d8af43]">Repescagem</h3>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="flex-1 text-right pr-2 font-medium">{match.home}</span>
              <input
                type="text"
                value={match.homeGoals ?? ''}
                onChange={(e) => {
                  const numericValue = handleNumericInput(e.target.value);
                  const homeGoals = parseInt(numericValue) || 0;
                  const awayGoals = match.awayGoals ?? 0;
                  handleResultChange(match.id, homeGoals, awayGoals);
                }}
                className={`w-16 px-2 py-1 border border-[#d8af43]/30 rounded text-center bg-[#0f0f0f] text-white ${!isEditable ? 'bg-gray-800 cursor-not-allowed opacity-50' : ''}`}
                disabled={!isEditable}
                placeholder="0"
                maxLength={2}
              />
            </div>

            <div className="text-center text-sm text-gray-400">vs</div>

            <div className="flex items-center justify-between">
              <input
                type="text"
                value={match.awayGoals ?? ''}
                onChange={(e) => {
                  const numericValue = handleNumericInput(e.target.value);
                  const awayGoals = parseInt(numericValue) || 0;
                  const homeGoals = match.homeGoals ?? 0;
                  handleResultChange(match.id, homeGoals, awayGoals);
                }}
                className={`w-16 px-2 py-1 border border-[#d8af43]/30 rounded text-center bg-[#0f0f0f] text-white ${!isEditable ? 'bg-gray-800 cursor-not-allowed opacity-50' : ''}`}
                disabled={!isEditable}
                placeholder="0"
                maxLength={2}
              />
              <span className="flex-1 text-left pl-2 font-medium">{match.away}</span>
            </div>

            {match.homeGoals !== undefined && match.awayGoals !== undefined && match.homeGoals === match.awayGoals && (
              <div className="border-t pt-3 mt-3">
                <h4 className="text-sm font-medium text-center mb-2">Pênaltis</h4>
                <div className="flex items-center justify-between">
                  <input
                    type="text"
                    placeholder="0"
                    value={match.penalties?.home ?? ''}
                    onChange={(e) => {
                      const numericValue = handleNumericInput(e.target.value);
                      const homePenalties = parseInt(numericValue) || 0;
                      const awayPenalties = match.penalties?.away ?? 0;
                      handlePenaltyChange(match.id, match.homeGoals!, match.awayGoals!, {
                        home: homePenalties,
                        away: awayPenalties
                      });
                    }}
                    className={`w-16 px-2 py-1 border border-[#d8af43]/30 rounded text-center text-sm bg-[#0f0f0f] text-white ${!isEditable ? 'bg-gray-800 cursor-not-allowed opacity-50' : ''}`}
                    disabled={!isEditable}
                    maxLength={2}
                  />
                  <span className="text-xs text-gray-400 mx-2">x</span>
                  <input
                    type="text"
                    placeholder="0"
                    value={match.penalties?.away ?? ''}
                    onChange={(e) => {
                      const numericValue = handleNumericInput(e.target.value);
                      const awayPenalties = parseInt(numericValue) || 0;
                      const homePenalties = match.penalties?.home ?? 0;
                      handlePenaltyChange(match.id, match.homeGoals!, match.awayGoals!, {
                        home: homePenalties,
                        away: awayPenalties
                      });
                    }}
                    className={`w-16 px-2 py-1 border border-[#d8af43]/30 rounded text-center text-sm bg-[#0f0f0f] text-white ${!isEditable ? 'bg-gray-800 cursor-not-allowed opacity-50' : ''}`}
                    disabled={!isEditable}
                    maxLength={2}
                  />
                </div>
              </div>
            )}

            {match.winner && (
              <div className="text-center mt-3 p-2 bg-green-900/40 rounded border border-green-500/30">
                <span className="font-bold text-green-400">Vencedor: {match.winner}</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}