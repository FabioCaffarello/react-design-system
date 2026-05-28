# CI/CD Pipeline Documentation

Este documento descreve o pipeline de CI/CD configurado para o React Design System.

## Visão Geral

O projeto utiliza GitHub Actions para automatizar:

- ✅ Testes e linting em cada PR
- ✅ Build e publicação automática no NPM
- ✅ Geração automática de changelog
- ✅ Versionamento semântico automático
- ✅ Deploy automático do Storybook

## Workflows

### 1. CI (`ci.yml`)

**Trigger**: Push e Pull Requests para `main`

**Ações**:

- Instala dependências
- Executa ESLint
- Executa testes unitários e de stories
- Instala browsers do Playwright para testes

**Status**: ✅ Configurado e funcionando

### 2. Release (`release.yml`)

**Trigger**: Push para `main` (ignorando mudanças em `.md`, `.github/**`, `docs/**`)

**Ações**:

- Executa testes e lint
- Build do pacote
- **Semantic Release**:
  - Analisa commits seguindo [Conventional Commits](https://www.conventionalcommits.org/)
  - Determina a próxima versão (major, minor, patch)
  - Gera changelog automaticamente
  - Publica no NPM
  - Cria tag Git
  - Cria GitHub Release

**Plugins do Semantic Release**:

- `@semantic-release/commit-analyzer` - Analisa commits
- `@semantic-release/release-notes-generator` - Gera notas de release
- `@semantic-release/changelog` - Atualiza CHANGELOG.md
- `@semantic-release/npm` - Publica no NPM
- `@semantic-release/git` - Commita mudanças (CHANGELOG, package.json)
- `@semantic-release/github` - Cria GitHub Release

**Status**: ✅ Configurado e funcionando

### 3. Deploy Storybook (`deploy-storybook.yml`)

**Trigger**: Push para `main`

**Ações**:

- Build do Storybook
- Deploy para GitHub Pages

**URL**: `https://{owner}.github.io/{repo}/`

**Status**: ✅ Configurado e funcionando

## Versionamento Semântico

O projeto segue [Semantic Versioning](https://semver.org/) (MAJOR.MINOR.PATCH).

### Como Funciona

O semantic-release analisa os commits desde a última release e determina o tipo de versão:

- **BREAKING CHANGE** ou `feat!` → **MAJOR** (1.0.0 → 2.0.0)
- `feat` → **MINOR** (1.0.0 → 1.1.0)
- `fix` → **PATCH** (1.0.0 → 1.0.1)
- `chore`, `docs`, `refactor`, `style`, `test` → Sem release (a menos que contenham BREAKING CHANGE)

### Formato de Commits

Use [Conventional Commits](https://www.conventionalcommits.org/):

```bash
# Feature (minor)
feat: add new Button variant

# Fix (patch)
fix: resolve Button onClick issue

# Breaking change (major)
feat!: remove deprecated API

# Ou
feat: new API
BREAKING CHANGE: old API removed
```

### Exemplos

```bash
# Patch release (1.8.0 → 1.8.1)
fix: correct import path in Table component

# Minor release (1.8.0 → 1.9.0)
feat: add new Switch component

# Major release (1.8.0 → 2.0.0)
feat!: refactor theme system
BREAKING CHANGE: ThemeProvider API changed
```

## Changelog Automático

O changelog é gerado automaticamente pelo `@semantic-release/changelog` baseado nos commits.

**Arquivo**: `CHANGELOG.md`

**Formato**:

```markdown
## [1.9.0] - 2024-01-15

### Added

- New Switch component
- New Rating component

### Fixed

- Table import paths corrected

### Changed

- Improved Button performance
```

## Secrets Necessários

### NPM_TOKEN

Token do NPM para publicação automática.

**Como obter**:

1. Acesse https://www.npmjs.com/settings/{username}/tokens
2. Crie um token "Automation"
3. Adicione como secret no GitHub: `Settings > Secrets > Actions > New repository secret`

**Nome**: `NPM_TOKEN`

### GITHUB_TOKEN

Token automático fornecido pelo GitHub Actions. Não precisa ser configurado manualmente.

## Fluxo Completo

1. **Desenvolvedor faz commit**:

   ```bash
   git commit -m "feat: add new component"
   git push origin main
   ```

2. **CI roda**:
   - Testes passam ✅
   - Lint passa ✅

3. **Release roda** (se não for apenas docs):
   - Semantic Release analisa commits
   - Determina versão (ex: 1.8.0 → 1.9.0)
   - Atualiza CHANGELOG.md
   - Atualiza package.json
   - Publica no NPM
   - Cria tag Git (v1.9.0)
   - Cria GitHub Release

4. **Storybook Deploy roda**:
   - Build do Storybook
   - Deploy para GitHub Pages

## Troubleshooting

### Release não está sendo criado

**Causa**: Commits não seguem Conventional Commits ou são apenas `chore/docs`

**Solução**: Use `feat:` ou `fix:` nos commits

### NPM publish falha

**Causa**: Token NPM_TOKEN não configurado ou inválido

**Solução**: Verifique se o secret `NPM_TOKEN` está configurado corretamente

### Storybook não atualiza

**Causa**: GitHub Pages pode ter cache

**Solução**: Aguarde alguns minutos ou limpe o cache do navegador

## Referências

- [Semantic Release](https://semantic-release.gitbook.io/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Semantic Versioning](https://semver.org/)
- [GitHub Actions](https://docs.github.com/en/actions)
