# 📋 Documentação - Campeonato de Futebol

## 🎯 O Que É

Aplicativo web completo para gerenciar campeonatos de futebol estilo FIFA/EA FC com fases de grupos e mata-mata (playoff).

---

## 🏆 Funcionamento

### **Fase 1: Cadastro de Times**
- Adicionar times manualmente
- Colar lista completa (vírgula ou quebra de linha)
- Mínimo: 4 times obrigatórios
- Máximo: 20 times (5 grupos × 4 times cada)

### **Fase 2: Grupos**
- Distribuição automática em grupos (máx. 5 times por grupo)
- Partidas em sistema Round-Robin (todos jogam entre si)
- Inputs de placar com máscara numérica (0-99)
- Classificação atualiza em tempo real

### **Fase 3: Mata-Mata (Playoff)**
- Qualificam-se 2 melhores de cada grupo
- Chaveamento automático inteligente (evita times do mesmo grupo)
- Fases: Semifinal (4T), Quartas (8T), Oitavas (16T)
- Winners progridem automaticamente
- Suporte a pênaltis em empates

---

## 📊 Regras de Pontuação

| Resultado | Pontos |
|-----------|--------|
| Vitória | 3 pontos |
| Empate | 1 ponto |
| Derrota | 0 pontos |

---

## 🔄 Critérios de Desempate

1. **Pontos Total** (maior = melhor)
2. **Saldo de Gols** (maior = melhor)
3. **Gols Pró** (maior = melhor)

---

## 🎮 Sistema de Grupos

### Estrutura
```
Campeonato com N times
├─ Grupo A (até 5 times)
│  ├─ Time 1 vs Time 2
│  ├─ Time 1 vs Time 3
│  └─ ... (todos jogam entre si)
├─ Grupo B (até 5 times)
├─ Grupo C (até 5 times)
└─ Grupo D (até 5 times)
```

### Classificação
- Todos os times aparecem **zerados** desde o início
- Atualização automática após entrada de cada resultado
- Top 2 de cada grupo qualificam para mata-mata

---

## ⚽ Sistema de Mata-Mata

### Chaveamento Inteligente
```
Padrão (4 grupos):
├─ 1º A vs 2º B
├─ 1º B vs 2º C
├─ 1º C vs 2º D
└─ 1º D vs 2º A
```
**Benefício**: Evita confrontos entre times do mesmo grupo

### Progressão
```
Quartas (4 matches)
    ↓
Semifinal (2 matches) ← Winners das Quartas
    ↓
Final (1 match) ← Winners das Semifinais
```

### Pênaltis
- Ativado automaticamente em empates
- Input: Goal.com marcado no pênalti
- Vencedor definido por quem marca mais

---

## 🎨 Interface

### Fase de Grupos
- **Seção "Jogos"**: 4 grupos em linha com matches
- **Seção "Classificação"**: 4 tabelas lado a lado
- Todos os times visíveis o tempo todo

### Fase de Mata-Mata
- Groups permanecem visíveis
- Playoff abaixo com rodadas (Oitavas → Quartas → Semi → Final)
- Matches vazios desabilitados até times avançarem

---

## 💾 Persistência

- ✅ Salvamento automático em localStorage
- ✅ Dados persistem ao recarregar página
- ✅ Botões "Novo Campeonato" e "Resetar" disponíveis

---

## ⚙️ Tecnologia

- **Frontend**: React 18 + TypeScript
- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS
- **Estado**: Zustand com persistência
- **Build**: Turbopack

---

## 🚀 Como Usar

1. **Instalar dependências**:
   ```bash
   npm install
   ```

2. **Executar desenvolvimento**:
   ```bash
   npm run dev
   ```

3. **Build produção**:
   ```bash
   npm run build
   ```

4. **Iniciar servidor**:
   ```bash
   npm run start
   ```

---

## 📱 Responsividade

- ✅ Desktop: 4 grupos em linha
- ✅ Layout otimizado para telas grandes
- ✅ Scroll horizontal para classificação em telas pequenas

---

## ✨ Features

- ✅ Cadastro dinâmico de times
- ✅ Geração automática de grupos
- ✅ Matches com máscara numérica
- ✅ Classificação em tempo real
- ✅ Playoff automático inteligente
- ✅ Avanço automático de vencedores
- ✅ Sistema de pênaltis
- ✅ Persistência de dados
- ✅ Interface moderna e responsiva

---

## 📝 Exemplo de Fluxo

```
1. Adicionar 16 times
   ↓
2. Gerar Campeonato
   ├─ 4 grupos criados automaticamente
   ├─ Classificação zerada
   └─ 18 matches (6 por grupo)
   ↓
3. Entrar resultados dos jogos
   ├─ Classificação atualiza
   ├─ Winners aparecem em verde
   └─ Últimos aparecem em vermelho
   ↓
4. Todos matches do grupo completos
   ├─ Playoff gerado automaticamente
   ├─ 2 primeiros de cada grupo qualificam
   └─ 8 matches de Oitavas criados
   ↓
5. Entrar resultados do Playoff
   ├─ Winners avançam automaticamente
   ├─ Próxima rodada preenche com vencedores
   └─ Final define campeão
```

---

**Versão**: 1.0  
**Data**: Abril 2026  
**Autor**: Campeonato FiFa App
