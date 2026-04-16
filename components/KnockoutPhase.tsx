'use client';

import { useChampionshipStore } from '../store';

export default function KnockoutPhase() {
  const { knockoutMatches, updateKnockoutResult, status } = useChampionshipStore();

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
  const isEditable = status === 'KNOCKOUT' || status === 'FINISHED';
  const finalRound = rounds[rounds.length - 1];

  return (
    <div>
      <div className="space-y-4">
        {rounds.map((round) => {
          const isFinal = round === finalRound && round.toLowerCase().includes('final');
          const roundMatches = knockoutMatches.filter(m => m.round === round);
          
          return (
            <div key={round}>
              {isFinal ? (
                // Renderizar a final centralizada e destacada
                <div className="mb-8">
                  <h3 className="text-3xl font-bold mb-6 text-center text-[#d8af43]">⭐ {round} ⭐</h3>
                  <div className="flex justify-center">
                    {roundMatches.map((match) => (
                      <div key={match.id} className={`border-2 border-[#d8af43] p-6 rounded-lg bg-gradient-to-b from-[#1a1a1a] to-black shadow-2xl max-w-2xl w-full ${!match.home || !match.away ? 'opacity-50' : ''}`}>
                        {/* Time Casa */}
                        <div className="mb-6">
                          <div className="flex items-center justify-between mb-4">
                            <span className={`flex-1 text-xl font-bold ${!match.home ? 'text-gray-600' : 'text-[#d8af43]'}`}>{match.home || '-'}</span>
                            <input
                              type="text"
                              value={match.homeGoals ?? ''}
                              onChange={(e) => {
                                const numericValue = handleNumericInput(e.target.value);
                                handleResultChange(match.id, numericValue, match.awayGoals?.toString() ?? '', match.penalties ? { home: match.penalties.home.toString(), away: match.penalties.away.toString() } : undefined);
                              }}
                              disabled={!match.home || !match.away || !isEditable}
                              className={`w-16 px-3 py-2 text-center border-2 border-[#d8af43]/50 rounded text-2xl font-bold bg-[#0f0f0f] text-[#d8af43] ${!match.home || !match.away || !isEditable ? 'bg-gray-800 cursor-not-allowed opacity-50' : ''}`}
                              placeholder="0"
                              maxLength={2}
                            />
                          </div>
                        </div>

                        {/* VS */}
                        <div className="text-center mb-6">
                          <span className="text-2xl font-bold text-white bg-black/40 px-4 py-2 rounded">vs</span>
                        </div>

                        {/* Time Visitante */}
                        <div className="mb-6">
                          <div className="flex items-center justify-between">
                            <input
                              type="text"
                              value={match.awayGoals ?? ''}
                              onChange={(e) => {
                                const numericValue = handleNumericInput(e.target.value);
                                handleResultChange(match.id, match.homeGoals?.toString() ?? '', numericValue, match.penalties ? { home: match.penalties.home.toString(), away: match.penalties.away.toString() } : undefined);
                              }}
                              disabled={!match.home || !match.away || !isEditable}
                              className={`w-16 px-3 py-2 text-center border-2 border-[#d8af43]/50 rounded text-2xl font-bold bg-[#0f0f0f] text-[#d8af43] ${!match.home || !match.away || !isEditable ? 'bg-gray-800 cursor-not-allowed opacity-50' : ''}`}
                              placeholder="0"
                              maxLength={2}
                            />
                            <span className={`flex-1 text-right text-xl font-bold ${!match.away ? 'text-gray-600' : 'text-[#d8af43]'}`}>{match.away || '-'}</span>
                          </div>
                        </div>

                        {/* Pênaltis */}
                        {(match.homeGoals === match.awayGoals && match.homeGoals !== undefined) && (
                          <div className="mt-6 border-t-2 border-[#d8af43]/30 pt-4">
                            <label className="block text-lg font-bold text-center mb-3 text-[#d8af43]">Pênaltis</label>
                            <div className="flex items-center justify-center gap-4">
                              <input
                                type="text"
                                value={match.penalties?.home ?? ''}
                                onChange={(e) => {
                                  const numericValue = handleNumericInput(e.target.value);
                                  handleResultChange(match.id, match.homeGoals?.toString() ?? '', match.awayGoals?.toString() ?? '', { home: numericValue, away: match.penalties?.away.toString() ?? '' });
                                }}
                                disabled={!isEditable}
                                className={`w-14 text-center border-2 border-[#d8af43]/50 rounded text-xl font-bold bg-[#0f0f0f] text-[#d8af43] ${!isEditable ? 'bg-gray-800 cursor-not-allowed opacity-50' : ''}`}
                                placeholder="0"
                                maxLength={2}
                              />
                              <span className="text-lg font-bold text-[#d8af43]">-</span>
                              <input
                                type="text"
                                value={match.penalties?.away ?? ''}
                                onChange={(e) => {
                                  const numericValue = handleNumericInput(e.target.value);
                                  handleResultChange(match.id, match.homeGoals?.toString() ?? '', match.awayGoals?.toString() ?? '', { home: match.penalties?.home.toString() ?? '', away: numericValue });
                                }}
                                disabled={!isEditable}
                                className={`w-14 text-center border-2 border-[#d8af43]/50 rounded text-xl font-bold bg-[#0f0f0f] text-[#d8af43] ${!isEditable ? 'bg-gray-800 cursor-not-allowed opacity-50' : ''}`}
                                placeholder="0"
                                maxLength={2}
                              />
                            </div>
                          </div>
                        )}

                        {/* Campeão */}
                        {match.winner && (
                          <div className="mt-6 text-center">
                            <div className="bg-gradient-to-r from-[#d8af43] to-yellow-500 p-1 rounded-lg">
                              <div className="bg-black py-4 px-6 rounded">
                                <div className="text-3xl mb-2">🏆</div>
                                <div className="font-bold text-2xl text-[#d8af43] mb-1">CAMPEÃO</div>
                                <div className="font-bold text-2xl text-white">{match.winner}</div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                // Renderizar outras rodadas normalmente
                <div className="libertadores-card p-3 rounded-lg shadow-md">
                  <h3 className="text-xl font-bold mb-4 text-[#d8af43]">{round}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {roundMatches.map((match) => (
                      <div key={match.id} className={`border border-[#d8af43]/30 p-3 rounded bg-black/20 ${!match.home || !match.away ? 'opacity-40' : ''}`}>
                        <div className="flex items-center justify-between mb-2">
                          <span className={`flex-1 text-sm ${!match.home ? 'text-gray-600' : 'text-white'}`}>{match.home || '-'}</span>
                          <input
                            type="text"
                            value={match.homeGoals ?? ''}
                            onChange={(e) => {
                              const numericValue = handleNumericInput(e.target.value);
                              handleResultChange(match.id, numericValue, match.awayGoals?.toString() ?? '', match.penalties ? { home: match.penalties.home.toString(), away: match.penalties.away.toString() } : undefined);
                            }}
                            disabled={!match.home || !match.away || !isEditable}
                            className={`w-10 text-center border border-[#d8af43]/30 rounded mx-1 text-sm bg-[#0f0f0f] text-white ${!match.home || !match.away || !isEditable ? 'bg-gray-800 cursor-not-allowed opacity-50' : ''}`}
                            placeholder="0"
                            maxLength={2}
                          />
                          <span className="text-sm text-white">vs</span>
                          <input
                            type="text"
                            value={match.awayGoals ?? ''}
                            onChange={(e) => {
                              const numericValue = handleNumericInput(e.target.value);
                              handleResultChange(match.id, match.homeGoals?.toString() ?? '', numericValue, match.penalties ? { home: match.penalties.home.toString(), away: match.penalties.away.toString() } : undefined);
                            }}
                            disabled={!match.home || !match.away || !isEditable}
                            className={`w-10 text-center border border-[#d8af43]/30 rounded mx-1 text-sm bg-[#0f0f0f] text-white ${!match.home || !match.away || !isEditable ? 'bg-gray-800 cursor-not-allowed opacity-50' : ''}`}
                            placeholder="0"
                            maxLength={2}
                          />
                          <span className={`flex-1 text-right text-sm ${!match.away ? 'text-gray-600' : 'text-white'}`}>{match.away || '-'}</span>
                        </div>
                        {(match.homeGoals === match.awayGoals && match.homeGoals !== undefined) && (
                          <div className="mt-2 border-t border-[#d8af43]/20 pt-2">
                            <label className="block text-sm font-medium mb-1 text-[#d8af43]">Pênaltis</label>
                            <div className="flex items-center justify-center">
                              <input
                                type="text"
                                value={match.penalties?.home ?? ''}
                                onChange={(e) => {
                                  const numericValue = handleNumericInput(e.target.value);
                                  handleResultChange(match.id, match.homeGoals?.toString() ?? '', match.awayGoals?.toString() ?? '', { home: numericValue, away: match.penalties?.away.toString() ?? '' });
                                }}
                                disabled={!isEditable}
                                className={`w-10 text-center border border-[#d8af43]/30 rounded mr-2 text-sm bg-[#0f0f0f] text-white ${!isEditable ? 'bg-gray-800 cursor-not-allowed opacity-50' : ''}`}
                                placeholder="0"
                                maxLength={2}
                              />
                              <span className="text-sm text-gray-400">-</span>
                              <input
                                type="text"
                                value={match.penalties?.away ?? ''}
                                onChange={(e) => {
                                  const numericValue = handleNumericInput(e.target.value);
                                  handleResultChange(match.id, match.homeGoals?.toString() ?? '', match.awayGoals?.toString() ?? '', { home: match.penalties?.home.toString() ?? '', away: numericValue });
                                }}
                                disabled={!isEditable}
                                className={`w-10 text-center border border-[#d8af43]/30 rounded ml-2 text-sm bg-[#0f0f0f] text-white ${!isEditable ? 'bg-gray-800 cursor-not-allowed opacity-50' : ''}`}
                                placeholder="0"
                                maxLength={2}
                              />
                            </div>
                          </div>
                        )}
                        {match.winner && (
                          <div className="mt-2 text-center font-bold text-green-400 text-sm bg-green-900/40 py-2 rounded border border-green-500/30">
                            Vencedor: {match.winner}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}