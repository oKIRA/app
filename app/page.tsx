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
            <div className="border-t-2 border-gray-300 pt-8">
              <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Repescagem</h2>
              <PlayInPhase />
            </div>
          </div>
        );
      case 'KNOCKOUT':
        return (
          <div className="space-y-8">
            <GroupsPhase />
            {mode === 'REPECHAGE' && (
              <div className="border-t-2 border-gray-300 pt-8">
                <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Repescagem</h2>
                <PlayInPhase />
              </div>
            )}
            <div className="border-t-2 border-gray-300 pt-8">
              <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Mata-Mata</h2>
              <KnockoutPhase />
            </div>
          </div>
        );
      case 'FINISHED':
        return (
          <div className="space-y-8">
            <GroupsPhase />
            {mode === 'REPECHAGE' && (
              <div className="border-t-2 border-gray-300 pt-8">
                <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Repescagem</h2>
                <PlayInPhase />
              </div>
            )}
            <div className="border-t-2 border-gray-300 pt-8">
              <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Mata-Mata</h2>
              <KnockoutPhase />
            </div>
          </div>
        );
      default:
        return <TeamSetup />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-2">
      <div className="max-w-full mx-auto px-2">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">
            Campeonato de Futebol
          </h1>
          <div className="flex gap-4">
            {status === 'SETUP' && (
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="mode"
                    value="SIMPLE"
                    checked={mode === 'SIMPLE'}
                    onChange={(e) => setMode(e.target.value as 'SIMPLE' | 'REPECHAGE')}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-gray-700">Modo Simples</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="mode"
                    value="REPECHAGE"
                    checked={mode === 'REPECHAGE'}
                    onChange={(e) => setMode(e.target.value as 'SIMPLE' | 'REPECHAGE')}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-gray-700">Modo com Repescagem</span>
                </label>
              </div>
            )}
            {status !== 'SETUP' && (
              <button
                onClick={newChampionship}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
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
