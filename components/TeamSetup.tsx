'use client';

import { useState } from 'react';
import { useChampionshipStore } from '../store';

export default function TeamSetup() {
  const { teams, addTeam, removeTeam, editTeam, generateChampionship } = useChampionshipStore();
  const [teamList, setTeamList] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editName, setEditName] = useState('');

  const handleAddTeamList = () => {
    if (teamList.trim()) {
      const newTeams = teamList
        .split(/[\n,]/)
        .map(team => team.trim())
        .filter(team => team.length > 0);

      if (newTeams.length >= 4) {
        newTeams.forEach(team => addTeam(team));
        setTeamList('');
      }
    }
  };

  const handleEditTeam = (index: number) => {
    setEditingIndex(index);
    setEditName(teams[index]);
  };

  const handleSaveEdit = () => {
    if (editingIndex !== null && editName.trim()) {
      editTeam(editingIndex, editName.trim());
      setEditingIndex(null);
      setEditName('');
    }
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditName('');
  };

  const getTeamCount = () => {
    if (!teamList.trim()) return 0;
    return teamList
      .split(/[\n,]/)
      .map(team => team.trim())
      .filter(team => team.length > 0).length;
  };

  const canAddTeams = getTeamCount() >= 4;

  return (
    <div className="libertadores-card p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-[#d8af43]">Cadastro de Times</h2>

      <div className="mb-4">
        <textarea
          value={teamList}
          onChange={(e) => setTeamList(e.target.value)}
          placeholder={`Cole uma lista de pelo menos 4 times separados por vírgula ou quebra de linha
Exemplo:
Flamengo
Palmeiras
São Paulo
Corinthians
Grêmio`}
          className="border border-[#d8af43]/30 p-2 rounded w-full h-32 resize-none bg-[#0f0f0f] text-white placeholder-gray-600"
          rows={6}
        />
        <div className="mt-2 flex items-center justify-between">
          <span className={`text-sm ${getTeamCount() >= 4 ? 'text-green-400' : 'text-red-400'}`}>
            Times detectados: {getTeamCount()} (mínimo: 4)
          </span>
          <button
            onClick={handleAddTeamList}
            disabled={!canAddTeams}
            className={`px-4 py-2 rounded ${
              canAddTeams
                ? 'bg-[#d8af43] text-black hover:bg-[#c29f3d] font-semibold'
                : 'bg-gray-700 text-gray-500 cursor-not-allowed'
            }`}
          >
            Adicionar Times
          </button>
        </div>
      </div>

      <ul className="mb-4 border border-[#d8af43]/20 rounded">
        {teams.map((team, index) => (
          <li key={index} className="flex items-center justify-between p-3 border-b border-[#d8af43]/20 last:border-b-0 bg-black/20">
            {editingIndex === index ? (
              <div className="flex items-center w-full gap-2">
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="border border-[#d8af43]/30 p-2 rounded mr-2 flex-1 bg-[#0f0f0f] text-white"
                  onKeyPress={(e) => e.key === 'Enter' && handleSaveEdit()}
                />
                <button
                  onClick={handleSaveEdit}
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                >
                  Salvar
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded"
                >
                  Cancelar
                </button>
              </div>
            ) : (
              <>
                <span className="text-white">{team}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditTeam(index)}
                    className="bg-[#d8af43] hover:bg-[#c29f3d] text-black px-3 py-1 rounded font-semibold"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => removeTeam(index)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                  >
                    Remover
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>

      {teams.length >= 4 && (
        <button
          onClick={generateChampionship}
          className="bg-[#d8af43] hover:bg-[#c29f3d] text-black px-4 py-3 rounded w-full font-bold text-lg"
        >
          Gerar Campeonato
        </button>
      )}
    </div>
  );
}