# Frontend - Sistema de Pesquisas de Satisfação

Frontend desenvolvido em React com Vite, Ant Design, Lucide React e Styled Components.

## Tecnologias

- React 18
- Vite
- TypeScript
- Ant Design
- Lucide React
- Styled Components
- React Router DOM
- Axios

## Instalação

```bash
npm install
```

## Configuração

Crie um arquivo `.env` na raiz do projeto com:

```
VITE_API_URL=http://localhost:3000
```

## Execução

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da build
npm run preview
```

## Funcionalidades

### Tela de Login
- Autenticação de usuários
- Validação de formulário
- Redirecionamento após login

### Dashboard
- Visualização de informações da empresa
- Botão para criar nova pesquisa
- Logout

### Criar Pesquisa
- Adicionar até 20 perguntas
- Escolher tipo de resposta (escala 0-5 ou 0-10)
- Adicionar campo opcional de opinião em texto
- Marcar perguntas como opcionais
- Salvar pesquisa no backend

## Estrutura de Pastas

```
src/
  components/     # Componentes reutilizáveis
  contexts/      # Contextos React (Auth)
  pages/         # Páginas da aplicação
  services/      # Serviços de API
  App.tsx        # Componente principal
  main.tsx       # Entry point
```

