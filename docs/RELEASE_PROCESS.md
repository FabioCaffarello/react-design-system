# Release Process

Este documento descreve o processo de release automático do React Design System.

## Visão Geral

O projeto utiliza **Semantic Release** para automatizar completamente o processo de versionamento e publicação. O sistema detecta automaticamente mudanças baseadas em [Conventional Commits](https://www.conventionalcommits.org/) e:

1. Determina a próxima versão (major, minor, patch)
2. Gera o changelog automaticamente
3. Publica no NPM
4. Cria uma release no GitHub
5. Faz deploy do Storybook

## Conventional Commits

Para que o semantic release funcione corretamente, todos os commits devem seguir o padrão Conventional Commits:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Tipos de Commit

- `feat`: Nova funcionalidade (minor version)
- `fix`: Correção de bug (patch version)
- `perf`: Melhoria de performance (patch version)
- `refactor`: Refatoração de código (patch version)
- `docs`: Apenas documentação (não gera release)
- `style`: Formatação de código (não gera release)
- `test`: Adição de testes (não gera release)
- `chore`: Tarefas de manutenção (não gera release)
- `ci`: Mudanças em CI/CD (não gera release)
- `build`: Mudanças no sistema de build (não gera release)

### Breaking Changes

Para indicar uma breaking change (major version), adicione `BREAKING CHANGE:` no footer do commit:

```
feat(api): change component API

BREAKING CHANGE: The Button component now requires a 'variant' prop
```

Ou use `!` após o tipo:

```
feat!: change component API
```

## Workflows do GitHub Actions

### 1. CI (`ci.yml`)

Executa em cada push e pull request:

- Lint do código
- Testes unitários
- Testes de stories

### 2. Release (`release.yml`)

Executa em push para `main` (exceto mudanças em `.md`, `.github/**`, `docs/**`):

- Executa testes
- Build do pacote
- **Semantic Release**:
  - Analisa commits
  - Determina versão
  - Gera changelog
  - Publica no NPM
  - Cria tag Git
  - Cria release no GitHub

### 3. Deploy Storybook (`deploy-storybook.yml`)

Executa em push para `main`:

- Build do Storybook
- Deploy para GitHub Pages

## Configuração

### Arquivo de Configuração

O semantic release está configurado em `release.config.js`:

```javascript
module.exports = {
  branches: ["main", "beta", "alpha"],
  plugins: [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    "@semantic-release/changelog",
    "@semantic-release/npm",
    "@semantic-release/git",
    "@semantic-release/github",
  ],
};
```

### Secrets Necessários

No GitHub, configure os seguintes secrets:

- `NPM_TOKEN`: Token de autenticação do NPM (com permissão de publicação)

## Processo Manual (Se Necessário)

Se precisar fazer um release manual:

1. **Atualizar a versão no package.json**:

   ```bash
   npm version patch|minor|major
   ```

2. **Criar changelog manualmente** (se necessário):

   ```bash
   # Editar CHANGELOG.md
   ```

3. **Publicar**:

   ```bash
   npm publish --access public
   ```

4. **Criar tag e release no GitHub**:
   ```bash
   git tag -a v1.0.0 -m "Release v1.0.0"
   git push origin v1.0.0
   ```

## Branches

- `main`: Branch principal, releases automáticos
- `beta`: Branch para releases beta (prerelease)
- `alpha`: Branch para releases alpha (prerelease)

## Changelog

O changelog é gerado automaticamente em `CHANGELOG.md` com base nos commits. Ele é atualizado a cada release e commitado automaticamente.

## Verificação

Para verificar se um commit gerará um release:

```bash
npx semantic-release --dry-run
```

## Troubleshooting

### Release não foi criado

1. Verifique se os commits seguem o padrão Conventional Commits
2. Verifique se há mudanças significativas (não apenas docs, style, etc.)
3. Verifique os logs do GitHub Actions

### Versão incorreta

1. Verifique o tipo de commit usado
2. Verifique se há breaking changes marcados corretamente
3. Consulte `release.config.js` para as regras de versionamento

### NPM publish falhou

1. Verifique se o `NPM_TOKEN` está configurado
2. Verifique se a versão já não existe no NPM
3. Verifique as permissões do token

## Referências

- [Semantic Release](https://semantic-release.gitbook.io/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [GitHub Actions](https://docs.github.com/en/actions)
