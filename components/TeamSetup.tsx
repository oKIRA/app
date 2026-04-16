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
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Cadastro de Times</h2>

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
          className="border p-2 rounded w-full h-32 resize-none"
          rows={6}
        />
        <div className="mt-2 flex items-center justify-between">
          <span className={`text-sm ${getTeamCount() >= 4 ? 'text-green-600' : 'text-red-600'}`}>
            Times detectados: {getTeamCount()} (mínimo: 4)
          </span>
          <button
            onClick={handleAddTeamList}
            disabled={!canAddTeams}
            className={`px-4 py-2 rounded ${
              canAddTeams
                ? 'bg-green-500 text-white hover:bg-green-600'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Adicionar Times
          </button>
        </div>
      </div>

      <ul className="mb-4">
        {teams.map((team, index) => (
          <li key={index} className="flex items-center justify-between p-2 border-b">
            {editingIndex === index ? (
              <div className="flex items-center w-full">
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="border p-1 rounded mr-2 flex-1"
                  onKeyPress={(e) => e.key === 'Enter' && handleSaveEdit()}
                />
                <button
                  onClick={handleSaveEdit}
                  className="bg-green-500 text-white px-2 py-1 rounded mr-1"
                >
                  Salvar
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="bg-gray-500 text-white px-2 py-1 rounded"
                >
                  Cancelar
                </button>
              </div>
            ) : (
              <>
                <span>{team}</span>
                <div>
                  <button
                    onClick={() => handleEditTeam(index)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded mr-1"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => removeTeam(index)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
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
          className="bg-green-500 text-white px-4 py-2 rounded w-full"
        >
          Gerar Campeonato
        </button>
      )}
    </div>
  );
}