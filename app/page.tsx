'use client';

import { useChampionshipStore } from '../store';
import TeamSetup from '../components/TeamSetup';
import GroupsPhase from '../components/GroupsPhase';
import PlayInPhase from '../components/PlayInPhase';
import KnockoutPhase from '../components/KnockoutPhase';

export default function Home() {
  const { status, mode, setMode, newChampionship } = useChampionshipStore();

  const renderContent = () => {
    switch (status) {
      case 'SETUP':
        return <TeamSetup />;
      case 'GROUPS':
        return <GroupsPhase />;
      case 'PLAY_IN':
        return (
          <div className="space-y-8">
            <GroupsPhase />
            <div className="border-t-2 border-[#d8af43]/30 pt-8">
              <h2 className="text-3xl font-bold text-center mb-6 text-[#d8af43]">Repescagem</h2>
              <PlayInPhase />
            </div>
          </div>
        );
      case 'KNOCKOUT':
        return (
          <div className="space-y-8">
            <GroupsPhase />
            {mode === 'REPECHAGE' && (
              <div className="border-t-2 border-[#d8af43]/30 pt-8">
                <h2 className="text-3xl font-bold text-center mb-6 text-[#d8af43]">Repescagem</h2>
                <PlayInPhase />
              </div>
            )}
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
            {mode === 'REPECHAGE' && (
              <div className="border-t-2 border-[#d8af43]/30 pt-8">
                <h2 className="text-3xl font-bold text-center mb-6 text-[#d8af43]">Repescagem</h2>
                <PlayInPhase />
              </div>
            )}
            <div className="border-t-2 border-[#d8af43]/30 pt-8">
              <h2 className="text-3xl font-bold text-center mb-6 text-[#d8af43]">Mata-Mata</h2>
              <KnockoutPhase />
            </div>
          </div>
        );
      default:
        return <TeamSetup />;
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
            {status === 'SETUP' && (
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="mode"
                    value="SIMPLE"
                    checked={mode === 'SIMPLE'}
                    onChange={(e) => setMode(e.target.value as 'SIMPLE' | 'REPECHAGE')}
                    className="w-4 h-4 text-[#d8af43]"
                  />
                  <span className="text-white/80">Modo Simples</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="mode"
                    value="REPECHAGE"
                    checked={mode === 'REPECHAGE'}
                    onChange={(e) => setMode(e.target.value as 'SIMPLE' | 'REPECHAGE')}
                    className="w-4 h-4 text-[#d8af43]"
                  />
                  <span className="text-white/80">Modo com Repescagem</span>
                </label>
              </div>
            )}
            {status !== 'SETUP' && (
              <button
                onClick={newChampionship}
                className="px-4 py-2 bg-[#d8af43] text-black rounded hover:bg-[#c29f3d] transition-colors"
              >
                Novo Campeonato
              </button>
            )}
          </div>
        </div>

        {renderContent()}
      </div>
    </div>
  );
}
