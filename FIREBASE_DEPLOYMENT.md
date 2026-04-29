# Deployment Firebase Hosting

## Pré-requisitos
1. Instale o Firebase CLI globalmente:
```bash
npm install -g firebase-tools
```

2. Faça login na sua conta Firebase:
```bash
firebase login
```

## Build e Deploy

1. **Build do projeto:**
```bash
npm run build
```

2. **Deploy para Firebase Hosting:**
```bash
firebase deploy
```

## Configuração Automática
Os arquivos foram configurados automaticamente:
- **firebase.ts**: SDK do Firebase já está inicializado
- **firebase.json**: Configuração para servir o build estático
- **.firebaserc**: Projeto Firebase vinculado (guardian-22146)
- **layout.tsx**: Firebase é inicializado no carregamento da app

## Variáveis de Ambiente (opcional)
Se precisar usar variáveis de ambiente sensíveis, crie um arquivo `.env.local`:
```
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyAFehdarWd1iiQLv44FuUW-09BS9nb4lec
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=guardian-22146.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=guardian-22146
```

E atualize o arquivo `firebase.ts` para usar as variáveis de ambiente em produção se desejar.
