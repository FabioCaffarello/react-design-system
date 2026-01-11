# Instruções para Publicar Design System v1.2.0

## Status Atual

✅ **4 novos componentes desenvolvidos e testados:**
- Badge (Atom)
- Select (Atom)
- Textarea (Atom)
- Card (Molecule)

✅ **Build executado com sucesso**
✅ **Versão atualizada para `1.2.0`**
✅ **75 testes passando (100%)**

## Componentes Incluídos

### Badge
- 5 variantes (success, warning, error, info, neutral)
- Acessível e documentado
- 9 testes unitários

### Select
- Dropdown estilizado
- Suporte a placeholder e erro
- 7 testes unitários

### Textarea
- Textarea estilizado
- Controle de resize
- 8 testes unitários

### Card
- Card versátil com variantes
- Opções de padding
- 9 testes unitários

## Passos para Publicação

### 1. Verificar Build
```bash
cd react-design-system
npm run build
```

### 2. Verificar Testes
```bash
npm test
```

Deve mostrar: **75 passed (75)**

### 3. Verificar Versão
```bash
cat package.json | grep version
```

Deve mostrar: `"version": "1.2.0"`

### 4. Fazer Login no npm (se necessário)
```bash
npm login
```

Você será solicitado a inserir:
- Username
- Password
- Email
- OTP (se 2FA estiver habilitado)

### 5. Publicar
```bash
npm publish
```

### 6. Verificar Publicação
```bash
npm view @fabio.caffarello/react-design-system version
```

Deve retornar: `1.2.0`

## Após Publicação

### Atualizar Motiflow Dashboard

1. Atualizar `package.json`:
   ```json
   "@fabio.caffarello/react-design-system": "^1.2.0"
   ```

2. Instalar dependência:
   ```bash
   cd web/motiflow-dashboard
   npm install
   ```

3. Reiniciar container Docker:
   ```bash
   cd infra/docker
   docker compose --profile dev restart motiflow-dashboard
   ```

## Validação

Após atualizar, verificar:
- ✅ Badges aparecem nas páginas `/epics`, `/stories`, `/tasks`
- ✅ Select funciona nos formulários
- ✅ Textarea funciona nos formulários
- ✅ Card pode ser usado onde necessário
- ✅ Sem erros no console
- ✅ Acessibilidade funcionando

## Migração no Dashboard

Os seguintes componentes já foram migrados para usar Badge:
- ✅ `EpicCard`
- ✅ `StoryCard`
- ✅ `TaskCard`

Os novos componentes (Select, Textarea, Card) podem ser usados em:
- Formulários de criação/edição
- Substituição de BoxWrapper por Card onde apropriado

## Rollback (se necessário)

Se houver problemas, pode voltar para versão anterior:
```json
"@fabio.caffarello/react-design-system": "^1.0.0"
```

Ou usar versão local temporariamente:
```json
"@fabio.caffarello/react-design-system": "file:../../react-design-system"
```
