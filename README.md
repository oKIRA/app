# Campeonato de Futebol

Um aplicativo web completo para gerenciamento de campeonatos de futebol estilo FIFA/EA FC, com foco em automação total, usabilidade e interface moderna.

## Tecnologias Utilizadas

- **Frontend**: React + TypeScript
- **Framework**: Next.js (App Router)
- **Estilização**: Tailwind CSS
- **Estado**: Zustand
- **Persistência**: localStorage

## Funcionalidades

### 1. Cadastro Dinâmico de Times
- Adicionar lista completa de times (mínimo 4 times obrigatórios)
- Lista editável (remover/editar nomes)
- Suporte a colar lista separada por vírgula ou quebra de linha
- Contador de times detectados com validação visual
- Botão "Gerar Campeonato" habilitado apenas com 4+ times

### 2. Geração Automática de Grupos
- Máximo de 5 times por grupo
- Distribuição equilibrada entre grupos
- Nomeação automática (Grupo A, B, C...)

### 3. Sistema de Partidas (Round-Robin)
- Todos os times jogam entre si por grupo
- Geração automática de partidas
- **Inputs de placar com máscara numérica** (apenas números permitidos)
- Campos de texto com validação automática

### 4. Classificação Automática
- Cálculo automático de pontos, vitórias, empates, derrotas, etc.
- Ordenação por pontos, saldo de gols, gols pró
- Destaques visuais para classificados (verde) e eliminados (vermelho)

### 5. Interface da Fase de Grupos
- **Layout separado**: jogos e classificação em seções distintas
- **Grid responsivo de 4 colunas** para classificações
- **Grid espaçoso para jogos** (até 3 colunas em telas grandes)
- Tabela de classificação sempre visível
- Destaques visuais para classificados (verde) e eliminados (vermelho)
- **Grupos permanecem visíveis mesmo após término das partidas**
- **Nomes de times grandes**: truncate com tooltip para evitar quebras de linha

### 6. Mata-Mata Automático
- Classificação automática dos 2 melhores de cada grupo- **Chaveamento inteligente**: evita confrontos entre times do mesmo grupo
- Padrão: 1ºA vs 2ºB, 1ºB vs 2ºA, 1ºC vs 2ºD, 1ºD vs 2ºC- Geração de chaves: semifinal (4 times), quartas (8), oitavas (16)
- Sistema de pênaltis para empates
- **Playoffs exibidos logo abaixo dos grupos**
- **Inputs com máscara numérica** igual aos grupos

### 7. Interface Moderna
- Layout responsivo (mobile e desktop)
- Cards e grids
- Transições suaves
- UX intuitiva

### 8. Persistência
- Salvamento automático no localStorage
- Restauração do estado ao recarregar

## Como Executar

1. Instale as dependências:
```bash
npm install
```

2. Execute o servidor de desenvolvimento:
```bash
npm run dev
```

3. Abra [http://localhost:3000](http://localhost:3000) no navegador.

## Estrutura do Projeto

```
app/
├── app/
│   ├── page.tsx          # Página principal
│   └── layout.tsx        # Layout da aplicação
├── components/
│   ├── TeamSetup.tsx     # Cadastro de times
│   ├── GroupsPhase.tsx   # Fase de grupos
│   └── KnockoutPhase.tsx # Mata-mata
├── store.ts              # Estado global (Zustand)
└── ...
```

## Regras do Campeonato

- **Vitória**: 3 pontos
- **Empate**: 1 ponto
- **Derrota**: 0 pontos
- **Critérios de desempate**: Pontos → Saldo de Gols → Gols Pró → Confronto Direto

## Deploy

O projeto pode ser facilmente implantado na Vercel ou qualquer plataforma que suporte Next.js.
