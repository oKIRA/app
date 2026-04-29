'use client';

import { useEffect } from 'react';
import { useChampionshipStore } from '../store';
import GroupsPhase from '../components/GroupsPhase';
import KnockoutPhase from '../components/KnockoutPhase';

export default function Home() {
  const { status, groups, initialized, generateChampionship, generateKnockoutPhase, newChampionship } = useChampionshipStore();

  // Inicializar grupos apenas uma vez
  useEffect(() => {
    if (!initialized && groups.length === 0) {
      generateChampionship();
    }
  }, [initialized, groups.length, generateChampionship]);

  const renderContent = () => {
    switch (status) {
      case 'GROUPS':
        return <GroupsPhase />;
      case 'KNOCKOUT':
        return (
          <div className="space-y-8">
            <GroupsPhase />
            <div className="border-t-2 border-[#d8af43]/30 pt-8">
              <h2 className="text-3xl font-bold text-center mb-6 text-[#d8af43]">Mata-Mata</h2>
              <KnockoutPhase />
            </div>
          </div>
        );
      case 'FINISHED':
        return (
          <div className="space-y-8">
            <GroupsPhase />
            <div className="border-t-2 border-[#d8af43]/30 pt-8">
              <h2 className="text-3xl font-bold text-center mb-6 text-[#d8af43]">Mata-Mata</h2>
              <KnockoutPhase />
            </div>
          </div>
        );
      default:
        return <GroupsPhase />;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-2">
      <div className="max-w-full mx-auto px-2">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-[#d8af43] tracking-tight">
              COPA Aliança CONMEBOL Libertadores - FC26
            </h1>
            <p className="mt-2 text-sm uppercase tracking-[0.2em] text-white/80">
              Glória Eterna
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            {status === 'GROUPS' && (
              <button
                onClick={generateKnockoutPhase}
                className="bg-[#d8af43] text-black px-6 py-3 rounded font-bold hover:bg-[#c29f3d] transition-colors"
              >
                🏆 Gerar Mata-Mata
              </button>
            )}
            <button
              onClick={newChampionship}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Resetar
            </button>
          </div>
        </div>

        {renderContent()}
      </div>
    </div>
  );
}
