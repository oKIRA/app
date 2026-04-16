'use client';

import { useChampionshipStore } from '../store';
import TeamSetup from '../components/TeamSetup';
import GroupsPhase from '../components/GroupsPhase';
import KnockoutPhase from '../components/KnockoutPhase';

export default function Home() {
  const { currentPhase } = useChampionshipStore();

  return (
    <div className="min-h-screen bg-gray-100 p-2">
      <div className="max-w-full mx-auto px-2">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          Campeonato de Futebol
        </h1>

        {currentPhase === 'setup' && <TeamSetup />}
        {currentPhase === 'groups' && <GroupsPhase />}
        {currentPhase === 'knockout' && (
          <div className="space-y-8">
            <GroupsPhase />
            <div className="border-t-2 border-gray-300 pt-8">
              <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Mata-Mata</h2>
              <KnockoutPhase />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
